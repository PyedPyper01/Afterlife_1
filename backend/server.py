from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage
import uuid
from datetime import datetime
import base64

load_dotenv()

app = FastAPI(title="AfterLife API", version="1.0.0")

# CORS Configuration - Restrict to known origins in production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

# ============================================
# Models
# ============================================

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    history: Optional[List[ChatMessage]] = None

class ChatResponse(BaseModel):
    response: str
    tool_used: Optional[str] = None
    suggested_action: Optional[str] = None

class Supplier(BaseModel):
    id: str
    name: str
    type: str
    location: str
    postcode: str
    description: str
    price_range: str = Field(alias="priceRange")
    rating: float
    review_count: int = Field(alias="reviewCount")
    phone: str
    email: str
    website: Optional[str] = None
    services: List[str]
    verified: bool
    
    class Config:
        populate_by_name = True

class QuoteRequest(BaseModel):
    supplier_id: str
    message: str
    contact_name: str
    contact_email: str
    contact_phone: Optional[str] = None

class Memorial(BaseModel):
    id: Optional[str] = None
    name: str
    date_of_birth: str = Field(alias="dateOfBirth")
    date_of_death: str = Field(alias="dateOfDeath")
    biography: Optional[str] = ""
    photos: List[str] = []
    condolences: List[Dict[str, Any]] = []
    created_at: Optional[str] = None
    user_id: Optional[str] = None
    is_public: bool = True
    
    class Config:
        populate_by_name = True

class Condolence(BaseModel):
    author: str
    message: str

# ============================================
# In-Memory Storage (Replace with MongoDB in production)
# ============================================

SUPPLIERS_DB: List[Dict] = [
    {
        "id": "1",
        "name": "Dignity Funeral Directors",
        "type": "funeral-director",
        "location": "London",
        "postcode": "SW1A 1AA",
        "description": "Compassionate funeral services with over 50 years of experience. Full service and direct cremation options available.",
        "priceRange": "£1,500 - £5,000",
        "rating": 4.8,
        "reviewCount": 127,
        "phone": "020 7123 4567",
        "email": "london@dignity.co.uk",
        "website": "https://www.dignity.co.uk",
        "services": ["Traditional Funeral", "Direct Cremation", "Burial", "Repatriation"],
        "verified": True
    },
    {
        "id": "2",
        "name": "Co-op Funeralcare",
        "type": "funeral-director",
        "location": "Manchester",
        "postcode": "M1 1AA",
        "description": "Trusted funeral directors offering transparent pricing and personalized services.",
        "priceRange": "£1,200 - £4,500",
        "rating": 4.7,
        "reviewCount": 98,
        "phone": "0161 234 5678",
        "email": "manchester@coop.co.uk",
        "website": "https://www.co-operativefuneralcare.co.uk",
        "services": ["Traditional Funeral", "Direct Cremation", "Green Burial", "Memorial Services"],
        "verified": True
    },
    {
        "id": "3",
        "name": "Austin & Sons Funeral Directors",
        "type": "funeral-director",
        "location": "St Albans",
        "postcode": "AL1 3JQ",
        "description": "Family-run funeral directors serving St Albans and Hertfordshire for over 40 years.",
        "priceRange": "£1,800 - £4,200",
        "rating": 4.9,
        "reviewCount": 145,
        "phone": "01727 123456",
        "email": "info@austinfunerals.co.uk",
        "website": "https://www.austinfunerals.co.uk",
        "services": ["Traditional Funeral", "Direct Cremation", "Burial", "Pre-paid Plans", "Repatriation"],
        "verified": True
    },
    {
        "id": "4",
        "name": "Harpenden Funeral Services",
        "type": "funeral-director",
        "location": "Harpenden",
        "postcode": "AL5 2JX",
        "description": "Independent funeral directors providing compassionate care to families in Harpenden.",
        "priceRange": "£1,600 - £3,800",
        "rating": 4.8,
        "reviewCount": 89,
        "phone": "01582 765432",
        "email": "care@harpendenfunerals.co.uk",
        "website": "https://www.harpendenfunerals.co.uk",
        "services": ["Traditional Funeral", "Direct Cremation", "Green Burial", "Memorial Services"],
        "verified": True
    },
    {
        "id": "5",
        "name": "Bloom & Wild Funeral Flowers",
        "type": "florist",
        "location": "Birmingham",
        "postcode": "B1 1AA",
        "description": "Beautiful funeral flowers and tributes, delivered with care and respect.",
        "priceRange": "£50 - £500",
        "rating": 4.9,
        "reviewCount": 156,
        "phone": "0121 345 6789",
        "email": "funeral@bloomandwild.com",
        "website": "https://www.bloomandwild.com",
        "services": ["Wreaths", "Casket Sprays", "Standing Sprays", "Sympathy Bouquets"],
        "verified": True
    },
    {
        "id": "6",
        "name": "Memorial Masonry Ltd",
        "type": "stonemason",
        "location": "Leeds",
        "postcode": "LS1 1AA",
        "description": "Expert stonemasons crafting beautiful headstones and memorials.",
        "priceRange": "£800 - £3,000",
        "rating": 4.6,
        "reviewCount": 67,
        "phone": "0113 456 7890",
        "email": "info@memorialmasonry.co.uk",
        "services": ["Headstones", "Plaques", "Restoration", "Inscriptions"],
        "verified": True
    },
    {
        "id": "7",
        "name": "The Garden Room",
        "type": "venue",
        "location": "Brighton",
        "postcode": "BN1 1AA",
        "description": "Peaceful venue for memorial services and celebration of life events.",
        "priceRange": "£300 - £1,500",
        "rating": 4.8,
        "reviewCount": 89,
        "phone": "01273 567 890",
        "email": "bookings@thegardenroom.co.uk",
        "website": "https://www.thegardenroom.co.uk",
        "services": ["Memorial Services", "Wake Hosting", "Catering Available", "AV Equipment"],
        "verified": True
    },
    {
        "id": "8",
        "name": "Compassionate Catering",
        "type": "caterer",
        "location": "Bristol",
        "postcode": "BS1 1AA",
        "description": "Sensitive catering services for wakes and memorial gatherings.",
        "priceRange": "£15 - £50 per head",
        "rating": 4.7,
        "reviewCount": 45,
        "phone": "0117 123 4567",
        "email": "info@compassionatecatering.co.uk",
        "services": ["Buffets", "Sit-down Meals", "Dietary Requirements", "Delivery"],
        "verified": True
    },
    {
        "id": "9",
        "name": "Life Stories Video",
        "type": "videographer",
        "location": "Edinburgh",
        "postcode": "EH1 1AA",
        "description": "Professional videographers capturing funeral services and creating tribute videos.",
        "priceRange": "£200 - £1,000",
        "rating": 4.9,
        "reviewCount": 34,
        "phone": "0131 234 5678",
        "email": "hello@lifestoriesvideo.co.uk",
        "website": "https://www.lifestoriesvideo.co.uk",
        "services": ["Service Recording", "Tribute Videos", "Live Streaming", "Photo Montages"],
        "verified": True
    },
]

