from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
import uuid

class UserSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    current_step: int = 0
    is_complete: bool = False
    user_responses: Dict[str, Any] = {}

class UserSessionCreate(BaseModel):
    current_step: int = 0
    user_responses: Dict[str, Any] = {}

class UserSessionUpdate(BaseModel):
    current_step: Optional[int] = None
    is_complete: Optional[bool] = None
    user_responses: Optional[Dict[str, Any]] = None

class UserSessionCreate(BaseModel):
    current_step: int = 0
    user_responses: Dict[str, Any] = {}

class UserSessionUpdate(BaseModel):
    current_step: Optional[int] = None
    is_complete: Optional[bool] = None
    user_responses: Optional[Dict[str, Any]] = None

class AssessmentResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    relationship: str
    location: str
    religion: str
    budget: str
    preference: str
    timeline: Optional[str] = None
    special_circumstances: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AssessmentResponseCreate(BaseModel):
    session_id: str
    relationship: str
    location: str
    religion: str
    budget: str
    preference: str
    timeline: Optional[str] = None
    special_circumstances: Optional[str] = None

class StepProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    step_id: str
    step_name: str
    completed_tasks: Dict[str, bool] = {}
    step_data: Dict[str, Any] = {}
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class StepProgressCreate(BaseModel):
    session_id: str
    step_id: str
    step_name: str
    completed_tasks: Dict[str, bool] = {}
    step_data: Dict[str, Any] = {}

class StepProgressUpdate(BaseModel):
    completed_tasks: Optional[Dict[str, bool]] = None
    step_data: Optional[Dict[str, Any]] = None
    completed_at: Optional[datetime] = None

class SupportResource(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    contact: str
    availability: str
    type: str
    category: str
    specialties: Optional[List[str]] = None
    services: Optional[List[str]] = None
    eligibility: Optional[str] = None
    website: Optional[str] = None
    features: Optional[List[str]] = None

class GuidanceData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    religion: Optional[str] = None
    location: Optional[str] = None
    budget: Optional[str] = None
    data: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ImmediateTask(BaseModel):
    title: str
    description: str
    priority: str  # 'critical' or 'important'
    contact: Optional[str] = None
    notes: Optional[str] = None

class FuneralPlanningData(BaseModel):
    title: str
    description: str
    considerations: List[str]

class BudgetGuide(BaseModel):
    title: str
    description: str
    costs: List[Dict[str, str]]
    tips: List[str]

class ChecklistItem(BaseModel):
    title: str
    description: Optional[str] = None

class ChecklistCategory(BaseModel):
    category: str
    tasks: List[ChecklistItem]