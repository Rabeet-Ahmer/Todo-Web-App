# Implementation Plan: App Integration (Frontend, Backend, Auth, Data Integration)

**Branch**: `003-app-integration` | **Date**: 2026-01-06 | **Spec**: [/specs/003-app-integration/spec.md](spec.md)
**Input**: Feature specification from `/specs/003-app-integration/spec.md`

**Note**: This plan focuses on data integration for dashboard and todos pages with real API data.

## Summary

The primary goal is to establish secure, production-ready data flow between the Next.js frontend and FastAPI backend. The dashboard will display real todo statistics, and the todos page will show actual todos fetched from the backend via authenticated API endpoints. Frontend uses SWR for data fetching with optimistic updates; backend provides RESTful endpoints with JWT Bearer authentication via JWKS validation.

## Technical Context

**Language/Version**: TypeScript 5.x (Frontend), Python 3.13 (Backend)
**Primary Dependencies**: Next.js 16.1.1, better-auth, SWR, FastAPI, Pydantic v2, SQLModel
**Storage**: Neon Serverless PostgreSQL
**Testing**: Vitest (Frontend), pytest (Backend)
**Target Platform**: Web (Next.js App Router)
**Project Type**: Monorepo (frontend/ + backend/)
**Performance Goals**: <200ms API response (P95), <2s initial page load
**Constraints**: <200ms p95, No 'any' types, 80%+ Server Components
**Scale/Scope**: Production-level security, stateless API interaction

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Component-First**: Todo UI uses atomic components (TodoList, TodoItem, TodoForm).
- [x] **II. Type Safety**: End-to-end typing from Pydantic models to TypeScript interfaces.
- [x] **III. Server-Client Clarity**: Data fetching in Server Components where possible, SWR in Client Components for interactivity.
- [x] **IV. Predictable Data Flow**: SWR provides consistent caching, revalidation, and optimistic updates.
- [x] **V. Styling as a System**: TailwindCSS for all UI elements.
- [x] **VI. API-First**: FastAPI OpenAPI schema defines the contract.
- [x] **VII. Performance-Aware**: Async-first backend, Next.js streaming, SWR deduping.
- [x] **VIII. Tooling by Necessity**: SWR justified for caching + optimistic updates; better-auth for auth robustness.
- [x] **IX. Data Modeling**: SQLModel with relationships for User -> Todo.
- [x] **X. Deterministic Error Handling**: Typed HTTPException responses, SWR error states with retry.

## Project Structure

### Documentation (this feature)

```text
specs/003-app-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output (auth integration patterns)
├── data-model.md        # Phase 1 output (SQLModel schema)
├── quickstart.md        # Phase 1 output (integration guide)
├── contracts/           # Phase 1 output (OpenAPI spec)
└── checklists/          # Requirement validation
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── (auth)/          # Login/Register pages
│   ├── dashboard/       # Dashboard with real stats
│   └── todos/           # Todo list page (was showing not-found)
├── components/
│   ├── auth/            # Better-auth UI components
│   └── todos/           # TodoList, TodoItem, TodoForm
├── lib/
│   ├── auth.ts          # Better-auth configuration
│   ├── api-client.ts    # Centralized fetch with token injection
│   └── types.ts         # Shared TypeScript types
├── hooks/
│   ├── use-todos.ts     # SWR hook for todos
│   └── use-stats.ts     # SWR hook for dashboard stats
└── actions/
    └── todo.actions.ts  # Server Actions for mutations

backend/
├── app/
│   ├── models/          # SQLModel classes (User, Todo)
│   ├── api/
│   │   ├── v1/
│   │   │   ├── todos.py # Todo CRUD endpoints
│   │   │   ├── stats.py # Dashboard statistics endpoint
│   │   │   └── auth.py  # Auth verification endpoints
│   │   └── deps.py      # get_current_user dependency
│   ├── services/        # Business logic (todo_service.py)
│   └── core/
│       ├── security.py  # JWKS fetching, JWT verification
│       └── exceptions.py # Custom exception handlers
└── tests/
    ├── conftest.py      # Test fixtures
    ├── test_todos.py    # Todo endpoint tests
    └── test_api.py      # Integration tests
```

**Structure Decision**: Monorepo structure with discrete `frontend/` and `backend/` directories following AGENTS.md conventions. Data flows through centralized API client with SWR handling client-side caching and optimistic updates.

## Complexity Tracking

> No violations detected. All chosen patterns align with Constitution principles.

## Phase 0: Research Summary

**Key Findings from Context7 Documentation**:

1. **SWR Integration Pattern**: SWR provides automatic caching, revalidation, focus tracking, and optimistic updates. Key patterns:
   - `useSWR(key, fetcher)` returns `{ data, error, isLoading, mutate }`
   - `mutate()` with `optimisticData` enables immediate UI updates before server confirmation
   - `rollbackOnError: true` reverts on failure
   - TypeScript generics provide full type safety

2. **FastAPI Best Practices**:
   - Pydantic BaseModel for request/response validation
   - HTTPException for structured error responses with status codes
   - Path parameters combined with request body for CRUD
   - Dependency injection for authentication (get_current_user)

3. **Authentication Flow**: JWT Bearer tokens with JWKS endpoint for public key retrieval, enabling stateless verification without per-request database calls.

## Phase 1: Design Artifacts

### API Contract (OpenAPI)

See `contracts/openapi.yaml` for full specification.

**Key Endpoints**:
- `GET /api/v1/todos` - List all todos for authenticated user
- `POST /api/v1/todos` - Create new todo
- `GET /api/v1/todos/{id}` - Get single todo
- `PATCH /api/v1/todos/{id}` - Update todo (title, completed)
- `DELETE /api/v1/todos/{id}` - Delete todo
- `GET /api/v1/users/me/todos/stats` - Dashboard statistics

### Data Model

See `data-model.md` for full SQLModel schema with User and Todo entities.

**Validation Rules**:
- Todo.title: Non-empty, max 500 characters
- Todo.completed: Boolean
- User data isolation enforced at API level

### Quickstart Guide

See `quickstart.md` for environment setup and integration steps.

## Next Steps

Execute `/sp.tasks` to generate implementation tasks from this plan. Priority sequence:

1. Backend: Todo CRUD endpoints + stats endpoint
2. Backend: Authentication dependency (get_current_user)
3. Frontend: API client with token injection
4. Frontend: Dashboard page with real data
5. Frontend: Todos page replacement
6. Integration testing
