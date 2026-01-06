# Implementation Plan: App Integration (Frontend, Backend, Auth)

**Branch**: `003-app-integration` | **Date**: 2026-01-03 | **Spec**: [/specs/003-app-integration/spec.md](spec.md)
**Input**: Feature specification from `/specs/003-app-integration/spec.md`

## Summary

The primary goal is to establish a secure, production-ready connection between the Next.js frontend and the FastAPI backend using `better-auth`. The approach involves integrating `better-auth` as the primary authentication authority, sharing session/identity context with FastAPI via verified tokens (likely using the `bearer` plugin or shared secret JWT validation), and implementing typed CRUD synchronization for the Todo entity.

## Technical Context

**Language/Version**: TypeScript 5.x (Frontend), Python 3.13 (Backend)
**Primary Dependencies**: Next.js 16.1.1, better-auth, FastAPI, Pydantic v2, SQLModel
**Storage**: Neon Serverless PostgreSQL
**Testing**: Vitest (Frontend), pytest (Backend)
**Target Platform**: Web (Next.js App Router)
**Project Type**: Monorepo (frontend/ + backend/)
**Performance Goals**: <200ms API response (P95), <2s initial page load
**Constraints**: <200ms p95, No 'any' types, 80%+ Server Components
**Scale/Scope**: Production-level security, stateless API interaction

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Component-First**: Todo UI will use atomic components (TodoList, TodoForm).
- [x] **II. Type Safety**: End-to-end typing from Pydantic models to TypeScript interfaces.
- [x] **III. Server-Client Clarity**: Auth verification for data fetching will happen in Server Components where possible.
- [x] **IV. Predictable Data Flow**: Unidirectional state management using SWR or TanStack Query.
- [x] **V. Styling as a System**: TailwindCSS for all UI elements.
- [x] **VI. API-First**: FastAPI OpenAPI schema will define the contract.
- [x] **VII. Performance-Aware**: Async-first backend handlers, Next.js streaming.
- [x] **VIII. Tooling by Necessity**: `better-auth` justified for security robustness.
- [x] **IX. Data Modeling**: SQLModel with relationships for User -> Todo.
- [x] **X. Deterministic Error Handling**: Unified error response schema.

## Project Structure

### Documentation (this feature)

```text
specs/003-app-integration/
├── plan.md              # This file
├── research.md          # Implementation decisions and research
├── data-model.md        # Database schema and entities
├── quickstart.md        # Integration guide
├── contracts/           # API Contract definitions
└── checklists/          # Requirement validation
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── (auth)/          # Login/Register pages
│   └── todos/           # Protected todo routes
├── components/
│   ├── auth/            # Better-auth UI components
│   └── todos/           # List/Form components
├── lib/
│   ├── auth.ts          # Better-auth configuration
│   └── api-client.ts    # Centralized fetch wrapper
└── actions/             # Server Actions for auth/todos

backend/
├── app/
│   ├── models/          # SQLModel classes
│   ├── api/             # FastAPI routers
│   ├── core/            # Auth middleware/dependencies
│   └── services/        # Business logic
└── tests/               # Integration tests
```

**Structure Decision**: Monorepo structure with discrete `frontend/` and `backend/` directories to maintain separation of concerns while sharing the spec/checklists.

## Complexity Tracking

> No violations detected.
