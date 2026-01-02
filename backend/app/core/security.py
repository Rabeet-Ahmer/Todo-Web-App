"""JWT validation logic using python-jose."""
import os
from jose import JWTError, jwt

from app.config import settings


# JWT Configuration
SECRET_KEY = settings.jwt_secret_key
ALGORITHM = settings.jwt_algorithm


def decode_token(token: str) -> dict:
    """
    Decode and verify JWT token.

    Args:
        token: JWT token string

    Returns:
        Decoded token payload as dictionary

    Raises:
        JWTError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload
    except JWTError as e:
        raise JWTError(f"Invalid token: {str(e)}")


def extract_user_id_from_token(token: str) -> int:
    """
    Extract user_id from JWT token payload.

    Args:
        token: JWT token string

    Returns:
        User ID as integer

    Raises:
        JWTError: If user_id is missing or invalid
    """
    payload = decode_token(token)
    user_id = payload.get("sub")

    if user_id is None:
        raise JWTError("Invalid token payload: missing user_id")

    try:
        return int(user_id)
    except (ValueError, TypeError):
        raise JWTError("Invalid user_id format in token")
