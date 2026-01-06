from datetime import datetime
from typing import Optional, List, TYPE_CHECKING

from sqlalchemy import text
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models.todo import Todo

class User(SQLModel, table=True):
    """
    User model matching Better Auth's schema.
    Better Auth owns this table; FastAPI only reads it.
    """
    id: str = Field(primary_key=True)
    email: str = Field(index=True, unique=True, max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)
    image: Optional[str] = Field(default=None)

    # Better Auth tables often have these
    # Ensure DB-level defaults to avoid NULL constraint violations when Better Auth inserts rows.
    email_verified: bool = Field(
        default=False,
        sa_column_kwargs={"server_default": text("false")},
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP")},
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP")},
    )

    todos: List["Todo"] = Relationship(back_populates="user")
