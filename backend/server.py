from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import os
from dotenv import load_dotenv
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient

# Import emergentintegrations for OpenAI
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB setup
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'premium_tribute_db')]

app = FastAPI(title="AfterLife API")
api_router = APIRouter(prefix="/api")

# Get LLM key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Models
class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []

class ChatResponse(BaseModel):
    response: str

# System prompt for AI
SYSTEM_PROMPT = """You are an expert bereavement advisor for AfterLife, a comprehensive UK support platform. Provide detailed, professional guidance.

YOUR EXPERTISE:
- UK death registration procedures and legal requirements
- Probate and estate administration
- Funeral planning and cultural/religious considerations
- Practical immediate actions after a death
- Emotional support resources

RESPONSE STYLE:
- Professional yet compassionate
- Provide specific, actionable steps with details
- Include relevant phone numbers, timelines, and legal requirements
- Give comprehensive answers (4-6 sentences minimum for complex topics)
- When discussing services (funeral directors, florists, masons, venues, caterers), guide users to our Marketplace

KEY UK INFORMATION:
- Death registration: 5 days (England/Wales), 8 days (Scotland)
- Tell Us Once service: Available at registration to notify government departments
- Probate required: When estate value exceeds £5,000 or includes property
- Inheritance tax threshold: £325,000 (with exemptions for spouse/charity)
- Medical Certificate of Cause of Death (MCCD): Required before registration
- Coroner involvement: Unexpected, unexplained, or violent deaths

IMPORTANT CONTACTS:
- Samaritans (24/7 emotional support): 116 123
- Cruse Bereavement Care: 0808 808 1677
- Citizens Advice: 0800 144 8848
- DWP Bereavement Service: 0800 731 0469
- HMRC Probate Helpline: 0300 123 1072

MARKETPLACE GUIDANCE:
When users need services, say: "You can find verified [service type] in our Marketplace. Simply enter your postcode to see local professionals with ratings, contact details, and verified credentials. Would you like specific guidance on choosing a [service type]?"

Always provide thorough, expert-level guidance."""

# Health check
@api_router.get("/")
async def root():
    return {"status": "healthy", "service": "AfterLife API"}

# Chat endpoint
@api_router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        if not EMERGENT_LLM_KEY:
            raise HTTPException(status_code=500, detail="AI not configured")
        
        # Initialize chat with session_id
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id="chat-session",
            system_message=SYSTEM_PROMPT
        ).with_model("openai", "gpt-4o")
        
        # Send message
        user_msg = UserMessage(text=request.message)
        response = await chat.send_message(user_msg)
        
        return ChatResponse(response=response)
    
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Marketplace search with AI-generated suppliers
@api_router.get("/suppliers/search")
async def search_suppliers(postcode: str):
    try:
        import json
        import random
        
        # Normalize postcode
        search_postcode = postcode.replace(" ", "").upper()
        
        # Check database first
        db_suppliers = await db.suppliers.find({"available": True}, {"_id": 0}).to_list(100)
        search_prefix = search_postcode[:4] if len(search_postcode) >= 4 else search_postcode[:2]
        
        matching_suppliers = []
        for supplier in db_suppliers:
            supplier_postcode = supplier['postcode'].replace(" ", "").upper()
            if supplier_postcode.startswith(search_prefix):
                supplier['distance_miles'] = round(abs(hash(supplier_postcode) % 10) + 0.5, 1)
                matching_suppliers.append(supplier)
        
        # If no suppliers, generate with AI using UNIQUE session and seed
        if len(matching_suppliers) == 0 and EMERGENT_LLM_KEY:
            try:
                # Use unique session ID with timestamp to avoid caching
                import time
                unique_session = f"supplier-{search_postcode}-{int(time.time())}-{random.randint(1000,9999)}"
                
                chat = LlmChat(
                    api_key=EMERGENT_LLM_KEY,
                    session_id=unique_session,
                    system_message="""Generate realistic UK funeral service suppliers. Output ONLY JSON array, no markdown.
Format: [{"name":"Business Name","type":"funeral_director","address":"Street, City","postcode":"XX1 1XX","phone":"01234 567890","verified":true,"rating":4.5,"distance_miles":2.1}]

IMPORTANT: 
- Use REAL UK street names and areas for the postcode given
- Generate DIFFERENT business names each time
- Types: funeral_director, florist, mason
- UK phone format: 5-digit area code
- Mix of ratings 4.2-4.9
- Distance 0.5-8.0 miles"""
                ).with_model("openai", "gpt-4o-mini")
                
                # Get postcode area name
                postcode_area = search_postcode[:2]
                area_names = {
                    'SW': 'South West London', 'NW': 'North West London', 'SE': 'South East London', 
                    'E': 'East London', 'W': 'West London', 'N': 'North London',
                    'M': 'Manchester', 'B': 'Birmingham', 'LS': 'Leeds', 'EH': 'Edinburgh',
                    'G': 'Glasgow', 'BS': 'Bristol', 'L': 'Liverpool', 'NE': 'Newcastle',
                    'CF': 'Cardiff', 'OX': 'Oxford', 'CB': 'Cambridge', 'BN': 'Brighton'
                }
                area_name = area_names.get(postcode_area, 'UK')
                
                prompt = f"""Generate 5 DIFFERENT, REALISTIC funeral service suppliers for {area_name}, postcode {postcode}.

Include mix of:
- 2 funeral directors
- 2 florists
- 1 mason/memorial

Use REAL street names from {area_name}. Make business names UNIQUE and location-specific (not "Heritage" or "Peaceful"). Output ONLY the JSON array."""
                
                response = await chat.send_message(UserMessage(text=prompt))
                
                # Clean and parse
                clean_response = response.strip()
                if '```' in clean_response:
                    clean_response = clean_response.split('```')[1]
                    if clean_response.startswith('json'):
                        clean_response = clean_response[4:]
                clean_response = clean_response.strip()
                
                ai_suppliers = json.loads(clean_response)
                
                # Ensure different distances and mark as AI
                for i, supplier in enumerate(ai_suppliers):
                    supplier['ai_generated'] = True
                    supplier['distance_miles'] = round(random.uniform(0.5, 8.0), 1)
                    supplier['postcode'] = postcode  # Ensure correct postcode
                
                matching_suppliers = ai_suppliers
                    
            except Exception as ai_error:
                print(f"AI generation error: {ai_error}")
        
        matching_suppliers.sort(key=lambda x: x.get('distance_miles', 999))
        
        return {
            "suppliers": matching_suppliers[:20],
            "count": len(matching_suppliers),
            "search_postcode": postcode
        }
    
    except Exception as e:
        print(f"Search error: {e}")
        return {"suppliers": [], "error": str(e)}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
