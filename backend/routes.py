from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from models import *
import os
from datetime import datetime

router = APIRouter()

# Get database connection from environment
def get_db():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    return client[os.environ.get('DB_NAME', 'premium_tribute_db')]

db = get_db()

# User Sessions
@router.post("/sessions", response_model=UserSession)
async def create_session(session: UserSessionCreate):
    session_dict = UserSession(**session.dict()).dict()
    session_dict['created_at'] = session_dict['created_at'].isoformat()
    session_dict['updated_at'] = session_dict['updated_at'].isoformat()
    await db.sessions.insert_one(session_dict)
    return UserSession(**session_dict)

@router.get("/sessions/{session_id}", response_model=UserSession)
async def get_session(session_id: str):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.put("/sessions/{session_id}", response_model=UserSession)
async def update_session(session_id: str, update: UserSessionUpdate):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    update_data['updated_at'] = datetime.utcnow().isoformat()
    
    await db.sessions.update_one({"id": session_id}, {"$set": update_data})
    updated_session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    return updated_session

# Assessment Responses
@router.post("/assessments", response_model=AssessmentResponse)
async def create_assessment(assessment: AssessmentResponseCreate):
    assessment_dict = AssessmentResponse(**assessment.dict()).dict()
    assessment_dict['created_at'] = assessment_dict['created_at'].isoformat()
    await db.assessments.insert_one(assessment_dict)
    return AssessmentResponse(**assessment_dict)

@router.get("/assessments/{session_id}", response_model=AssessmentResponse)
async def get_assessment(session_id: str):
    assessment = await db.assessments.find_one({"session_id": session_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

# Step Progress
@router.post("/progress", response_model=StepProgress)
async def create_progress(progress: StepProgressCreate):
    progress_dict = StepProgress(**progress.dict()).dict()
    progress_dict['created_at'] = progress_dict['created_at'].isoformat()
    await db.progress.insert_one(progress_dict)
    return StepProgress(**progress_dict)

@router.get("/progress/{session_id}")
async def get_progress(session_id: str):
    progress_list = await db.progress.find({"session_id": session_id}, {"_id": 0}).to_list(100)
    return {"progress": progress_list}

# Support Resources
@router.get("/resources")
async def get_resources(type: str = None, category: str = None):
    query = {}
    if type:
        query["type"] = type
    if category:
        query["category"] = category
    resources = await db.resources.find(query, {"_id": 0}).to_list(100)
    return {"resources": resources}

# Guidance Data
@router.get("/guidance")
async def get_guidance(category: str, religion: str = None, location: str = None, budget: str = None):
    query = {"category": category}
    if religion:
        query["religion"] = religion
    if location:
        query["location"] = location
    if budget:
        query["budget"] = budget
    guidance = await db.guidance.find_one(query, {"_id": 0})
    if not guidance:
        raise HTTPException(status_code=404, detail="Guidance not found")
    return guidance
