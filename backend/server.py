from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv
from pathlib import Path

# Import emergentintegrations for OpenAI
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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
SYSTEM_PROMPT = """You are a compassionate bereavement support assistant for AfterLife, a UK platform.

IMPORTANT GUIDANCE RULES:
1. Be empathetic and supportive
2. Provide practical UK-specific guidance
3. When users ask about finding services (funeral directors, florists, etc.), suggest they visit the Marketplace
4. Keep responses concise (2-4 sentences unless detailed instructions needed)

UK KEY INFORMATION:
- Death registration: 5 days (England/Wales), 8 days (Scotland)
- Tell Us Once: Notify government departments at once during registration
- Probate threshold: £5,000 in England/Wales
- Samaritans: 116 123 (24/7 support)
- Cruse Bereavement: 0808 808 1677

Always be supportive and guide users to appropriate resources."""

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

# Health check
@api_router.get("/")
async def root():
    return {"status": "healthy", "service": "AfterLife API"}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Keep existing supplier routes
from motor.motor_asyncio import AsyncIOMotorClient

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'premium_tribute_db')]

@api_router.get("/suppliers/search")
async def search_suppliers(postcode: str):
    try:
        search_postcode = postcode.replace(" ", "").upper()
        suppliers = await db.suppliers.find({"available": True}, {"_id": 0}).to_list(100)
        
        # Simple matching
        matching = []
        for supplier in suppliers:
            supplier_postcode = supplier['postcode'].replace(" ", "").upper()
            if supplier_postcode.startswith(search_postcode[:2]):
                supplier['distance_miles'] = 2.5
                matching.append(supplier)
        
        return {"suppliers": matching[:20]}
    except Exception as e:
        return {"suppliers": [], "error": str(e)}