MEMORIALS_DB: List[Dict] = []
DOCUMENTS_DB: List[Dict] = []
QUOTES_DB: List[Dict] = []

# ============================================
# Health Check
# ============================================

@app.get("/healthz")
async def healthz():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

# ============================================
# Chat Endpoints
# ============================================

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Handle chat requests with LLM"""
    try:
        jurisdiction = request.context.get("answers", {}).get("jurisdiction", "england-wales") if request.context else "england-wales"
        religion = request.context.get("answers", {}).get("religion", "") if request.context else ""
        postcode = request.context.get("answers", {}).get("postcode", "") if request.context else ""
        
        message_lower = request.message.lower()
        supplier_keywords = ["funeral director", "florist", "flowers", "stonemason", "headstone", 
                          "venue", "caterer", "catering", "videographer", "find", "recommend", 
                          "near me", "local", "supplier"]
        is_supplier_query = any(keyword in message_lower for keyword in supplier_keywords)
        
        system_prompt = f"""You are a compassionate AI assistant for the AfterLife bereavement support platform. Your role is to provide accurate, empathetic guidance on the UK bereavement process.

IMPORTANT GUIDELINES:
- Be compassionate but factual - do not simulate emotions or act as a therapist
- Provide administrative and procedural guidance only
- Do NOT give legal, financial, or clinical advice
- If a question requires professional expertise, recommend the user contact the Concierge service
- Keep responses concise and actionable
- Use plain English - explain legal jargon when necessary
- Always include relevant links to authoritative UK resources (GOV.UK, Citizens Advice, Cruse, etc.)

SUPPLIER RECOMMENDATIONS:
When users ask about finding suppliers (funeral directors, florists, stonemasons, natural burial sites, caterers, venues, etc.):
- Acknowledge their need and provide general guidance
- ALWAYS suggest they visit the Marketplace section of the app for verified suppliers
- Mention they can filter by location and service type
- Remind them to check reviews and verify credentials (e.g., NAFD/SAIF for funeral directors)

