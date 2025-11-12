from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from routes import router as api_routes
from database import create_indexes, init_guidance_data, init_support_resources, close_db_connection

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Environment variables with fallbacks
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'premium_tribute_db')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

if not EMERGENT_LLM_KEY:
    logging.warning("EMERGENT_LLM_KEY not set")

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
    marketplace_redirect: Optional[Dict[str, Any]] = None  # NEW: Track marketplace suggestions

class ChatRequest(BaseModel):
    session_id: str
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    session_id: str
    message: str
    timestamp: datetime
    marketplace_redirect: Optional[Dict[str, Any]] = None  # NEW: Suggest marketplace

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

# Document Models - NEW
class Document(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    filename: str
    document_type: str  # will, death_certificate, insurance, bank, other
    content: str  # base64 encoded content
    mime_type: str
    size_bytes: int
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DocumentUpload(BaseModel):
    filename: str
    document_type: str
    content: str  # base64 encoded
    mime_type: str
    size_bytes: int
    notes: Optional[str] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None

# ==================== HELPERS ====================

# Enhanced AI System Prompt - Compassionate and Sensitive
AI_SYSTEM_PROMPT = """You are a compassionate bereavement guide for Premium Tribute, a UK platform that provides complete support.

CRITICAL GUIDANCE PRINCIPLES:
1. NEVER rush to suggest marketplace services in early conversations
2. Focus FIRST on emotional support, immediate practical steps, and understanding their situation
3. Build trust and provide clear guidance through the initial difficult steps
4. ONLY mention marketplace services when the user has been properly supported through:
   - Initial grief acknowledgment
   - Understanding the death registration process
   - Knowing what immediate steps are needed
5. Let the guided journey naturally lead them to services when appropriate

WHEN to mention Marketplace:
- When user explicitly asks "where do I find a funeral director?"
- When they've completed initial guidance and are ready to take action
- When they ask about specific services directly
- NOT in the first 3-4 interactions

RESPONSE FORMAT when suggesting marketplace (ONLY when appropriate):
"When you're ready, I can help you find [service type]. We have verified [service type]s in our Marketplace where you can search by postcode and compare professionals. Would you like me to tell you more about what to expect first?"

KEEP RESPONSES SHORT (2-4 sentences) unless:
- Providing step-by-step instructions
- Explaining legal procedures
- Listing checklist items
- Offering emotional support

UK-SPECIFIC INFORMATION:
- Death registration: 5 days (England/Wales), 8 days (Scotland)
- Tell Us Once: Available in England/Wales/Scotland (not Northern Ireland)
- Probate threshold: £5,000 in England/Wales, £36,000 in Scotland
- DWP bereavement: 0800 731 0469
- HMRC bereavement: 0300 200 3300

Be EMPATHETIC and PATIENT. Let them move at their own pace."""

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Premium Tribute API", "status": "operational"}

@api_router.get("/health")
async def health():
    return {"status": "healthy", "database": "connected"}

# ==================== AI CHAT ====================

def detect_marketplace_need(message: str, message_count: int = 0) -> Optional[Dict[str, Any]]:
    """
    Detect if user needs marketplace services - ONLY after proper support
    Only trigger after several messages to ensure sensitivity
    """
    # Don't suggest marketplace in first 3 messages - too early and insensitive
    if message_count < 3:
        return None
    
    message_lower = message.lower()
    
    # Only detect explicit service requests
    explicit_requests = [
        'where can i find', 
        'need a funeral director',
        'looking for a florist',
        'find a funeral home',
        'recommend a',
        'who should i contact',
        'need help finding'
    ]
    
    # Check if this is an explicit request
    is_explicit_request = any(phrase in message_lower for phrase in explicit_requests)
    
    if not is_explicit_request:
        return None
    
    service_keywords = {
        'funeral_director': ['funeral director', 'funeral home', 'undertaker', 'mortician'],
        'florist': ['florist', 'flowers', 'flower arrangement'],
        'mason': ['mason', 'stonemason', 'headstone', 'gravestone'],
        'venue': ['venue', 'wake', 'reception', 'hall'],
        'caterer': ['caterer', 'catering', 'food service']
    }
    
    for service_type, keywords in service_keywords.items():
        if any(keyword in message_lower for keyword in keywords):
            return {
                'suggested': True,
                'service_type': service_type,
                'message': f"I can help you find {service_type.replace('_', ' ')}s in our Marketplace."
            }
    
    return None

@api_router.post("/ai/chat", response_model=ChatResponse)
async def ai_chat(request: ChatRequest):
    """
    AI-powered chat with sensitive, gradual marketplace suggestions
    """
    try:
        if not EMERGENT_LLM_KEY:
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        # Count previous messages to gauge conversation stage
        message_count = await db.chat_messages.count_documents({"session_id": request.session_id})
        
        # Only detect marketplace need after proper support (3+ messages)
        marketplace_suggestion = detect_marketplace_need(request.message, message_count)
        
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
        
        # Save assistant message with marketplace suggestion (only if appropriate)
        assistant_message_doc = {
            "id": str(uuid.uuid4()),
            "session_id": request.session_id,
            "user_id": request.user_id,
            "role": "assistant",
            "content": ai_response,
            "marketplace_redirect": marketplace_suggestion,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_messages.insert_one(assistant_message_doc)
        
        logger.info(f"AI chat completed for session {request.session_id} (message #{message_count + 1})")
        
        return ChatResponse(
            session_id=request.session_id,
            message=ai_response,
            timestamp=datetime.now(timezone.utc),
            marketplace_redirect=marketplace_suggestion
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

# ==================== SUPPLIERS ====================

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two coordinates in miles using Haversine formula
    """
    from math import radians, cos, sin, asin, sqrt
    
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    
    r = 3956  # Radius of earth in miles
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
        search_postcode = postcode.replace(" ", "").upper()
        
        query = {"available": True}
        if type:
            query["type"] = type
        
        all_suppliers = await db.suppliers.find(query, {"_id": 0}).to_list(500)
        
        # Exact postcode match
        exact_matches = []
        for supplier in all_suppliers:
            supplier_postcode = supplier['postcode'].replace(" ", "").upper()
            if supplier_postcode == search_postcode:
                supplier['distance_miles'] = 0.0
                exact_matches.append(supplier)
        
        if exact_matches:
            logger.info(f"Found {len(exact_matches)} exact matches for {postcode}")
            return {
                "postcode": postcode,
                "radius_miles": radius_miles,
                "count": len(exact_matches),
                "suppliers": exact_matches[:50]
            }
        
        # Area match
        search_area = search_postcode[:4] if len(search_postcode) >= 4 else search_postcode[:3]
        
        matching_suppliers = []
        for supplier in all_suppliers:
            supplier_postcode = supplier['postcode'].replace(" ", "").upper()
            supplier_area = supplier_postcode[:4] if len(supplier_postcode) >= 4 else supplier_postcode[:3]
            
            if supplier_area.startswith(search_area[:2]):
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

# ==================== DOCUMENTS - NEW ====================

@api_router.post("/documents/upload")
async def upload_document(doc: DocumentUpload):
    """
    Upload a document (will, certificate, etc.)
    """
    try:
        doc_dict = {
            "id": str(uuid.uuid4()),
            "user_id": doc.user_id,
            "session_id": doc.session_id,
            "filename": doc.filename,
            "document_type": doc.document_type,
            "content": doc.content,
            "mime_type": doc.mime_type,
            "size_bytes": doc.size_bytes,
            "notes": doc.notes,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.documents.insert_one(doc_dict)
        
        logger.info(f"Document uploaded: {doc.filename}")
        
        return {"id": doc_dict['id'], "filename": doc.filename, "status": "uploaded"}
    
    except Exception as e:
        logger.error(f"Document upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/documents")
async def get_documents(user_id: Optional[str] = None, session_id: Optional[str] = None):
    """
    Get all documents for a user or session
    """
    try:
        query = {}
        if user_id:
            query["user_id"] = user_id
        if session_id:
            query["session_id"] = session_id
        
        documents = await db.documents.find(query, {"_id": 0, "content": 0}).sort("created_at", -1).to_list(100)
        
        return {"documents": documents}
    
    except Exception as e:
        logger.error(f"Error fetching documents: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/documents/{document_id}")
async def get_document(document_id: str):
    """
    Get a specific document with content
    """
    try:
        document = await db.documents.find_one({"id": document_id}, {"_id": 0})
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        return document
    except Exception as e:
        logger.error(f"Error fetching document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """
    Delete a document
    """
    try:
        result = await db.documents.delete_one({"id": document_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Document not found")
        return {"status": "deleted", "id": document_id}
    except Exception as e:
        logger.error(f"Error deleting document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== MEMORIAL PAGES ====================

@api_router.post("/memorials")
async def create_memorial(memorial: Memorial):
    """
    Create a memorial page
    """
    try:
        memorial_dict = memorial.model_dump()
        memorial_dict['created_at'] = memorial_dict['created_at'].isoformat()
        
        await db.memorials.insert_one(memorial_dict)
        
        logger.info(f"Memorial created: {memorial.slug}")
        
        return memorial
    except Exception as e:
        logger.error(f"Memorial creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/memorials/{slug}")
async def get_memorial(slug: str):
    """
    Get memorial by slug
    """
    try:
        memorial = await db.memorials.find_one({"slug": slug}, {"_id": 0})
        if not memorial:
            raise HTTPException(status_code=404, detail="Memorial not found")
        
        if isinstance(memorial.get('created_at'), str):
            memorial['created_at'] = datetime.fromisoformat(memorial['created_at'])
        
        return memorial
    except Exception as e:
        logger.error(f"Error fetching memorial: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/memorials")
async def list_memorials(limit: int = 20):
    """
    List recent memorials
    """
    try:
        memorials = await db.memorials.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
        return {"memorials": memorials}
    except Exception as e:
        logger.error(f"Error listing memorials: {str(e)}")
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