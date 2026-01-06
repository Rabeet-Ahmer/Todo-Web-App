from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.api.deps import get_current_user, get_session
from app.models.user import User
from app.schemas.todo import TodoStats
from app.services.todo_service import TodoService

router = APIRouter(prefix="/users/me/todos", tags=["stats"])


@router.get("/stats", response_model=TodoStats)
async def get_todo_stats(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)]
) -> TodoStats:
    """Get todo statistics for the dashboard."""
    return await TodoService.get_stats(session, current_user.id)
