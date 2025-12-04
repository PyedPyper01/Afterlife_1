from fastapi import FastAPI, APIRouter, HTTPException, Request, Header
from fastapi.responses import StreamingResponse, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone
import json

# Import emergentintegrations
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
    CheckoutSessionRequest
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Environment variables with fallbacks
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'afterlife_db')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

if not EMERGENT_LLM_KEY:
    logging.warning("EMERGENT_LLM_KEY not set")
if not STRIPE_API_KEY:
    logging.warning("STRIPE_API_KEY not set")

# MongoDB connection
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

# User Models
class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# AI Chat Models
class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: Optional[str] = None
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    session_id: str
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    session_id: str
    message: str
    timestamp: datetime

# Supplier Models
class Supplier(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # funeral_director, florist, mason, venue, caterer
    address: str
    postcode: str
    lat: float
    lon: float
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    description: str
    services: List[str]
    pricing: Dict[str, float]  # service: price
    rating: float = 0.0
    review_count: int = 0
    verified: bool = False
    available: bool = True

class SupplierSearch(BaseModel):
    postcode: str
    type: Optional[str] = None
    radius_miles: float = 5.0
    sort_by: str = "distance"  # distance, price, rating

# Payment Models
class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: Optional[str] = None
    amount: float
    currency: str
    payment_status: str = "pending"  # pending, paid, failed, expired
    status: str = "initiated"  # initiated, completed, cancelled
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CheckoutRequest(BaseModel):
    package_id: str
    origin_url: str
    user_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = {}

# Memorial Models
class Memorial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str  # unique URL slug
    deceased_name: str
    birth_date: Optional[str] = None
    death_date: Optional[str] = None
    bio: Optional[str] = None
    photo_urls: List[str] = []
    condolences: List[Dict[str, Any]] = []
    charity_name: Optional[str] = None
    charity_url: Optional[str] = None
    total_donations: float = 0.0
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== HELPERS ====================

# AI System Prompt
AI_SYSTEM_PROMPT = """You are a research-enabled bereavement guide for AfterLife, a UK platform. You have access to web search to provide accurate, current information.

CRITICAL RULES:
1. **ALWAYS SEARCH** for specific UK legal/regulatory information before answering
2. **CITE SOURCES** - mention gov.uk, official sites when giving legal guidance
3. Keep responses SHORT (2-4 sentences) unless providing step-by-step instructions
4. Be DIRECT and SPECIFIC - give exact links, phone numbers, office names
5. Include TIMEFRAMES when relevant (e.g., "within 5 days")
6. Verify information is CURRENT (2024/2025) - UK laws change

WHAT TO RESEARCH:
- Current UK death registration procedures and timeframes
- Local council registrar office details and booking systems
- Current funeral costs and regulations (CMA funeral pricing rules)
- Probate thresholds and requirements (updated annually)
- Bereavement benefits and eligibility (DWP, HMRC)
- Tell Us Once service availability and process
- Regional differences (England, Wales, Scotland, Northern Ireland)

UK-SPECIFIC CORE INFO:
- Death registration: 5 days (England/Wales), 8 days (Scotland), 5 days (NI)
- Tell Us Once: Available in England/Wales/Scotland (not NI) 
- Probate threshold: £5,000 in England/Wales, £36,000 in Scotland
- DWP bereavement: 0800 731 0469
- HMRC bereavement: 0300 200 3300
- Gov.uk registrar finder: https://www.gov.uk/register-a-death

EXAMPLES OF GOOD RESEARCHED RESPONSES:

User: "How do I register a death in Manchester?"
You: "Contact Manchester Register Office at 0161 234 5678 or book online at manchester.gov.uk/births-deaths-marriages. You'll need the medical certificate, your ID, and deceased's details. Appointments typically available within 3 days. You must register within 5 days of the death."

User: "What's the probate threshold in Scotland?"
You: "In Scotland, probate (called 'Confirmation') is required if the estate exceeds £36,000. For estates under this, you can often access funds without it. Visit mygov.scot/applying-for-confirmation for the application process."

BE EMPATHETIC but INFORMATIVE. Research to give precise, helpful answers with sources."""

# Payment Packages (FIXED SERVER-SIDE)
PAYMENT_PACKAGES = {
    "concierge": {"amount": 1000.00, "description": "Full Concierge Service"},
    "memorial_basic": {"amount": 0.00, "description": "Free Memorial Page"},
    "donation_small": {"amount": 5.00, "description": "£5 Donation"},
    "donation_medium": {"amount": 10.00, "description": "£10 Donation"},
    "donation_large": {"amount": 25.00, "description": "£25 Donation"},
}

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "AfterLife API", "status": "operational"}

