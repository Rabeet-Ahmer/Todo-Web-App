# Quickstart: App Integration (Next.js + better-auth + FastAPI)

## Prerequisites
1.  **Frontend**: `npm install` inside `/frontend`
2.  **Backend**: `uv sync` inside `/backend`
3.  **Neon DB**: Set up a serverless project and get the `DATABASE_URL`

## Environment Setup

### Frontend (`/frontend/.env`)
```bash
NEXT_PUBLIC_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_super_secret_here
# Database for auth
DATABASE_URL=postgresql://...
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Backend (`/backend/.env`)
```bash
DATABASE_URL=postgresql://...
# URL to fetch JWKS from
BETTER_AUTH_URL=http://localhost:3000
# Expected issuer/audience (matches BETTER_AUTH_URL)
JWT_ISSUER=http://localhost:3000
JWT_AUDIENCE=http://localhost:3000
```

## Running the Application

1.  **Start Frontend**: `npm run dev` in `/frontend`. Auth services run on `/api/auth/*`.
2.  **Start Backend**: `uv run uvicorn app.main:app --reload` in `/backend`.
3.  **Validate Integration**:
    *   Sign up via `/register` in the UI.
    *   The UI will receive a JWT via the `bearer` plugin.
    *   API calls to `localhost:8000/api/v1/todos` will include `Authorization: Bearer <token>`.
    *   FastAPI will verify the token against `localhost:3000/api/auth/jwks`.

## Key Integration Patterns

### 1. Unified API Client (Frontend)
Located in `frontend/lib/api-client.ts`. It automatically injects the active session JWT into headers.

### 2. Auth Dependency (Backend)
Located in `backend/app/core/deps.py`. Use `Depends(get_current_user)` to secure endpoints.
```python
@router.get("/todos")
async def list_todos(current_user: User = Depends(get_current_user)):
    # ...
```
