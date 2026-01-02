"""User model matching Better Auth's schema (read-only for FastAPI)."""
from datetime import datetime
from sqlmodel import Field, SQLModel
from typing import Optional


class User(SQLModel, table=True):
    """
    User model matching Better Auth's schema.

    Better Auth creates and owns this table.
    FastAPI only reads from it to verify users exist.

    Table structure matches Better Auth's default user schema.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True, max_length=255)
    email_verified: bool = Field(default=False)
    name: Optional[str] = Field(default=None, max_length=255)
    image: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