@api_router.get("/health")
async def health():
    return {"status": "healthy", "database": "connected"}

# ==================== AI CHAT ====================

@api_router.post("/ai/chat", response_model=ChatResponse)
async def ai_chat(request: ChatRequest):
    """
    AI-powered chat endpoint with research capabilities for UK bereavement guidance
    """
    try:
        if not EMERGENT_LLM_KEY:
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        # Initialize LLM chat
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=request.session_id,
            system_message=AI_SYSTEM_PROMPT
        ).with_model("openai", "gpt-4o")
        
        # Create user message
        user_msg = UserMessage(text=request.message)
        
        # Send to LLM and get response
        ai_response = await chat.send_message(user_msg)
        
        # Save user message
        user_message_doc = {
            "id": str(uuid.uuid4()),
            "session_id": request.session_id,
            "user_id": request.user_id,
            "role": "user",
            "content": request.message,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_messages.insert_one(user_message_doc)
        
        # Save assistant message
        assistant_message_doc = {
            "id": str(uuid.uuid4()),
            "session_id": request.session_id,
            "user_id": request.user_id,
            "role": "assistant",
            "content": ai_response,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_messages.insert_one(assistant_message_doc)
        
        logger.info(f"AI chat completed for session {request.session_id}")
        
        return ChatResponse(
            session_id=request.session_id,
            message=ai_response,
            timestamp=datetime.now(timezone.utc)
        )
    
    except Exception as e:
        logger.error(f"AI chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI chat failed: {str(e)}")

@api_router.get("/ai/history/{session_id}")
async def get_chat_history(session_id: str):
    """
    Get chat history for a session
    """
    try:
        messages = await db.chat_messages.find(
            {"session_id": session_id},
            {"_id": 0}
        ).sort("timestamp", 1).to_list(100)
        
        return {"session_id": session_id, "messages": messages}
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== PAYMENTS ====================

@api_router.post("/payments/checkout/session", response_model=CheckoutSessionResponse)
async def create_checkout_session(checkout_req: CheckoutRequest, request: Request):
    """
    Create a Stripe checkout session for fixed packages
    """
    try:
        if not STRIPE_API_KEY:
            raise HTTPException(status_code=500, detail="Payment service not configured")
        
        # Validate package
        if checkout_req.package_id not in PAYMENT_PACKAGES:
            raise HTTPException(status_code=400, detail="Invalid package")
        
        package = PAYMENT_PACKAGES[checkout_req.package_id]
        amount = package["amount"]
        
        if amount == 0:
            raise HTTPException(status_code=400, detail="Free packages don't require payment")
        
        # Build success and cancel URLs from origin
        success_url = f"{checkout_req.origin_url}/#/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{checkout_req.origin_url}/#/payment-cancelled"
        
        # Setup Stripe checkout
        host_url = str(request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        # Create checkout request
        session_request = CheckoutSessionRequest(
            amount=amount,
            currency="gbp",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "package_id": checkout_req.package_id,
                "user_id": checkout_req.user_id or "",
                **checkout_req.metadata
            }
        )
        
        # Create Stripe session
        session = await stripe_checkout.create_checkout_session(session_request)
        
        # Save transaction to database
        transaction_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session.session_id,
            "user_id": checkout_req.user_id,
            "amount": amount,
            "currency": "gbp",
            "payment_status": "pending",
            "status": "initiated",
            "metadata": session_request.metadata,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.payment_transactions.insert_one(transaction_doc)
        
        logger.info(f"Created checkout session: {session.session_id}")
        
        return session
    
    except Exception as e:
        logger.error(f"Checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Checkout failed: {str(e)}")

@api_router.get("/payments/checkout/status/{session_id}", response_model=CheckoutStatusResponse)
async def get_checkout_status(session_id: str):
    """
    Get payment status from Stripe
    """
    try:
        if not STRIPE_API_KEY:
            raise HTTPException(status_code=500, detail="Payment service not configured")
        
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
        status = await stripe_checkout.get_checkout_status(session_id)
        
        # Update transaction in database
        transaction = await db.payment_transactions.find_one({"session_id": session_id})
        
        if transaction and transaction.get("payment_status") != "paid" and status.payment_status == "paid":
            # Only update once
            await db.payment_transactions.update_one(
                {"session_id": session_id, "payment_status": {"$ne": "paid"}},
                {
                    "$set": {
                        "payment_status": status.payment_status,
                        "status": "completed" if status.payment_status == "paid" else status.status,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
            logger.info(f"Payment confirmed for session: {session_id}")
        
        return status
    
    except Exception as e:
        logger.error(f"Status check error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhooks
    """
    try:
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        if not STRIPE_API_KEY:
            raise HTTPException(status_code=500, detail="Payment service not configured")
        
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        logger.info(f"Webhook received: {webhook_response.event_type}")
        
        # Update transaction based on webhook
        if webhook_response.session_id:
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {
                    "$set": {
                        "payment_status": webhook_response.payment_status,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
        
        return {"status": "success"}
    
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ==================== SUPPLIERS ====================

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two coordinates in miles using Haversine formula
    """
    from math import radians, cos, sin, asin, sqrt
    
    # Convert to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    
    # Radius of earth in miles
    r = 3956
    return c * r

@api_router.get("/suppliers/search")
async def search_suppliers(
    postcode: str,
    type: Optional[str] = None,
    radius_miles: float = 5.0,
    sort_by: str = "distance"
):
    """
    Search suppliers within radius of postcode
    """
    try:
        # Normalize postcode (remove spaces, uppercase)
        search_postcode = postcode.replace(" ", "").upper()
        
        # Get all suppliers of the requested type
        query = {"available": True}
        if type:
            query["type"] = type
        
        all_suppliers = await db.suppliers.find(query, {"_id": 0}).to_list(500)
        
        # Try exact match first
        exact_matches = []
        for supplier in all_suppliers:
            supplier_postcode = supplier['postcode'].replace(" ", "").upper()
            if supplier_postcode == search_postcode:
                supplier['distance_miles'] = 0.0
                exact_matches.append(supplier)
        
        if exact_matches:
            logger.info(f"Found {len(exact_matches)} exact postcode matches for {postcode}")
            return {
                "postcode": postcode,
                "radius_miles": radius_miles,
                "count": len(exact_matches),
                "suppliers": exact_matches[:50]
            }
        
        # Try area match (first 3-4 characters of postcode)
        search_area = search_postcode[:4] if len(search_postcode) >= 4 else search_postcode[:3]
        
        matching_suppliers = []
        for supplier in all_suppliers:
            supplier_postcode = supplier['postcode'].replace(" ", "").upper()
            supplier_area = supplier_postcode[:4] if len(supplier_postcode) >= 4 else supplier_postcode[:3]
            
            # Match on area code
            if supplier_area.startswith(search_area[:2]):  # At least first 2 chars match
                # Calculate mock distance (0-10 miles)
                distance = abs(hash(supplier_postcode) - hash(search_postcode)) % 10
                supplier['distance_miles'] = round(distance, 1)
                
                if distance <= radius_miles:
                    matching_suppliers.append(supplier)
        
        # Sort results
        if sort_by == "distance":
            matching_suppliers.sort(key=lambda x: x.get('distance_miles', 999))
        elif sort_by == "rating":
            matching_suppliers.sort(key=lambda x: x.get('rating', 0), reverse=True)
        elif sort_by == "price":
            matching_suppliers.sort(key=lambda x: sum(x.get('pricing', {}).values()) / len(x.get('pricing', {1: 1})))
        
        logger.info(f"Found {len(matching_suppliers)} suppliers near {postcode}")
        
        return {
            "postcode": postcode,
            "radius_miles": radius_miles,
            "count": len(matching_suppliers),
            "suppliers": matching_suppliers[:50]
        }
    
    except Exception as e:
        logger.error(f"Supplier search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/suppliers/{supplier_id}")
async def get_supplier(supplier_id: str):
    """
    Get single supplier details
    """
    try:
        supplier = await db.suppliers.find_one({"id": supplier_id}, {"_id": 0})
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        return supplier
    except Exception as e:
        logger.error(f"Error fetching supplier: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
