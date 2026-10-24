from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), default="student", nullable=False)  # student, staff, admin
    department = Column(String(100), nullable=True)  # e.g., "Computer Science", "Examination Cell"
    year_of_study = Column(String(30), nullable=True)  # 1st Year, 2nd Year, etc. (for students)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    queries = relationship("Query", back_populates="student", cascade="all, delete-orphan")
    responses = relationship("Response", back_populates="responder")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
