from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import Boolean, Column, String
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models.user import User

class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    # Map Python attribute `completed` to DB column `is_completed`
    completed: bool = Field(
        default=False,
        sa_column=Column("is_completed", Boolean, default=False),
    )
    # Priority column: LOW, MEDIUM, HIGH
    priority: str = Field(
        default="MEDIUM",
        sa_column=Column(String(10), default="MEDIUM", server_default="MEDIUM"),
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user_id: str = Field(foreign_key="user.id", index=True)
    user: "User" = Relationship(back_populates="todos")
