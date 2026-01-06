# Research: App Integration with better-auth, SWR, and FastAPI

## Decision: JWT Bearer Authentication with Remote JWKS Validation

### Rationale
`better-auth` provides a `jwt` plugin that allows the Next.js frontend to generate JWTs signed with a private key. The public keys are exposed via a JWKS (JSON Web Key Set) endpoint (`/api/auth/jwks`).
For a FastAPI backend to verify these tokens in a production-ready and performant way:
1. The backend will fetch and cache the JWKS from the Next.js auth endpoint.
2. FastAPI will use the `python-jose` or `PyJWT` library to verify incoming `Authorization: Bearer <token>` headers against these public keys.
3. This approach is stateless, doesn't require a database call per request on the backend, and handles token rotation via the JWKS endpoint.

### Alternatives Considered
- **Session API Proxy**: Backend calls `better-auth.api.getSession` for every request. **Rejected** because it introduces significant latency (network call per API request) and requires the backend to have direct access to the auth server's internal API or shared DB.
- **Shared Database**: Backend reads `session` table directly. **Rejected** because it couples the backend and auth database schemas and increases DB load.
- **Custom JWT Shared Secret**: Using a shared `JWT_SECRET`. **Rejected** because `better-auth`'s built-in JWKS support is more robust (supports rotation, doesn't require sharing secrets across environments manually as long as the JWKS endpoint is reachable).

## Technical Implementation Details

### Frontend (Next.js)
- Configure `better-auth` with `jwt` plugin.
- Use `authClient.jwt.generate()` or similar to retrieve a token if needed, or rely on automatic session/JWT handling if using the bearer plugin.
- Central API client will include the token in the `Authorization` header.

### Backend (FastAPI)
- **Dependency**: `get_current_user` will:
    - Extract bearer token.
    - Validate signature using public keys from `NEXT_PUBLIC_AUTH_URL/api/auth/jwks`.
    - Cache the public keys for performance.
    - Extract `sub` (userId) from the payload.
    - Return the User object from the backend DB.

## Decision: Unified API Client with SWR for Data Fetching

### Rationale (Context7 Documentation)
SWR provides a comprehensive solution for data fetching in React applications with:
- **Automatic caching and revalidation**: SWR stale-while-revalidate pattern keeps UI fresh
- **Optimistic updates**: Immediate UI feedback before server confirmation
- **Focus tracking**: Auto-revalidates when window regains focus
- **Type safety**: Full TypeScript generics support

### Implementation Pattern (from Context7)
```typescript
// Basic fetching with useSWR
const { data, error, isLoading, mutate } = useSWR('/api/todos', fetcher)

// Optimistic update pattern
await mutate(
  fetch('/api/todos', { method: 'POST', body: JSON.stringify({ text }) })
    .then(res => res.json()),
  {
    optimisticData: [...todos, newTodo],
    rollbackOnError: true,
    populateCache: (serverTodo) => [...todos, serverTodo],
    revalidate: true
  }
)
```

### Alternatives Considered
- **Axios**: Provides more built-in features like interceptors. **Rejected** in favor of native `fetch` to keep bundle size small (Principle VIII).
- **TanStack Query (React Query)**: More full-featured but potentially overkill for a simple Todo app. **SWR** is simpler and highly effective for Next.js.
- **TanStack Query (React Query)**: More full-featured but potentially overkill. **SWR** is lighter and specifically optimized for Next.js.

## Decision: FastAPI REST Endpoints with Pydantic Validation

### Rationale (Context7 Documentation)
FastAPI's patterns for robust API design:
- **Pydantic BaseModel** for request/response validation with automatic schema generation
- **HTTPException** for structured error responses with specific status codes
- **Dependency injection** for reusable authentication logic
- **Path parameters** combined with request body for CRUD operations

### Implementation Pattern (from Context7)
```python
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

class TodoCreate(BaseModel):
    title: str
    completed: bool = False

@app.post("/todos/{todo_id}")
async def update_todo(todo_id: int, todo: TodoCreate):
    if todo_id not in db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo {todo_id} not found"
        )
    return {"todo_id": todo_id, **todo.model_dump()}
```

## Decision: Error Handling Strategy

### Frontend (SWR)
- Configure `shouldRetryOnError`, `errorRetryCount`, and `errorRetryInterval`
- Custom `onErrorRetry` callback for fine-grained control (e.g., no retry on 404)
- `onError` callback for logging and user notification

### Backend (FastAPI)
- Custom HTTPException handlers for consistent error format
- Structured error responses with `detail` field
- Appropriate HTTP status codes (400, 401, 404, 500, etc.)

## Decision: API Endpoint Structure

### RESTful Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/todos | List all todos for user |
| POST | /api/v1/todos | Create new todo |
| GET | /api/v1/todos/{id} | Get single todo |
| PATCH | /api/v1/todos/{id} | Update todo |
| DELETE | /api/v1/todos/{id} | Delete todo |
| GET | /api/v1/users/me/todos/stats | Dashboard statistics |

### Authentication Flow
1. Client includes `Authorization: Bearer <token>` header
2. FastAPI `get_current_user` dependency validates token via JWKS
3. User ID extracted and used for data isolation
4. Only user's own todos are returned/modified
