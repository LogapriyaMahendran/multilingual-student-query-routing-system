from fastapi import APIRouter, Depends, HTTPException, status, Query as FastQuery
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.user import User
from models.query import Query
from models.response import Response
from models.history import QueryHistory
from schemas.query import QueryResponse, QueryStatusUpdate
from schemas.response import ResponseCreate, ResponseItem
from middleware.auth_middleware import require_staff_or_admin
from services.notification_service import create_notification

router = APIRouter(prefix="/staff", tags=["Staff"])

@router.get("/queries", response_model=List[QueryResponse])
def get_department_queries(
    status_filter: Optional[str] = FastQuery(None, alias="status"),
    priority_filter: Optional[str] = FastQuery(None, alias="priority"),
    language_filter: Optional[str] = FastQuery(None, alias="language"),
    current_user: User = Depends(require_staff_or_admin),
    db: Session = Depends(get_db)
):
    query_builder = db.query(Query)

    # If role is staff, limit to queries assigned to their department
    if current_user.role == "staff" and current_user.department:
        query_builder = query_builder.filter(Query.assigned_department.ilike(current_user.department.strip()))

    if status_filter and status_filter != "all":
        query_builder = query_builder.filter(Query.status.ilike(status_filter))

    if priority_filter and priority_filter != "all":
        query_builder = query_builder.filter(Query.priority.ilike(priority_filter))

    if language_filter and language_filter != "all":
        query_builder = query_builder.filter(Query.selected_language.ilike(language_filter))

    queries = query_builder.order_by(Query.created_at.desc()).all()
    return queries

@router.patch("/queries/{query_id}/status", response_model=QueryResponse)
def update_query_status(
    query_id: int,
    payload: QueryStatusUpdate,
    current_user: User = Depends(require_staff_or_admin),
    db: Session = Depends(get_db)
):
    query_item = db.query(Query).filter(Query.id == query_id).first()
    if not query_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Query not found.")

    # Staff department validation
    if current_user.role == "staff" and current_user.department:
        if query_item.assigned_department.lower() != current_user.department.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: Query assigned to '{query_item.assigned_department}'."
            )

    valid_statuses = ["Submitted", "Assigned", "In Progress", "Resolved", "Reopened"]
    new_status = payload.status.title() if payload.status.title() in valid_statuses else payload.status
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Choose from: {', '.join(valid_statuses)}"
        )

    old_status = query_item.status
    query_item.status = new_status

    # Record history
    history = QueryHistory(
        query_id=query_item.id,
        changed_by=current_user.id,
        old_status=old_status,
        new_status=new_status,
        remarks=payload.remarks or f"Status changed from {old_status} to {new_status} by {current_user.full_name}."
    )
    db.add(history)

    # Notify student
    notif_msg = f"Your query '{query_item.title[:35]}' status has been updated to '{new_status}'."
    create_notification(db, user_id=query_item.student_id, message=notif_msg)

    db.commit()
    db.refresh(query_item)
    return query_item

@router.post("/queries/{query_id}/responses", response_model=ResponseItem, status_code=status.HTTP_201_CREATED)
def add_response(
    query_id: int,
    payload: ResponseCreate,
    current_user: User = Depends(require_staff_or_admin),
    db: Session = Depends(get_db)
):
    query_item = db.query(Query).filter(Query.id == query_id).first()
    if not query_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Query not found.")

    if current_user.role == "staff" and current_user.department:
        if query_item.assigned_department.lower() != current_user.department.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: Query assigned to '{query_item.assigned_department}'."
            )

    # Create response
    resp = Response(
        query_id=query_id,
        responder_id=current_user.id,
        response_text=payload.response_text.strip(),
        response_language=payload.response_language or query_item.selected_language
    )
    db.add(resp)

    # If query was in Assigned status, advance to In Progress
    if query_item.status == "Assigned":
        query_item.status = "In Progress"
        history = QueryHistory(
            query_id=query_item.id,
            changed_by=current_user.id,
            old_status="Assigned",
            new_status="In Progress",
            remarks="Staff sent first response."
        )
        db.add(history)

    # Notify student
    notif_msg = f"New response from {current_user.department or 'Support Staff'} for '{query_item.title[:35]}'."
    create_notification(db, user_id=query_item.student_id, message=notif_msg)

    db.commit()
    db.refresh(resp)
    return resp
