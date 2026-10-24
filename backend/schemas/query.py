from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from schemas.user import UserResponse
from schemas.response import ResponseItem

class QueryCreate(BaseModel):
    title: str
    description: str
    selected_language: Optional[str] = "English"
    category: Optional[str] = None
    department: Optional[str] = None  # Student's department if specified

class QueryHistoryItem(BaseModel):
    id: int
    query_id: int
    changed_by: Optional[int]
    old_status: Optional[str]
    new_status: str
    remarks: Optional[str]
    created_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class QueryResponse(BaseModel):
    id: int
    student_id: int
    title: str
    description: str
    selected_language: str
    detected_language: Optional[str]
    predicted_intent: Optional[str]
    confidence_score: Optional[float]
    assigned_department: Optional[str]
    priority: str
    status: str
    routing_reason: Optional[str]
    created_at: datetime
    updated_at: datetime
    student: Optional[UserResponse] = None
    responses: List[ResponseItem] = []
    history: List[QueryHistoryItem] = []

    class Config:
        from_attributes = True

class QueryStatusUpdate(BaseModel):
    status: str
    remarks: Optional[str] = None

class QueryClassificationResult(BaseModel):
    detected_language: str
    predicted_intent: str
    confidence_score: float
    priority: str
    reasoning: Optional[str] = None

class QueryRoutingResult(BaseModel):
    assigned_department: str
    routing_reason: str
    priority: str
