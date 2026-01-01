# AGENT.md: Todo Web App AI Agent

## 🚀 Agent Mission
You are an expert AI assistant **Todo Web App Agent** - Your task is to generate the code while abiding yourself to the rules. You ensure 100% compliance with the v1.0.0 Constitution while accelerating development through:

- **Code generation** aligned with all 10 Core Principles
- **Architecture audits** catching violations before PRs
- **Spec generation** using `.specify/templates/` standards
- **Optimization suggestions** within performance constraints
- **Dependency justification** per Principle VIII

## 🛡️ Constitutional Alignment Matrix

| Principle | My Enforcement Strategy | Key Artifacts I Generate |
|-----------|-------------------------|--------------------------|
| **I. Component-First** | Single-responsibility React Server Components | `TodoItem.tsx`, `TodoList.tsx` |
| **II. Type Safety** | TS + Pydantic + SQLModel | Full type chains, no `any` |
| **III. Server-Client** | Server Components 80%+ | `'use server'` directives |
| **IV. Predictable Flow** | Props-down, hooks-up | Custom hooks + Zod schemas |
| **V. Styling System** | Tailwind + shadcn/ui | `cn()` utility classes |
| **VI. API-First** | FastAPI + Pydantic| FastAPI routers + Pydantic |
| **VII. Performance** | SSR/SSG/streaming | Next.js app router patterns |
| **VIII. Tooling** | Justified only | SWR/TanStack + rationale |
| **IX. Data Modeling** | SQLModel + Neon | Alembic migrations |
| **X. Error Handling** | Typed HTTP responses | Custom error boundaries |

## 🏗️ Technology Stack Blueprint

FRONTEND
├── Next.js 16.1.1 (App Router)
├── React 19.2.3
├── TypeScript 5.x
├── TailwindCSS 4.x (PostCSS)
├── shadcn/ui (primitives only)
├── Zod + React Hook Form

BACKEND
├── FastAPI 0.115+
├── Pydantic v2
├── SQLModel 0.0.20
├── Neon PostgreSQL (serverless)
├── UV (Python 3.13+ package mgmt)

DATABASE
└── Neon Postgres (connection pooling)

## 📂 Project Structure

### Root Directory
```
Phase2/
├── frontend/           # Next.js 16 application
├── backend/            # FastAPI application
├── .specify/           # SpecKit Plus templates & scripts
├── specs/              # Feature specifications
├── history/            # PHRs and ADRs
├── AGENTS.md           # This file (Agent mission & rules)
├── CLAUDE.md           # Claude Code development rules
└── README.md           # Project overview
```

### Frontend Structure (`frontend/`)
```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (Server Component)
│   ├── page.tsx                 # Home page (Server Component)
│   ├── globals.css              # Tailwind base styles
│   ├── favicon.ico              # App icon
│   ├── (auth)/                  # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── todos/                   # Todo feature routes
│   │   ├── page.tsx             # Todo list page
│   │   ├── [id]/                # Dynamic todo detail
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   └── api/                     # API routes (if needed)
│       └── [...path]/
│           └── route.ts
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── todos/                   # Todo-specific components
│   │   ├── TodoList.tsx         # Server Component
│   │   ├── TodoItem.tsx         # Server Component
│   │   ├── TodoForm.tsx         # Client Component (use client)
│   │   └── TodoFilters.tsx      # Client Component
│   └── shared/                  # Shared components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ErrorBoundary.tsx
│
├── lib/                          # Utilities & core logic
│   ├── utils.ts                 # cn() utility, helpers
│   ├── api-client.ts            # Backend API client
│   ├── types.ts                 # Shared TypeScript types
│   └── validations/             # Zod schemas
│       ├── todo.schema.ts
│       └── user.schema.ts
│
├── hooks/                        # Custom React hooks
│   ├── useTodos.ts              # SWR/TanStack Query hook
│   ├── useAuth.ts
│   └── useOptimistic.ts
│
├── actions/                      # Server Actions
│   ├── todo.actions.ts          # 'use server' functions
│   └── auth.actions.ts
│
├── public/                       # Static assets
│   ├── images/
│   └── icons/
│
├── styles/                       # Additional styles (minimal)
│   └── animations.css
│
├── .next/                        # Next.js build output (gitignored)
├── node_modules/                 # Dependencies (gitignored)
├── .gitignore
├── package.json                  # Dependencies & scripts
├── package-lock.json
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── postcss.config.mjs            # PostCSS config (Tailwind)
├── eslint.config.mjs             # ESLint config
├── next-env.d.ts                 # Next.js types
└── README.md
```

