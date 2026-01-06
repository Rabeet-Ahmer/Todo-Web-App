"""FastAPI dependencies for authentication and database access."""
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.config import settings
from app.core.security import extract_user_id_from_token
from app.db.session import get_session
from app.models.user import User


# Security scheme for extracting Authorization header
security = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    session: Annotated[AsyncSession, Depends(get_session)]
) -> User:
    """
    Validate JWT token and return current user.

    This dependency extracts the Bearer token from Authorization header,
    decodes it using the shared JWT secret, and queries the
    Better Auth users table to verify the user exists.

    Args:
        credentials: HTTP authorization credentials
        session: Database session

    Returns:
        User object from Better Auth's users table

    Raises:
        HTTPException: If authentication fails (401)
    """
    if not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        user_id = extract_user_id_from_token(token)

        # Query Better Auth's users table to verify user exists
        statement = select(User).where(User.id == user_id)
        results = await session.exec(statement)
        user = results.one_or_none()

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found in database"
            )

        return user

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
