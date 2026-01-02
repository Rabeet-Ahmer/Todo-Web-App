"""Main API v1 router."""
from fastapi import APIRouter

from app.api.v1.deps import get_current_user
from app.config import settings
from app.api.v1 import todos

# Create API v1 router with prefix
api_router = APIRouter(prefix=settings.api_v1_prefix, tags=["API"])

# Include todo router
api_router.include_router(todos.router)


@api_router.get("/health")
async def health():
    """API health check endpoint."""
    return {"status": "healthy", "version": "0.1.0"}
