from fastapi import APIRouter, Depends, HTTPException, status, Query as FastQuery
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any
from database import get_db
from models.user import User
from models.query import Query
from models.response import Response
from schemas.user import UserResponse
from schemas.query import QueryResponse
from schemas.analytics import AdminDashboardStats, AnalyticsSummary
from middleware.auth_middleware import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard", response_model=AdminDashboardStats)
def get_admin_dashboard_stats(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    total_students = db.query(User).filter(User.role == "student").count()
    total_staff = db.query(User).filter(User.role == "staff").count()
    total_queries = db.query(Query).count()

    pending_queries = db.query(Query).filter(Query.status.in_(["Submitted", "Assigned"])).count()
    in_progress_queries = db.query(Query).filter(Query.status == "In Progress").count()
    resolved_queries = db.query(Query).filter(Query.status == "Resolved").count()
    reopened_queries = db.query(Query).filter(Query.status == "Reopened").count()

    # Intent distribution
    intent_rows = db.query(Query.predicted_intent, func.count(Query.id)).group_by(Query.predicted_intent).all()
    intent_distribution = {intent or "Unclassified": count for intent, count in intent_rows}

    # Language distribution
    lang_rows = db.query(Query.selected_language, func.count(Query.id)).group_by(Query.selected_language).all()
    language_distribution = {lang or "English": count for lang, count in lang_rows}

    # Department distribution
    dept_rows = db.query(Query.assigned_department, func.count(Query.id)).group_by(Query.assigned_department).all()
    department_distribution = {dept or "Unassigned": count for dept, count in dept_rows}

    # Priority distribution
    prio_rows = db.query(Query.priority, func.count(Query.id)).group_by(Query.priority).all()
    priority_distribution = {prio or "Medium": count for prio, count in prio_rows}

    # Recent queries
    recent_queries_raw = db.query(Query).order_by(Query.created_at.desc()).limit(8).all()
    recent_queries = [
        {
            "id": q.id,
            "title": q.title,
            "student_name": q.student.full_name if q.student else "Unknown",
            "language": q.selected_language,
            "intent": q.predicted_intent,
            "department": q.assigned_department,
            "priority": q.priority,
            "status": q.status,
            "created_at": q.created_at.isoformat()
        }
        for q in recent_queries_raw
    ]

    return {
        "total_students": total_students,
        "total_staff": total_staff,
        "total_queries": total_queries,
        "pending_queries": pending_queries,
        "in_progress_queries": in_progress_queries,
        "resolved_queries": resolved_queries,
        "reopened_queries": reopened_queries,
        "intent_distribution": intent_distribution,
        "language_distribution": language_distribution,
        "department_distribution": department_distribution,
        "priority_distribution": priority_distribution,
        "recent_queries": recent_queries
    }

@router.get("/queries", response_model=List[QueryResponse])
def get_all_queries(
    status_filter: Optional[str] = FastQuery(None, alias="status"),
    department_filter: Optional[str] = FastQuery(None, alias="department"),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    query_builder = db.query(Query)
    if status_filter and status_filter != "all":
        query_builder = query_builder.filter(Query.status.ilike(status_filter))
    if department_filter and department_filter != "all":
        query_builder = query_builder.filter(Query.assigned_department.ilike(department_filter))

    return query_builder.order_by(Query.created_at.desc()).all()

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    role_filter: Optional[str] = FastQuery(None, alias="role"),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    query_builder = db.query(User)
    if role_filter and role_filter != "all":
        query_builder = query_builder.filter(User.role.ilike(role_filter))

    return query_builder.order_by(User.created_at.desc()).all()

@router.get("/analytics", response_model=AnalyticsSummary)
def get_analytics(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    total = db.query(Query).count()
    resolved = db.query(Query).filter(Query.status == "Resolved").count()
    resolution_rate = round((resolved / total * 100), 2) if total > 0 else 0.0

    avg_conf_row = db.query(func.avg(Query.confidence_score)).scalar()
    avg_confidence_score = round(float(avg_conf_row), 2) if avg_conf_row else 0.0

    intent_rows = db.query(Query.predicted_intent, func.count(Query.id)).group_by(Query.predicted_intent).all()
    intent_stats = [{"name": intent or "Other", "count": count} for intent, count in intent_rows]

    lang_rows = db.query(Query.selected_language, func.count(Query.id)).group_by(Query.selected_language).all()
    language_stats = [{"name": lang or "Other", "count": count} for lang, count in lang_rows]

    dept_rows = db.query(Query.assigned_department, func.count(Query.id)).group_by(Query.assigned_department).all()
    department_stats = [{"name": dept or "Other", "count": count} for dept, count in dept_rows]

    return {
        "intent_stats": intent_stats,
        "language_stats": language_stats,
        "department_stats": department_stats,
        "resolution_rate": resolution_rate,
        "avg_confidence_score": avg_confidence_score
    }
