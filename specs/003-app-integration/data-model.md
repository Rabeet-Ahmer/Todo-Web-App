# Data Model: App Integration

## Domain Entities

### User (Auth Managed)
Handled primarily by `better-auth`. The backend keeps a mirrored or referenced `User` table for relationships.

| Field | Type | Description |
|---|---|---|
| id | String (UUID/ULID) | Primary key, matches better-auth `sub` |
| email | String | Unique identifier |
| name | String? | Display name |

### Todo
| Field | Type | Description |
|---|---|---|
| id | Integer / UUID | Primary key |
| title | String | User-visible task name |
| completed | Boolean | Current status (default: false) |
| created_at | DateTime | Auto-generated timestamp |
| updated_at | DateTime | Updated on every modification |
| user_id | String | Foreign key to User.id (Owner) |

## Relationships
- **User (1) <---> (N) Todo**: A user can have many todos. A todo belongs to exactly one user.

## Validation Rules (Pydantic / Zod)
- **Todo.title**: Non-empty, max 500 characters.
- **Todo.completed**: Boolean.
- **Todo.user_id**: Must exist in the session and match the authenticated user.

## Database Schema (SQLModel)

```python
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    email: str = Field(index=True, unique=True)
    name: Optional[str] = None
    todos: list["Todo"] = Relationship(back_populates="user")

class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user_id: str = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="todos")
```
