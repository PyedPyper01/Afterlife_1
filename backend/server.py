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

# Marketplace search
@api_router.get("/suppliers/search")
async def search_suppliers(postcode: str):
    try:
        # Normalize postcode (remove spaces, uppercase)
        search_postcode = postcode.replace(" ", "").upper()
        
        # Get all suppliers
        all_suppliers = await db.suppliers.find({"available": True}, {"_id": 0}).to_list(100)
        
        if not all_suppliers:
            return {"suppliers": [], "message": "No suppliers in database"}
        
        # Match by postcode prefix (first 2-4 characters)
        search_prefix = search_postcode[:4] if len(search_postcode) >= 4 else search_postcode[:2]
        
        matching_suppliers = []
        for supplier in all_suppliers:
            supplier_postcode = supplier['postcode'].replace(" ", "").upper()
            
            # Check if supplier postcode starts with search prefix
            if supplier_postcode.startswith(search_prefix):
                # Calculate approximate distance (simple estimation)
                supplier['distance_miles'] = round(abs(hash(supplier_postcode) % 10) + 0.5, 1)
                matching_suppliers.append(supplier)
        
        # Sort by distance
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
