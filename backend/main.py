from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings
from database import engine, Base
from routers import (
    auth_router,
    queries_router,
    staff_router,
    admin_router,
    notifications_router
)
from init_db import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist and seed demo accounts if empty
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Multilingual Student Query Intent & Response Routing System - AI Powered College Query Management",
    version="1.0.0",
    lifespan=lifespan
)

import os

# Production-grade CORS configuration supporting both local and deployed origins
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=os.getenv("CORS_ORIGIN_REGEX", r"https?://.*"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(queries_router)
app.include_router(staff_router)
app.include_router(admin_router)
app.include_router(notifications_router)

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "status": "operational",
        "docs_url": "/docs",
        "supported_languages": [
            "English", "Tamil", "Hindi", "Malayalam", "Telugu", "Kannada"
        ],
        "intents": [
            "Academic Support",
            "Examination and Hall Ticket",
            "Fees and Scholarships",
            "Admission and Enrollment",
            "Technical Support",
            "Hostel and Transport",
            "Certificates and Documents",
            "General Enquiry"
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=False)
