from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.user import User
from models.query import Query
from models.history import QueryHistory
from schemas.query import QueryCreate, QueryResponse, QueryClassificationResult, QueryRoutingResult
from middleware.auth_middleware import get_current_user, require_student
from services.nlp_service import nlp_service
from services.routing_service import route_query
from services.notification_service import create_notification

router = APIRouter(prefix="/queries", tags=["Queries"])

@router.post("", response_model=QueryResponse, status_code=status.HTTP_201_CREATED)
def submit_query(
    payload: QueryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. NLP Intent Detection & Language Recognition
    classification = nlp_service.classify_intent(
        title=payload.title,
        description=payload.description,
        selected_lang=payload.selected_language
    )

    detected_lang = classification["detected_language"]
    predicted_intent = classification["predicted_intent"]
    confidence_score = classification["confidence_score"]
    priority = classification["priority"]

    # 2. Department Routing
    routing = route_query(
        intent=predicted_intent,
        text=f"{payload.title} {payload.description}",
        confidence_score=confidence_score
    )
    assigned_dept = routing["assigned_department"]
    routing_reason = routing["routing_reason"]

    # 3. Create Query Record
    new_query = Query(
        student_id=current_user.id,
        title=payload.title.strip(),
        description=payload.description.strip(),
        selected_language=payload.selected_language or "English",
        detected_language=detected_lang,
        predicted_intent=predicted_intent,
        confidence_score=confidence_score,
        assigned_department=assigned_dept,
        priority=priority,
        status="Assigned",
        routing_reason=routing_reason
    )
    db.add(new_query)
    db.commit()
    db.refresh(new_query)

    # 4. Record Initial Query History
    history_entry = QueryHistory(
        query_id=new_query.id,
        changed_by=current_user.id,
        old_status="Submitted",
        new_status="Assigned",
        remarks=f"Query submitted and automatically routed to {assigned_dept}."
    )
    db.add(history_entry)

    # 5. Send Notification
    notif_msg = f"Your query '{new_query.title[:40]}' was received and routed to {assigned_dept}."
    create_notification(db, user_id=current_user.id, message=notif_msg)

    db.commit()
    db.refresh(new_query)

    return new_query

@router.get("/my", response_model=List[QueryResponse])
def get_my_queries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Retrieve all queries submitted by this student, newest first
    queries = (
        db.query(Query)
        .filter(Query.student_id == current_user.id)
        .order_by(Query.created_at.desc())
        .all()
    )
    return queries

@router.get("/{query_id}", response_model=QueryResponse)
def get_query_details(
    query_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query_item = db.query(Query).filter(Query.id == query_id).first()
    if not query_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found."
        )

    # Access control:
    # 1. Students can only see their own queries
    if current_user.role == "student" and query_item.student_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You can only view your own queries."
        )

    # 2. Staff can only access queries in their department (unless department not set or admin)
    if current_user.role == "staff" and current_user.department:
        # Check matching department
        if query_item.assigned_department.lower() != current_user.department.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: Query belongs to '{query_item.assigned_department}', not '{current_user.department}'."
            )

    return query_item

@router.post("/{query_id}/classify", response_model=QueryClassificationResult)
def reclassify_query(
    query_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query_item = db.query(Query).filter(Query.id == query_id).first()
    if not query_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Query not found.")

    res = nlp_service.classify_intent(
        title=query_item.title,
        description=query_item.description,
        selected_lang=query_item.selected_language
    )

    # Update query record with reclassified details
    query_item.detected_language = res["detected_language"]
    query_item.predicted_intent = res["predicted_intent"]
    query_item.confidence_score = res["confidence_score"]
    query_item.priority = res["priority"]
    db.commit()

    return {
        "detected_language": res["detected_language"],
        "predicted_intent": res["predicted_intent"],
        "confidence_score": res["confidence_score"],
        "priority": res["priority"],
        "reasoning": res["reasoning"]
    }

@router.post("/{query_id}/route", response_model=QueryRoutingResult)
def reroute_query(
    query_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query_item = db.query(Query).filter(Query.id == query_id).first()
    if not query_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Query not found.")

    res = route_query(
        intent=query_item.predicted_intent or "General Enquiry",
        text=f"{query_item.title} {query_item.description}",
        confidence_score=query_item.confidence_score or 0.5
    )

    old_dept = query_item.assigned_department
    query_item.assigned_department = res["assigned_department"]
    query_item.routing_reason = res["routing_reason"]

    # Record history
    history = QueryHistory(
        query_id=query_item.id,
        changed_by=current_user.id,
        old_status=query_item.status,
        new_status=query_item.status,
        remarks=f"Rerouted from '{old_dept}' to '{query_item.assigned_department}'. Reason: {res['routing_reason']}"
    )
    db.add(history)
    db.commit()

    return {
        "assigned_department": query_item.assigned_department,
        "routing_reason": query_item.routing_reason,
        "priority": query_item.priority
    }
