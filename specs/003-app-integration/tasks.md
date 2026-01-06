# Tasks: App Integration (Frontend, Backend, Auth)

**Input**: Design documents from `/specs/003-app-integration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify project structure in frontend/ and backend/ per AGENTS.md
- [ ] T002 Configure environment variables in frontend/.env and backend/.env per quickstart.md
- [ ] T003 [P] Install `better-auth` and standard plugins in frontend/package.json
- [ ] T004 [P] Generate backend virtual environment and install `python-jose`, `cryptography` in backend/pyproject.toml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Configure `better-auth` with JWT and Bearer plugins in frontend/lib/auth.ts
- [ ] T006 Implement JWKS fetching and token verification logic in backend/app/core/security.py
- [ ] T007 [P] Create `get_current_user` FastAPI dependency in backend/app/api/deps.py
- [ ] T008 Setup centralized API client with token injection in frontend/lib/api-client.ts
- [ ] T009 [P] Initialize User model mirroring in backend/app/models/user.py per data-model.md
- [ ] T010 Configure CORS middleware in backend/app/main.py to allow requests from frontend

**Checkpoint**: Foundation ready - full-stack authenticated communication is now possible.

---

## Phase 3: User Story 1 - Unified Authentication (Priority: P1) 🎯 MVP

**Goal**: Users can sign up/login in Next.js and be recognized by FastAPI.

**Independent Test**: Login user in frontend, then call a backend "me" endpoint and receive the correct user ID.

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create login and registration pages in frontend/app/(auth)/
- [ ] T012 [P] [US1] Implement Auth components (LoginForm, RegisterForm) in frontend/components/auth/
- [ ] T013 [US1] Create `/auth/me` endpoint in backend/app/api/v1/auth.py to verify token
- [ ] T014 [US1] Register auth router in backend/app/api/v1/router.py
- [ ] T015 [US1] Implement `auth.actions.ts` in frontend/actions/ for server-side auth checks

**Checkpoint**: User Story 1 complete. Authentication flows are connected between stacks.

---

## Phase 4: User Story 2 - Real-time Todo Synchronization (Priority: P1)

**Goal**: Seamless Todo CRUD between stacks with user scoping.

**Independent Test**: Create a todo in UI; verify it appears in DB with correct `user_id`.

### Implementation for User Story 2

- [ ] T016 [P] [US2] Implement Todo model in backend/app/models/todo.py per data-model.md
- [ ] T017 [US2] Create Todo CRUD endpoints in backend/app/api/v1/todos.py per openapi.yaml
- [ ] T018 [US2] Implement `todo_service.py` in backend/app/services/ for business logic
- [ ] T019 [US2] Create `useTodos` hook with SWR in frontend/hooks/use-todos.ts
- [ ] T020 [P] [US2] Implement Todo UI components (TodoList, TodoItem) in frontend/components/todos/
- [ ] T021 [US2] Implement `todo.actions.ts` in frontend/actions/ for mutation handling

**Checkpoint**: User Story 2 complete. Core application logic is fully integrated.

---

## Phase 5: User Story 3 - Production-Ready Error Handling (Priority: P2)

**Goal**: Graceful failure handling and user feedback.

**Independent Test**: Fail an API call; verify toast notification appears in frontend.

### Implementation for User Story 3

- [ ] T022 [US3] Implement global Error Boundary in frontend/components/shared/error-boundary.tsx
- [ ] T023 [US3] Add toast notifications for API failures in frontend/lib/api-client.ts
- [ ] T024 [P] [US3] Implement custom exception handlers in backend/app/core/exceptions.py
- [ ] T025 [US3] Implement session expiry redirect logic in frontend/lib/auth.ts middleware

**Checkpoint**: All user stories complete. System is robust and handles errors gracefully.

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T026 [P] Final documentation update for environment variables in README.md
- [ ] T027 Run full validation of quickstart.md integration steps
- [ ] T028 Performance audit of JWKS caching in backend

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: First.
- **Foundational (Phase 2)**: Depends on Setup. Blocks ALL stories.
- **User Story 1 (P1)**: Foundation ready.
- **User Story 2 (P1)**: Foundation ready. Can run parallel to US1 if US1 models aren't blocked.
- **User Story 3 (P2)**: Story 1 and 2 ready.

### Parallel Opportunities

- T003, T004 (Dependency installation)
- T007, T009 (Independent backend core files)
- T011, T012 (Independent frontend auth screens)
- T016, T020 (Model and UI scaffolding)

---

## Implementation Strategy

### MVP First (Authentication + Foundational Todo)
1. Complete Foundation (Phase 2).
2. Complete US1 (Auth) to prove stack connection.
3. Complete US2 (Todos) to deliver user value.
4. Validate with `quickstart.md`.
