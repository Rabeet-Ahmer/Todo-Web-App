"""Todo model owned by FastAPI with FK to Better Auth's users table."""
from datetime import datetime
from sqlmodel import Field, SQLModel
from typing import Optional


class Todo(SQLModel, table=True):
    """
    Todo model owned by FastAPI.

    user_id is a foreign key to Better Auth's users table.
    FastAPI creates and manages this table.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    is_completed: bool = Field(default=False)
    user_id: int = Field(
        foreign_key="user.id",  # References Better Auth's users table
        index=True
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
