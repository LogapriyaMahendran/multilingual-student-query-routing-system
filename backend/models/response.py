from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    query_id = Column(Integer, ForeignKey("queries.id", ondelete="CASCADE"), nullable=False)
    responder_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    response_text = Column(Text, nullable=False)
    response_language = Column(String(50), default="English", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    query = relationship("Query", back_populates="responses")
    responder = relationship("User", back_populates="responses")
