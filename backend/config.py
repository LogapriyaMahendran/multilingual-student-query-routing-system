import os
from typing import List

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Multilingual Student Query Intent & Response Routing System")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./student_query.db")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "multilingual-student-query-super-secret-key-change-in-production-2026-min-32-chars")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000"
    ]

settings = Settings()
