from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from models import (
    UserSession, UserSessionCreate, UserSessionUpdate,
    AssessmentResponse, AssessmentResponseCreate,
    StepProgress, StepProgressCreate, StepProgressUpdate,
    SupportResource, GuidanceData
)
from database import (
    user_sessions, assessment_responses, step_progress,
    support_resources, guidance_data
)
from datetime import datetime

router = APIRouter()

# User Session endpoints
@router.post("/sessions", response_model=UserSession)
async def create_user_session(session: UserSessionCreate):
    """Create a new user session"""
    try:
        session_data = UserSession(**session.dict())
        result = await user_sessions.insert_one(session_data.dict())
        
        if result.inserted_id:
            return session_data
        else:
            raise HTTPException(status_code=500, detail="Failed to create session")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating session: {str(e)}")

@router.get("/sessions/{session_id}", response_model=UserSession)
async def get_user_session(session_id: str):
    """Get a user session by ID"""
    try:
        session = await user_sessions.find_one({"id": session_id})
        if session:
            return UserSession(**session)
        else:
            raise HTTPException(status_code=404, detail="Session not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving session: {str(e)}")

@router.put("/sessions/{session_id}", response_model=UserSession)
async def update_user_session(session_id: str, session_update: UserSessionUpdate):
    """Update a user session"""
    try:
        update_data = {k: v for k, v in session_update.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await user_sessions.update_one(
            {"id": session_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Session not found")
        
        updated_session = await user_sessions.find_one({"id": session_id})
        return UserSession(**updated_session)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating session: {str(e)}")

# Assessment Response endpoints
@router.post("/assessments", response_model=AssessmentResponse)
async def create_assessment_response(assessment: AssessmentResponseCreate):
    """Create a new assessment response"""
    try:
        assessment_data = AssessmentResponse(**assessment.dict())
        result = await assessment_responses.insert_one(assessment_data.dict())
        
        if result.inserted_id:
            return assessment_data
        else:
            raise HTTPException(status_code=500, detail="Failed to create assessment")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating assessment: {str(e)}")

@router.get("/assessments/{session_id}", response_model=AssessmentResponse)
async def get_assessment_by_session(session_id: str):
    """Get assessment response by session ID"""
    try:
        assessment = await assessment_responses.find_one({"session_id": session_id})
        if assessment:
            return AssessmentResponse(**assessment)
        else:
            raise HTTPException(status_code=404, detail="Assessment not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving assessment: {str(e)}")

# Step Progress endpoints
@router.post("/step-progress", response_model=StepProgress)
async def create_step_progress(progress: StepProgressCreate):
    """Create or update step progress"""
    try:
        # Check if progress already exists for this session and step
        existing_progress = await step_progress.find_one({
            "session_id": progress.session_id,
            "step_id": progress.step_id
        })
        
        if existing_progress:
            # Update existing progress
            update_data = {
                "completed_tasks": progress.completed_tasks,
                "step_data": progress.step_data,
                "updated_at": datetime.utcnow()
            }
            
            await step_progress.update_one(
                {"session_id": progress.session_id, "step_id": progress.step_id},
                {"$set": update_data}
            )
            
            updated_progress = await step_progress.find_one({
                "session_id": progress.session_id,
                "step_id": progress.step_id
            })
            return StepProgress(**updated_progress)
        else:
            # Create new progress
            progress_data = StepProgress(**progress.dict())
            result = await step_progress.insert_one(progress_data.dict())
            
            if result.inserted_id:
                return progress_data
            else:
                raise HTTPException(status_code=500, detail="Failed to create step progress")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating step progress: {str(e)}")

@router.get("/step-progress/{session_id}", response_model=List[StepProgress])
async def get_step_progress_by_session(session_id: str):
    """Get all step progress for a session"""
    try:
        progress_cursor = step_progress.find({"session_id": session_id})
        progress_list = await progress_cursor.to_list(length=None)
        return [StepProgress(**progress) for progress in progress_list]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving step progress: {str(e)}")

@router.put("/step-progress/{session_id}/{step_id}", response_model=StepProgress)
async def update_step_progress(session_id: str, step_id: str, progress_update: StepProgressUpdate):
    """Update step progress"""
    try:
        update_data = {k: v for k, v in progress_update.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await step_progress.update_one(
            {"session_id": session_id, "step_id": step_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Step progress not found")
        
        updated_progress = await step_progress.find_one({
            "session_id": session_id,
            "step_id": step_id
        })
        return StepProgress(**updated_progress)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating step progress: {str(e)}")

# Support Resources endpoints
@router.get("/support-resources", response_model=List[SupportResource])
async def get_support_resources(category: Optional[str] = None, type: Optional[str] = None):
    """Get support resources, optionally filtered by category or type"""
    try:
        filter_query = {}
        if category:
            filter_query["category"] = category
        if type:
            filter_query["type"] = type
        
        resources_cursor = support_resources.find(filter_query)
        resources_list = await resources_cursor.to_list(length=None)
        return [SupportResource(**resource) for resource in resources_list]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving support resources: {str(e)}")

# Guidance Data endpoints
@router.get("/guidance-data", response_model=List[GuidanceData])
async def get_guidance_data(
    category: Optional[str] = None,
    religion: Optional[str] = None,
    location: Optional[str] = None,
    budget: Optional[str] = None
):
    """Get guidance data, optionally filtered by various criteria"""
    try:
        filter_query = {}
        if category:
            filter_query["category"] = category
        if religion:
            filter_query["religion"] = religion
        if location:
            filter_query["location"] = location
        if budget:
            filter_query["budget"] = budget
        
        guidance_cursor = guidance_data.find(filter_query)
        guidance_list = await guidance_cursor.to_list(length=None)
        return [GuidanceData(**guidance) for guidance in guidance_list]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving guidance data: {str(e)}")

@router.get("/guidance-data/{category}")
async def get_guidance_by_category(
    category: str, 
    religion: Optional[str] = None,
    location: Optional[str] = None,
    budget: Optional[str] = None
):
    """Get guidance data by category with optional filters"""
    try:
        filter_query = {"category": category}
        
        # Add any additional filters from query parameters
        if religion:
            filter_query["religion"] = religion
        if location:
            filter_query["location"] = location
        if budget:
            filter_query["budget"] = budget
        
        guidance_cursor = guidance_data.find(filter_query)
        guidance_list = await guidance_cursor.to_list(length=None)
        
        if not guidance_list:
            raise HTTPException(status_code=404, detail=f"No guidance data found for category: {category}")
        
        return [GuidanceData(**guidance) for guidance in guidance_list]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving guidance data: {str(e)}")

# Health check endpoint
@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}