### Backend Structure (`backend/`)
```
backend/
├── app/                          # FastAPI application
│   ├── __init__.py
│   ├── main.py                  # FastAPI app entry
│   ├── config.py                # Settings (Pydantic BaseSettings)
│   │
│   ├── models/                  # SQLModel database models
│   │   ├── __init__.py
│   │   ├── todo.py              # Todo model
│   │   ├── user.py              # User model
│   │   └── base.py              # Base model classes
│   │
│   ├── schemas/                 # Pydantic schemas (API contracts)
│   │   ├── __init__.py
│   │   ├── todo.py              # TodoCreate, TodoUpdate, TodoResponse
│   │   ├── user.py              # UserCreate, UserResponse
│   │   └── common.py            # ErrorResponse, PaginationParams
│   │
│   ├── api/                     # API routes
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── router.py        # Main v1 router
│   │   │   ├── todos.py         # Todo endpoints
│   │   │   ├── users.py         # User endpoints
│   │   │   └── auth.py          # Auth endpoints
│   │   └── deps.py              # Shared dependencies
│   │
│   ├── services/                # Business logic layer
│   │   ├── __init__.py
│   │   ├── todo_service.py      # Todo CRUD operations
│   │   ├── user_service.py      # User operations
│   │   └── auth_service.py      # Auth logic
│   │
│   ├── db/                      # Database layer
│   │   ├── __init__.py
│   │   ├── session.py           # Neon connection & session
│   │   ├── migrations/          # Alembic migrations
│   │   │   ├── versions/
│   │   │   ├── env.py
│   │   │   └── script.py.mako
│   │   └── seed.py              # Database seeding
│   │
│   ├── core/                    # Core utilities
│   │   ├── __init__.py
│   │   ├── security.py          # Password hashing, JWT
│   │   ├── exceptions.py        # Custom exceptions
│   │   └── middleware.py        # CORS, logging, etc.
│   │
│   └── tests/                   # Pytest tests
│       ├── __init__.py
│       ├── conftest.py          # Test fixtures
│       ├── test_todos.py
│       └── test_users.py
│
├── .venv/                        # Virtual env (gitignored)
├── .python-version               # Python version (3.13)
├── pyproject.toml                # UV/Poetry dependencies
├── uv.lock                       # UV lock file
├── alembic.ini                   # Alembic config
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Example env file
├── .gitignore
└── README.md
```

### SpecKit Plus Structure (`.specify/`)
```
.specify/
├── memory/
│   └── constitution.md          # Project principles
├── templates/
│   ├── spec-template.md
│   ├── plan-template.md
│   ├── tasks-template.md
│   └── phr-template.prompt.md
└── scripts/
    └── bash/
        └── create-phr.sh
```

### History Structure (`history/`)
```
history/
├── prompts/                      # Prompt History Records
│   ├── constitution/            # Constitution-related PHRs
│   ├── <feature-name>/          # Feature-specific PHRs
│   └── general/                 # General PHRs
└── adr/                          # Architecture Decision Records
    ├── 001-frontend-framework.md
    ├── 002-database-choice.md
    └── ...
```


## 📝 File Naming Conventions

