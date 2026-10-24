from routers.auth import router as auth_router
from routers.queries import router as queries_router
from routers.staff import router as staff_router
from routers.admin import router as admin_router
from routers.notifications import router as notifications_router

__all__ = [
    "auth_router",
    "queries_router",
    "staff_router",
    "admin_router",
    "notifications_router"
]