CONTEXT:
- User's jurisdiction: {jurisdiction}
- User's religion: {religion if religion else "Not specified"}
- User's postcode: {postcode if postcode else "Not provided"}

JURISDICTION-SPECIFIC NOTES:
- England/Wales: 5-day registration deadline, "Probate", Tell Us Once available
- Scotland: 8-day registration deadline, "Confirmation" (not Probate), Tell Us Once available
- Northern Ireland: 5-day registration deadline, "Probate", Tell Us Once NOT available

Provide helpful, accurate guidance based on this context."""

        chat_client = LlmChat(
            api_key=os.getenv("EMERGENT_LLM_KEY"),
            session_id=str(uuid.uuid4()),
            system_message=system_prompt
        ).with_model("openai", "gpt-4o-mini")
        
        user_message = UserMessage(text=request.message)
        response_text = await chat_client.send_message(user_message)
        
        suggested_action = "marketplace" if is_supplier_query else None
        
        return ChatResponse(
            response=response_text,
            tool_used=None,
            suggested_action=suggested_action
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")

# ============================================
# Supplier Endpoints
# ============================================

@app.get("/api/suppliers")
async def get_suppliers(
    type: Optional[str] = None,
    location: Optional[str] = None,
    postcode: Optional[str] = None,
    search: Optional[str] = None
):
    """Get suppliers with optional filtering"""
    results = SUPPLIERS_DB.copy()
    
    if type and type != "all":
        results = [s for s in results if s["type"] == type]
    
    if location:
        results = [s for s in results if location.lower() in s["location"].lower()]
    
    if postcode:
        postcode_area = postcode.split()[0].upper() if " " in postcode else postcode[:3].upper()
        results = [s for s in results if s["postcode"].upper().startswith(postcode_area[:2])]
    
    if search:
        search_lower = search.lower()
        results = [s for s in results if 
                  search_lower in s["name"].lower() or 
                  search_lower in s["description"].lower() or
                  any(search_lower in service.lower() for service in s["services"])]
    
    return {"suppliers": results, "total": len(results)}

@app.get("/api/suppliers/{supplier_id}")
async def get_supplier(supplier_id: str):
    """Get a specific supplier by ID"""
    supplier = next((s for s in SUPPLIERS_DB if s["id"] == supplier_id), None)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

@app.post("/api/suppliers/{supplier_id}/quote")
async def request_quote(supplier_id: str, quote: QuoteRequest):
    """Request a quote from a supplier"""
    supplier = next((s for s in SUPPLIERS_DB if s["id"] == supplier_id), None)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    quote_record = {
        "id": str(uuid.uuid4()),
        "supplier_id": supplier_id,
        "supplier_name": supplier["name"],
        "message": quote.message,
        "contact_name": quote.contact_name,
        "contact_email": quote.contact_email,
        "contact_phone": quote.contact_phone,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }
    QUOTES_DB.append(quote_record)
    
    return {"success": True, "quote_id": quote_record["id"], "message": "Quote request sent successfully"}

# ============================================
# Memorial Endpoints
# ============================================

@app.get("/api/memorials")
async def get_memorials(user_id: Optional[str] = None):
    """Get memorials, optionally filtered by user"""
    if user_id:
        results = [m for m in MEMORIALS_DB if m.get("user_id") == user_id]
    else:
        results = [m for m in MEMORIALS_DB if m.get("is_public", True)]
    return {"memorials": results, "total": len(results)}

@app.get("/api/memorials/{memorial_id}")
async def get_memorial(memorial_id: str):
    """Get a specific memorial by ID"""
    memorial = next((m for m in MEMORIALS_DB if m["id"] == memorial_id), None)
    if not memorial:
        raise HTTPException(status_code=404, detail="Memorial not found")
    return memorial

@app.post("/api/memorials")
async def create_memorial(memorial: Memorial):
    """Create a new memorial"""
    memorial_dict = memorial.model_dump(by_alias=True)
    memorial_dict["id"] = str(uuid.uuid4())
    memorial_dict["created_at"] = datetime.utcnow().isoformat()
    memorial_dict["condolences"] = []
    
    MEMORIALS_DB.append(memorial_dict)
    return memorial_dict

@app.put("/api/memorials/{memorial_id}")
async def update_memorial(memorial_id: str, memorial: Memorial):
    """Update an existing memorial"""
    idx = next((i for i, m in enumerate(MEMORIALS_DB) if m["id"] == memorial_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Memorial not found")
    
    memorial_dict = memorial.model_dump(by_alias=True)
    memorial_dict["id"] = memorial_id
    memorial_dict["created_at"] = MEMORIALS_DB[idx].get("created_at")
    memorial_dict["condolences"] = MEMORIALS_DB[idx].get("condolences", [])
    
    MEMORIALS_DB[idx] = memorial_dict
    return memorial_dict

@app.delete("/api/memorials/{memorial_id}")
async def delete_memorial(memorial_id: str):
    """Delete a memorial"""
    idx = next((i for i, m in enumerate(MEMORIALS_DB) if m["id"] == memorial_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Memorial not found")
    
    MEMORIALS_DB.pop(idx)
    return {"success": True, "message": "Memorial deleted"}

@app.post("/api/memorials/{memorial_id}/condolences")
async def add_condolence(memorial_id: str, condolence: Condolence):
    """Add a condolence to a memorial"""
    memorial = next((m for m in MEMORIALS_DB if m["id"] == memorial_id), None)
    if not memorial:
        raise HTTPException(status_code=404, detail="Memorial not found")
    
    condolence_dict = {
        "id": str(uuid.uuid4()),
        "author": condolence.author,
        "message": condolence.message,
        "timestamp": datetime.utcnow().isoformat()
    }
    memorial["condolences"].append(condolence_dict)
    
    return condolence_dict

# ============================================
# Document Endpoints
# ============================================

@app.get("/api/documents")
async def get_documents(user_id: Optional[str] = None, category: Optional[str] = None):
    """Get documents, optionally filtered"""
    results = DOCUMENTS_DB.copy()
    
    if user_id:
        results = [d for d in results if d.get("user_id") == user_id]
    
    if category:
        results = [d for d in results if d.get("category") == category]
    
    return {"documents": [{k: v for k, v in d.items() if k != "file_data"} for d in results], "total": len(results)}

@app.get("/api/documents/{document_id}")
async def get_document(document_id: str):
    """Get a specific document by ID (includes file data)"""
    document = next((d for d in DOCUMENTS_DB if d["id"] == document_id), None)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@app.post("/api/documents")
async def upload_document(
    name: str = Form(...),
    type: str = Form(...),
    category: str = Form(...),
    file: UploadFile = File(...)
):
    """Upload a new document"""
    content = await file.read()
    file_data = base64.b64encode(content).decode('utf-8')
    
    document = {
        "id": str(uuid.uuid4()),
        "name": name,
        "type": type,
        "category": category,
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(content),
        "file_data": file_data,
        "uploaded_at": datetime.utcnow().isoformat()
    }
    
    DOCUMENTS_DB.append(document)
    
    return {k: v for k, v in document.items() if k != "file_data"}

@app.delete("/api/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document"""
    idx = next((i for i, d in enumerate(DOCUMENTS_DB) if d["id"] == document_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    DOCUMENTS_DB.pop(idx)
    return {"success": True, "message": "Document deleted"}

# ============================================
# Triage/Guidance Endpoints
# ============================================

@app.post("/api/triage/save")
async def save_triage_progress(data: Dict[str, Any]):
    """Save triage progress"""
    return {"success": True, "message": "Progress saved"}

@app.get("/api/triage/guidance")
async def get_guidance(
    jurisdiction: str = "england-wales",
    location: Optional[str] = None,
    religion: Optional[str] = None
):
    """Get jurisdiction-specific guidance"""
    guidance = {
        "england-wales": {
            "registration_deadline": "5 days",
            "probate_term": "Probate",
            "tell_us_once": True,
            "registrar_link": "https://www.gov.uk/register-a-death",
            "key_steps": [
                "Get the medical certificate from the doctor",
                "Register the death within 5 days",
                "Use Tell Us Once to notify government departments",
                "Apply for probate if needed"
            ]
        },
        "scotland": {
            "registration_deadline": "8 days",
            "probate_term": "Confirmation",
            "tell_us_once": True,
            "registrar_link": "https://www.nrscotland.gov.uk/registration/registering-a-death",
            "key_steps": [
                "Get the medical certificate from the doctor",
                "Register the death within 8 days",
                "Use Tell Us Once to notify government departments",
                "Apply for Confirmation if needed"
            ]
        },
        "northern-ireland": {
            "registration_deadline": "5 days",
            "probate_term": "Probate",
            "tell_us_once": False,
            "registrar_link": "https://www.nidirect.gov.uk/articles/registering-death",
            "key_steps": [
                "Get the medical certificate from the doctor",
                "Register the death within 5 days",
                "Notify government departments individually (Tell Us Once not available)",
                "Apply for probate if needed"
            ]
        }
    }
    
    return guidance.get(jurisdiction, guidance["england-wales"])
