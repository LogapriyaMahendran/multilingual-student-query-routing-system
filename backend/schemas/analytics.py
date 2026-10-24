from pydantic import BaseModel
from typing import Dict, List, Any

class AdminDashboardStats(BaseModel):
    total_students: int
    total_staff: int
    total_queries: int
    pending_queries: int
    in_progress_queries: int
    resolved_queries: int
    reopened_queries: int
    intent_distribution: Dict[str, int]
    language_distribution: Dict[str, int]
    department_distribution: Dict[str, int]
    priority_distribution: Dict[str, int]
    recent_queries: List[Any] = []

class AnalyticsSummary(BaseModel):
    intent_stats: List[Dict[str, Any]]
    language_stats: List[Dict[str, Any]]
    department_stats: List[Dict[str, Any]]
    resolution_rate: float
    avg_confidence_score: float