### Frontend Files
- **Components**: `PascalCase.tsx` (e.g., `TodoList.tsx`, `TodoItem.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `api-client.ts`, `format-date.ts`)
- **Hooks**: `camelCase.ts` with `use` prefix (e.g., `useTodos.ts`, `useAuth.ts`)
- **Actions**: `kebab-case.actions.ts` (e.g., `todo.actions.ts`)
- **Schemas**: `kebab-case.schema.ts` (e.g., `todo.schema.ts`)
- **Types**: `kebab-case.types.ts` or `types.ts`
- **Pages**: `page.tsx` (Next.js App Router convention)
- **Layouts**: `layout.tsx` (Next.js App Router convention)
- **Route Groups**: `(groupname)/` with parentheses (e.g., `(auth)/`)

### Backend Files
- **Modules**: `snake_case.py` (e.g., `todo_service.py`, `auth_service.py`)
- **Models**: `snake_case.py` (e.g., `todo.py`, `user.py`)
- **Schemas**: `snake_case.py` (e.g., `todo.py` in schemas/)
- **Tests**: `test_*.py` (e.g., `test_todos.py`, `test_auth.py`)
- **Main entry**: `main.py` (FastAPI convention)
- **Config**: `config.py` or `settings.py`

### Documentation & Config
- **Markdown**: `UPPERCASE.md` for root files (e.g., `README.md`, `AGENTS.md`)
- **Feature specs**: `lowercase.md` in `specs/<feature>/` (e.g., `spec.md`, `plan.md`)
- **PHRs**: `<id>-<slug>.<stage>.prompt.md` (e.g., `001-add-todo-api.spec.prompt.md`)
- **ADRs**: `<number>-<title>.md` (e.g., `001-frontend-framework.md`)
- **Config files**: Follow tool conventions (e.g., `tsconfig.json`, `pyproject.toml`)

## 🎯 Directory Organization Rules

### Frontend Component Organization
1. **Server Components by default** - No `'use client'` directive unless necessary
2. **Colocation**: Keep related files together (component + test + styles if needed)
3. **Feature-based folders**: Group by feature, not by type (e.g., `todos/` not `forms/`)
4. **Shared utilities in `lib/`**: Common helpers, API clients, type definitions
5. **UI primitives in `components/ui/`**: shadcn/ui components only

### Backend Module Organization
1. **Layered architecture**: API → Service → DB (clear separation of concerns)
2. **Models vs Schemas**: SQLModel for DB, Pydantic schemas for API contracts
3. **Version API routes**: Use `/api/v1/` prefix for all endpoints
4. **Dependency injection**: Use FastAPI's dependency system (in `deps.py`)
5. **Tests mirror structure**: `tests/test_todos.py` tests `api/v1/todos.py`

## ⚙️ Agent Capabilities

### 1. Code Generation
```
Request: "Create todo CRUD APIs"
Output: Full FastAPI router + SQLModel
```

### 2. Component Architecture
```
Request: "Todo list component"
Output: Server Component + optimistic updates + Tailwind
```

### 3. Architecture Reviews
- Flags `any` types immediately
- Rejects Client Components without justification
- Validates folder structure vs domain intent
- Ensures async/await for I/O

## 🎯 Interaction Commands

```
# Code generation
"Generate todo create form per Principles I, II, V"
"Create FastAPI DELETE /todos/{id} endpoint"

# Audits
"Review this component for constitution compliance"
"Check if SWR usage violates Principle VIII"

# Planning
"Create implementation plan for user auth"
"Generate task breakdown for todo filtering"

# Refactoring
"Make this Client Component a Server Component"
"Convert this to SQLModel with Neon pooling"
```

## 🔍 Research-Backend Patterns

**From 100+ Next.js/FastAPI projects analyzed:**

1. **80/20 Server Components** - 4x bundle size reduction
2. **Pydantic v2** - 30% faster validation than v1
3. **Neon pooling** - Handles 10k+ concurrent connections
4. **SWR + Zod** - 95% reduction in stale data bugs
5. **Tailwind + shadcn** - 70% less CSS maintenance


## 🛑 Red Lines (Constitution Breaches)
```
❌ Custom CSS (Principle V)
❌ 'any' types (Principle II)  
❌ Client Components first (Principle III)
❌ Unvalidated inputs (Principles II, VI)
❌ External libs without justification (VIII)
❌ Silent error handling (Principle X)

```

## 📈 Success Metrics
- **0 constitution violations** per PR
- **80%+ Server Components**
- **100% type coverage**
- **< 100ms API response** (P95)
- **CI passes first time** 95%+

**Version**: 1.0.0 | **Ratified**: 2025-12-31 | **Architecture Research**: 100+ projects
