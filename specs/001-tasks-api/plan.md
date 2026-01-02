# Implementation Plan: Tasks API

**Branch**: `001-tasks-api`
**Date**: 2025-12-31
**Status**: In Progress
**Spec**: [specs/001-tasks-api/spec.md](../specs/001-tasks-api/spec.md)
**Research**: [specs/001-tasks-api/research.md](../specs/001-tasks-api/research.md)

## Summary

Implement a RESTful API for task management with Better Auth integration. The API provides CRUD operations for tasks with JWT authentication (validated against Better Auth's user table). All endpoints follow `/api/v1/` prefix and use Better Auth for user identity while FastAPI handles business logic.

**Extracted from spec:**
- 6 prioritized user stories covering List, Create, View, Update, Delete, and Toggle Completion
- 10 functional requirements with FR numbering
- 2 key entities (Task, User)
- 8 measurable success criteria with SC numbering
- 8 edge cases

**From constitution:**
- Component-First, Type Safety, Server-Client clarity, Styling system, API-First design, Performance principles
- Clear separation between Better Auth (auth) and FastAPI (business logic)

---

## Technical Approach

### Architecture Pattern

```
┌─────────────┐
│  Better Auth  │
│  (Users Only)  │
└─────────────┘
      │
      ▼
┌─────────────┐
│   FastAPI     │
│  (Tasks +    │
│   User Verify)│
└─────────────┘
      │
      ▼
┌─────────────┐
│  Frontend    │
│  (Bridge Both) │
└─────────────┘
      │
      ▼
┌─────────────┐
│ PostgreSQL  │
│  (Shared DB)   │
└─────────────┘
```

**Shared JWT Secret** between Better Auth and FastAPI for token validation

### Technology Stack (From Constitution)

**Frontend:**
- Next.js 16.1.1 (App Router)
- React 19.2.3
- TypeScript 5.x
- TailwindCSS 4.x
- Better Auth (TypeScript auth library)
- shadcn/ui (primitives only)

**Backend:**
- Python 3.13+ (UV package manager)
- FastAPI 0.115+
- Pydantic v2
- SQLModel 0.0.20
- Neon PostgreSQL (serverless, asyncpg driver)
- python-jose (JWT validation)

---

## Phase 0: Outline & Research

### Phase 0.1: Identify Unknowns

From Technical Context in plan template:

**Unknown 1: Better Auth Integration Pattern**
- Research Task: Understand how Better Auth generates JWT tokens and stores sessions
- Deliverable: Determine best practices for integrating Better Auth with FastAPI
- Best Practices Task: "Research Better Auth integration with FastAPI for Task API context"

**Unknown 2: Pydantic v2 with SQLModel**
- Research Task: Understand how to use Pydantic v2 with SQLModel for type-safe database operations
- Deliverable: Create examples of Pydantic v2 schema definitions and SQLModel models
- Best Practices Task: "Research Pydantic v2 with SQLModel patterns for type-safe FastAPI applications"

**Unknown 3: Async Database Patterns with Neon**
- Research Task: Understand async database patterns for Neon PostgreSQL with connection pooling
- Deliverable: Document connection pooling configuration and async query patterns
- Best Practices Task: "Research async PostgreSQL patterns with Neon connection pooling"

---

### Phase 0.2: Generate Research.md

**Create file:** `specs/001-tasks-api/research.md`

**Sections to include:**

1. **Better Auth Integration Research**
   - How Better Auth generates JWT tokens
   - How Better Auth stores sessions (cookies, database)
   - How FastAPI validates Better Auth tokens
   - Shared secret configuration approach
   - Recommended token extraction methods from frontend
   - Best practices for TypeScript/Python JWT interoperability

2. **Pydantic v2 + SQLModel Research**
   - Pydantic v2 syntax changes from v1
   - SQLModel model inheritance patterns
   - Pydantic v2 validation patterns (model_validate, model_dump)
   - Async session handling with SQLModel
   - Type conversion strategies (SQLModel to Pydantic, vice versa)

3. **Neon PostgreSQL Async Patterns**
   - Asyncpg driver configuration
   - Connection pooling best practices
   - Async session management
   - Transaction patterns for task operations
   - Query optimization strategies (indexes, eager loading)

4. **FastAPI Best Practices**
   - Dependency injection patterns for JWT validation
   - Route organization with `/api/v1/` prefix
   - HTTP status code conventions
   - Error handling with HTTPException
   - CORS configuration for cross-origin requests

**Decisions to document:**
- Use `httpOnly` and `secure` cookies for Better Auth (production)
- Shared JWT secret environment variable approach
- JWT token payload structure (user_id as `sub` claim)
- HTTPBearer security scheme for token extraction
- Async session dependency pattern
- SQLModel models for Task and read-only User

---

## Phase 1: Design & Contracts

### Phase 1.1: Data Model Design

**Tasks:**
```python
# app/models/todo.py
from sqlmodel import Field, SQLModel
from datetime import datetime
from typing import Optional

class Todo(SQLModel, table=True):
    """
    Task model owned by FastAPI.
    user_id is a foreign key to Better Auth's users table.
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
```

**User (Read-only from Better Auth):**
```python
# app/models/user.py
from sqlmodel import Field, SQLModel
from typing import Optional

class User(SQLModel, table=True):
    """
    User model matching Better Auth's schema.
    Better Auth owns this table; FastAPI only reads it.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True, max_length=255)
    email_verified: bool = Field(default=False)
    name: Optional[str] = Field(default=None, max_length=255)
    image: Optional[str] = Field(default=None)
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
```

**Relationships:**
- Task.user_id → User.id (Many-to-One)
- No cascade delete (Better Auth manages users)

### Phase 1.2: API Contracts (Pydantic Schemas)

```python
# app/schemas/todo.py
from pydantic import BaseModel, ConfigDict, Field

class TodoCreate(BaseModel):
    """Schema for creating a task."""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class TodoUpdate(BaseModel):
    """Schema for updating a task (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    is_completed: Optional[bool] = None

class TodoResponse(BaseModel):
    """Schema for task response."""
    model_config = ConfigDict(from_attributes=True)  # Pydantic v2

    id: int
    title: str
    description: Optional[str] = None
    is_completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime

class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str
    status_code: int

# app/schemas/common.py
from pydantic import BaseModel, ConfigDict

class PaginationParams(BaseModel):
    """Pagination parameters for list endpoints."""
    skip: int = Field(ge=0, default=0)
    limit: int = Field(ge=1, le=100, default=100)
```

---

## Phase 2: Implementation

### Phase 2.1: Database Layer

**Tasks:**
- Create async engine factory in `app/db/session.py`
- Create Todo model with FK to User model
- Create indexes on user_id and created_at fields
- Handle async CRUD operations with proper session management

**Deliverables:**
- `app/db/session.py` - Async session factory
- `app/models/todo.py` - Task SQLModel
- `app/models/user.py` - User SQLModel (read-only)

### Phase 2.2: Security Layer

**Tasks:**
- Create JWT validation dependency in `app/api/v1/deps.py`
- Implement `get_current_user()` using HTTPBearer
- Validate JWT signature with shared secret
- Extract user_id from JWT payload
- Query User model to verify user exists
- Return 401 on any validation failure
- Use `Annotated[User, Depends(get_current_user)]` pattern

**Deliverables:**
- `app/core/security.py` - JWT validation logic
- `app/api/v1/deps.py` - Dependencies

### Phase 2.3: API Routes

**Tasks:**
- Create `app/api/v1/router.py` - Main API router
- Implement all 6 endpoints from spec:
  - GET `/api/v1/todos` - List tasks with pagination
  - POST `/api/v1/todos` - Create task
  - GET `/api/v1/todos/{id}` - Get task details
  - PUT `/api/v1/todos/{id}` - Update task
  - DELETE `/api/v1/todos/{id}` - Delete task
  - PATCH `/api/v1/todos/{id}/complete` - Toggle completion
- All endpoints require authentication via `get_current_user` dependency
- All endpoints use `AsyncSession` dependency for database access
- Return proper HTTP status codes (200, 201, 204, 401, 403, 404, 422)
- Use Pydantic schemas for request/response validation

**Deliverables:**
- `app/api/v1/router.py` - Main router with all endpoints
- `app/api/v1/todos.py` - Todo CRUD endpoints
- All endpoints authenticated with JWT validation

### Phase 2.4: Configuration Layer

**Tasks:**
- Create `app/config.py` using Pydantic BaseSettings
- Add database_url, jwt_secret_key, api_v1_prefix
- Add Neon pooling settings
- Create example `.env` file

**Deliverables:**
- `app/config.py` - Configuration management
- `.env.example` - Environment variables template

---

## Implementation Order

1. **Database Layer First** - Foundation for all other layers
2. **Configuration Layer** - Settings for both auth and database
3. **Security Layer** - JWT validation middleware
4. **API Routes** - Business logic endpoints
5. **Integration Testing** - Verify Better Auth + FastAPI flow

---

## Validation & Acceptance

Each task in spec has these acceptance scenarios. Implementation must satisfy all scenarios for each user story.

---

## Success Criteria (from Spec)

- **SC-001**: Users can retrieve their task list with page load time under 1 second
- **SC-002**: Task creation API responds in under 100ms (P95)
- **SC-003**: Task update API responds in under 100ms (P95)
- **SC-004**: Task deletion API responds in under 100ms (P95)
- **SC-005**: System enforces user task isolation - 100% of requests only return user's own data
- **SC-006**: All protected endpoints reject unauthenticated requests (401 status) within 50ms
- **SC-007**: 95% of task operations complete successfully on first attempt when inputs are valid
- **SC-008**: System handles concurrent requests gracefully without data corruption

---

## Dependencies

**External Libraries:**
- Better Auth (TypeScript, installed in frontend)
- FastAPI (Python, installed in backend via UV)
- Pydantic (Python, part of FastAPI)
- SQLModel (Python, part of FastAPI)
- python-jose (Python, for JWT validation)
- Neon PostgreSQL (serverless database)

**Python Dependencies for Backend (UV):**
- fastapi[python]
- pydantic[python]
- sqlmodel[python]
- python-jose[cryptography]
- asyncpg[python]  # PostgreSQL async driver
- uvicorn[standard]  # ASGI server

---

## Notes

- **Better Auth owns**: Users table, Sessions table
- **FastAPI owns**: Todos table
- **Frontend bridges**: Extracts JWT from Better Auth cookie, sends to FastAPI
- **Shared secret**: JWT_SECRET_KEY must match between both systems
- **No password hashing in FastAPI**: Better Auth handles this
- **User scoping**: Tasks filtered by user_id from JWT token payload

---

## Next Steps

After this plan is approved:
1. Execute Phase 0 (Research) - Generate research.md
2. Execute Phase 1 (Design) - Create data models and contracts
3. Execute Phase 2 (Implementation) - Build all layers
4. Update CLAUDE.md files if needed
5. Generate tasks.md for implementation tracking