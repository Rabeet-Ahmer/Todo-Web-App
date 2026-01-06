from typing import Annotated

from fastapi import Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.security import verify_token
from app.db.session import get_session
from app.models.user import User

async def get_current_user(
    payload: Annotated[dict, Depends(verify_token)],
    session: Annotated[AsyncSession, Depends(get_session)]
) -> User:
    """
    Validate JWT token from Better Auth and return current user.
    """
    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    # Query Better Auth's users table to verify user exists
    # Note: User table is mirrored in T009
    statement = select(User).where(User.id == user_id)
    results = await session.exec(statement)
    user = results.one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found in database"
        )

    return user
