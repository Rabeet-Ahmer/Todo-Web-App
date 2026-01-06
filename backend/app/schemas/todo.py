from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class TodoResponse(TodoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime
