"""Pydantic schemas for Todo API endpoints."""
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class TodoCreate(BaseModel):
    """Schema for creating a todo."""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)


class TodoUpdate(BaseModel):
    """Schema for updating a todo (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    is_completed: Optional[bool] = None


class TodoResponse(BaseModel):
    """Schema for todo response."""
    model_config = ConfigDict(from_attributes=True)  # Pydantic v2

    id: int
    title: str
    description: Optional[str] = None
    is_completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime
