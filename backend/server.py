from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage
import uuid

load_dotenv()

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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



@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Handle chat requests with LLM"""
    try:
        jurisdiction = request.context.get("answers", {}).get("jurisdiction", "england-wales") if request.context else "england-wales"
        religion = request.context.get("answers", {}).get("religion", "") if request.context else ""
        postcode = request.context.get("answers", {}).get("postcode", "") if request.context else ""
        
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
When users ask about finding suppliers (funeral directors, florists, stonemasons, natural burial sites, caterers, venues, etc.), provide intelligent recommendations based on their location. Include:
- 3-5 realistic supplier names appropriate for the UK market
- Approximate distances from their postcode (if provided)
- Types of services offered
- General price ranges based on UK market standards
- Suggest they visit the Marketplace for more details and to request quotes
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

        # Initialize LlmChat with emergentintegrations
        chat_client = LlmChat(
            api_key=os.getenv("EMERGENT_LLM_KEY"),
            session_id=str(uuid.uuid4()),
            system_message=system_prompt
        ).with_model("openai", "gpt-4o-mini")
        
        # Create user message
        user_message = UserMessage(text=request.message)
        
        # Send message and get response
        response_text = await chat_client.send_message(user_message)
        
        return ChatResponse(
            response=response_text,
            tool_used=None
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")


