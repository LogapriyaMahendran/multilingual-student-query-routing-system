from pydantic import BaseModel
from datetime import datetime

class NotificationItem(BaseModel):
    id: int
    user_id: int
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationReadResponse(BaseModel):
    id: int
    is_read: bool
