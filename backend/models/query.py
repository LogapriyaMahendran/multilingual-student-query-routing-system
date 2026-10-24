from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    selected_language = Column(String(50), default="English", nullable=False)
    detected_language = Column(String(50), nullable=True)
    predicted_intent = Column(String(100), nullable=True)
    confidence_score = Column(Float, default=0.0, nullable=True)
    assigned_department = Column(String(100), nullable=True)
    priority = Column(String(30), default="Medium", nullable=False)  # Low, Medium, High, Urgent
    status = Column(String(40), default="Submitted", nullable=False)  # Submitted, Assigned, In Progress, Resolved, Reopened
    routing_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    student = relationship("User", back_populates="queries")
    responses = relationship("Response", back_populates="query", cascade="all, delete-orphan", order_by="Response.created_at.asc()")
    history = relationship("QueryHistory", back_populates="query", cascade="all, delete-orphan", order_by="QueryHistory.created_at.asc()")
