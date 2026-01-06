# Tasks: App Integration (Data Integration Focus)

**Input**: Design documents from `/specs/003-app-integration/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/openapi.yaml

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Dependencies)

**Purpose**: Install required frontend and backend dependencies

- [ ] T001 Install `swr` package in frontend/package.json
- [ ] T002 Install `python-jose` and `cryptography` packages in backend/pyproject.toml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Backend Core

- [ ] T003 [P] Create Pydantic schemas for Todo in backend/app/schemas/todo.py
- [ ] T004 [P] Create TodoService class in backend/app/services/todo_service.py
- [ ] T005 Implement get_current_user dependency in backend/app/api/deps.py
- [ ] T006 Create todo CRUD router in backend/app/api/v1/todos.py per openapi.yaml
- [ ] T007 Create stats endpoint router in backend/app/api/v1/stats.py per openapi.yaml
- [ ] T008 Register all routers in backend/app/api/v1/router.py

### Frontend Core

- [ ] T009 [P] Define TypeScript types for Todo and TodoStats in frontend/lib/types.ts
- [ ] T010 Create centralized API client with token injection in frontend/lib/api-client.ts
- [ ] T011 Create useTodos SWR hook in frontend/hooks/use-todos.ts
- [ ] T012 Create useStats SWR hook in frontend/hooks/use-stats.ts

**Checkpoint**: Foundation ready - full-stack authenticated communication is now possible.

---

## Phase 3: User Story 2 - Dashboard Displays Real User Data (Priority: P1)

**Goal**: Dashboard shows real todo statistics from the backend instead of placeholder data

**Independent Test**: Login and navigate to dashboard; verify statistics (pending/completed counts) match backend data.

### Backend Implementation

- [ ] T013 [P] [US2] Implement todo statistics query in backend/app/services/todo_service.py

### Frontend Implementation

- [ ] T014 [US2] Update dashboard page to fetch real data in frontend/app/dashboard/page.tsx
- [ ] T015 [US2] Display todo statistics components in frontend/app/dashboard/page.tsx

**Checkpoint**: User Story 2 complete. Dashboard displays real user data.

---

## Phase 4: User Story 3 - Todos Page Shows Real Data from API (Priority: P1)

**Goal**: Replace not-found page with actual todo list fetched from backend

**Independent Test**: Navigate to /todos after login; verify todos appear that match database entries.

### Backend Implementation

- [ ] T016 [P] [US3] Implement todo list query in backend/app/services/todo_service.py

### Frontend Implementation

- [ ] T017 [US3] Update todos page to fetch real data in frontend/app/todos/page.tsx
- [ ] T018 [US3] Display TodoList component in frontend/app/todos/page.tsx
- [ ] T019 [US3] Add empty state handling for new users in frontend/app/todos/page.tsx

**Checkpoint**: User Story 3 complete. Todos page shows real data.

---

## Phase 5: User Story 4 - Todo CRUD Operations via API (Priority: P1)

**Goal**: Users can create, update, and delete todos with changes persisted to backend

**Independent Test**: Create a todo in UI; verify it appears in database. Mark complete; verify status updates.

### Backend Implementation

- [ ] T020 [P] [US4] Implement create todo operation in backend/app/services/todo_service.py
- [ ] T021 [P] [US4] Implement update todo operation in backend/app/services/todo_service.py
- [ ] T022 [P] [US4] Implement delete todo operation in backend/app/services/todo_service.py

### Frontend Implementation

- [ ] T023 [US4] Create TodoForm component in frontend/components/todos/TodoForm.tsx
- [ ] T024 [US4] Implement optimistic updates in TodoList component in frontend/components/todos/TodoList.tsx
- [ ] T025 [US4] Add todo creation action in frontend/actions/todo.actions.ts
- [ ] T026 [US4] Add todo toggle action in frontend/actions/todo.actions.ts
- [ ] T027 [US4] Add todo delete action in frontend/actions/todo.actions.ts

**Checkpoint**: User Story 4 complete. Full CRUD operations work via API.

---

## Phase 6: User Story 5 - Production-Ready Error Handling (Priority: P2)

**Goal**: Graceful failure handling with user feedback when API errors occur

**Independent Test**: Stop backend server; verify frontend shows helpful error message with retry option.

### Backend Implementation

- [ ] T028 [P] [US5] Implement custom exception handlers in backend/app/core/exceptions.py

### Frontend Implementation

- [ ] T029 [US5] Add error boundary component in frontend/components/shared/error-boundary.tsx
- [ ] T030 [US5] Add toast notifications for API failures in frontend/lib/api-client.ts
- [ ] T031 [US5] Implement session expiry redirect in frontend/lib/auth.ts

**Checkpoint**: User Story 5 complete. App handles errors gracefully.

---

## Phase 7: User Story 6 - API Endpoint Validation and Testing (Priority: P2)

**Goal**: Automated tests verify endpoints work correctly with proper auth and responses

**Independent Test**: Run pytest; verify all endpoints return correct responses and reject unauthenticated requests.

### Backend Tests

- [ ] T032 [P] [US6] Create test fixtures in backend/tests/conftest.py
- [ ] T033 [US6] Write tests for GET /todos endpoint in backend/tests/test_todos.py
- [ ] T034 [US6] Write tests for POST /todos endpoint in backend/tests/test_todos.py
- [ ] T035 [US6] Write tests for PATCH /todos/{id} endpoint in backend/tests/test_todos.py
- [ ] T036 [US6] Write tests for DELETE /todos/{id} endpoint in backend/tests/test_todos.py
- [ ] T037 [US6] Write tests for GET /users/me/todos/stats endpoint in backend/tests/test_todos.py
- [ ] T038 [US6] Write authentication rejection tests in backend/tests/test_todos.py

**Checkpoint**: User Story 6 complete. All endpoints tested and verified.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T039 [P] Final documentation update for environment variables in README.md
- [ ] T040 [P] Run full validation of quickstart.md integration steps

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends On | Description |
|-------|------------|-------------|
| Phase 1 (Setup) | - | First - install dependencies |
| Phase 2 (Foundational) | Phase 1 | Core infrastructure - blocks ALL stories |
| Phase 3 (US2 Dashboard) | Phase 2 | Can start after foundation ready |
| Phase 4 (US3 Todos Page) | Phase 2 | Can start after foundation ready |
| Phase 5 (US4 CRUD) | Phase 2 | Can start after foundation ready |
| Phase 6 (US5 Error Handling) | Phase 2 | Can start after foundation ready |
| Phase 7 (US6 Testing) | Phase 2 | Can start after foundation ready |
| Phase 8 (Polish) | Phases 3-7 | Last - polish all features |

### Story Dependencies

| Story | Depends On | Description |
|-------|------------|-------------|
| US2 (Dashboard) | Phase 2 | Needs stats endpoint + useStats hook |
| US3 (Todos Page) | Phase 2 | Needs GET /todos endpoint + useTodos hook |
| US4 (CRUD) | Phase 2 | Needs CRUD endpoints + actions |
| US5 (Error Handling) | Phase 2 | Independent but builds on other stories |
| US6 (Testing) | Phase 2 | Can test endpoints independently |

### Parallel Opportunities

- T003, T004 (Backend models and services)
- T009, T010 (Frontend types and API client)
- T011, T012 (Both SWR hooks)
- T013, T016 (Backend queries)
- T020, T021, T022 (CRUD operations)
- T028, T029 (Error handling)
- T032, T033-T038 (Test fixtures and tests)
- T039, T040 (Documentation)

---

## Implementation Strategy

### MVP First (Foundation + Dashboard + Todos List)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational - T003, T004, T005, T006, T007, T008, T009, T010, T011, T012)
3. Complete Phase 3 (US2 Dashboard) to verify data flow
4. Complete Phase 4 (US3 Todos List) to verify list display
5. Test: Verify dashboard and todos page show real data

### Next Increment (CRUD Operations)

6. Complete Phase 5 (US4 CRUD) for full todo management
7. Test: Verify create, update, delete work correctly

### Polish & Validation

8. Complete Phase 6 (US5 Error Handling) for production robustness
9. Complete Phase 7 (US6 Testing) for confidence
10. Complete Phase 8 (Polish)

### Total Task Count: 40 tasks

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1 | 2 | Setup dependencies |
| Phase 2 | 12 | Foundational infrastructure |
| Phase 3 | 4 | Dashboard (US2) |
| Phase 4 | 4 | Todos page (US3) |
| Phase 5 | 8 | CRUD operations (US4) |
| Phase 6 | 4 | Error handling (US5) |
| Phase 7 | 7 | Testing (US6) |
| Phase 8 | 2 | Polish |

### Per Story Task Count

| Story | Tasks | Description |
|-------|-------|-------------|
| US2 | 2 | Dashboard stats implementation |
| US3 | 3 | Todos list implementation |
| US4 | 8 | CRUD operations |
| US5 | 4 | Error handling |
| US6 | 7 | Backend tests |

**Note**: Foundational tasks (Phase 2) serve all stories and are not counted per story.
