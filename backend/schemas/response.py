from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from schemas.user import UserResponse

class ResponseCreate(BaseModel):
    response_text: str
    response_language: Optional[str] = "English"

class ResponseItem(BaseModel):
    id: int
    query_id: int
    responder_id: Optional[int]
    response_text: str
    response_language: str
    created_at: datetime
    responder: Optional[UserResponse] = None

    class Config:
        from_attributes = True
