# Tasks: Tasks API

**Input**: Design documents from `/specs/001-tasks-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Tests are OPTIONAL for this feature - no explicit test requests in specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/` for Next.js application
- **Backend**: `backend/app/` for FastAPI application
- **Models**: `backend/app/models/`
- **Schemas**: `backend/app/schemas/`
- **API Routes**: `backend/app/api/v1/`
- **Database**: `backend/app/db/`
- **Core**: `backend/app/core/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize backend Python project with UV in backend/
- [X] T002 Create backend directory structure per plan: app/models/, app/schemas/, app/api/v1/, app/db/, app/core/
- [X] T003 Initialize frontend Next.js 16 project with TypeScript in frontend/
- [X] T004 Create frontend directory structure per AGENTS.md: components/, lib/, hooks/, actions/
- [ ] T005 [P] Install backend dependencies: fastapi, pydantic, sqlmodel, python-jose, asyncpg, uvicorn
- [ ] T006 [P] Install frontend dependencies: next, react, typescript, tailwindcss, @auth/better-auth
- [X] T007 Create .env.example template for backend with JWT_SECRET_KEY, DATABASE_URL

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create backend configuration module in backend/app/config.py with Pydantic BaseSettings
- [X] T009 Create async database session factory in backend/app/db/session.py with Neon pooling
- [X] T010 [P] Create User SQLModel in backend/app/models/user.py (read-only, matches Better Auth schema)
- [X] T011 [P] Create Todo SQLModel in backend/app/models/todo.py with FK to user_id
- [X] T012 [P] Create Pydantic schemas in backend/app/schemas/todo.py: TodoCreate, TodoUpdate, TodoResponse
- [X] T013 [P] Create common schemas in backend/app/schemas/common.py: ErrorResponse, PaginationParams
- [X] T014 Create JWT validation logic in backend/app/core/security.py with python-jose
- [X] T015 Create FastAPI dependencies in backend/app/api/v1/deps.py: get_current_user(), get_db()
- [X] T016 Create FastAPI application instance in backend/app/main.py with CORS and middleware setup
- [X] T017 Create main API router in backend/app/api/v1/router.py with /api/v1 prefix
- [X] T018 Initialize database connection and table creation in backend/app/db/session.py
- [X] T019 Configure Better Auth in frontend/auth.config.ts with JWT secret and database connection

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - List User Tasks (Priority: P1) 🎯 MVP

**Goal**: Allow authenticated users to retrieve a paginated list of their tasks sorted by most recently modified

**Independent Test**: Create test tasks for a user, verify GET /api/v1/todos returns only that user's tasks in correct order with proper pagination, rejects unauthenticated requests with 401

### Implementation for User Story 1

- [X] T020 [US1] Implement list todos service in backend/app/services/todo_service.py: get_todos_for_user()
- [X] T021 [US1] Implement GET /api/v1/todos endpoint in backend/app/api/v1/todos.py with pagination
- [X] T022 [US1] Add authentication requirement using get_current_user dependency in list endpoint
- [X] T023 [US1] Filter todos by user_id from JWT token in list endpoint
- [X] T024 [US1] Order todos by updated_at DESC in list endpoint
- [X] T025 [US1] Apply pagination (skip, limit) in list endpoint with defaults
- [X] T026 [US1] Return proper HTTP status codes: 200 for success, 401 for unauthorized, 500 for errors
- [X] T027 [P] [US1] Create TodoList Server Component in frontend/components/todos/TodoList.tsx
- [X] T028 [US1] Create API client for list todos in frontend/lib/api-client.ts: fetchTodos()
- [X] T029 [US1] Fetch JWT token from Better Auth session in frontend/lib/api-client.ts
- [X] T030 [US1] Call backend GET /api/v1/todos endpoint with Authorization header
- [X] T031 [US1] Display todos list in frontend/components/todos/TodoList.tsx with loading/error states
- [X] T032 [US1] Handle pagination UI in frontend/components/todos/TodoList.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Create New Task (Priority: P2)

**Goal**: Allow authenticated users to create tasks with title (required) and optional description

**Independent Test**: Create task via POST request, verify task appears in subsequent GET requests with correct user association, ID, timestamps, validates required fields and length constraints

### Implementation for User Story 2

- [X] T033 [US2] Implement create todo service in backend/app/services/todo_service.py: create_todo_for_user()
- [X] T034 [US2] Implement POST /api/v1/todos endpoint in backend/app/api/v1/todos.py
- [X] T035 [US2] Validate title field (required, max 200 chars) using Pydantic schema
- [X] T036 [US2] Validate description field (optional, max 1000 chars) using Pydantic schema
- [X] T037 [US2] Associate task with authenticated user_id from JWT in create endpoint
- [X] T038 [US2] Set created_at and updated_at timestamps in create endpoint
- [X] T039 [US2] Return 201 Created with full task object including generated ID
- [X] T040 [US2] Return 422 validation error for missing/invalid fields
- [ ] T041 [P] [US2] Create TodoForm Client Component in frontend/components/todos/TodoForm.tsx
- [X] T042 [US2] Create API client for create task in frontend/lib/api-client.ts: createTodo()
- [X] T043 [US2] Send POST request to backend with Authorization header
- [ ] T044 [US2] Add form validation in TodoForm using Zod or React Hook Form
- [ ] T045 [US2] Handle success/error responses in TodoForm component
- [ ] T046 [US2] Refresh todo list after successful creation using optimistic update or re-fetch

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Task Details (Priority: P3)

**Goal**: Allow users to view full details of a specific task by ID

**Independent Test**: Retrieve specific task ID, verify all fields returned correctly including optional description, returns 404 for non-existent or other user's tasks

### Implementation for User Story 3

- [X] T047 [US3] Implement get todo service in backend/app/services/todo_service.py: get_todo_by_id()
- [X] T048 [US3] Implement GET /api/v1/todos/{id} endpoint in backend/app/api/v1/todos.py
- [X] T049 [US3] Validate task ownership by checking user_id in get endpoint
- [X] T050 [US3] Return 200 with full task details for user's own task
- [X] T051 [US3] Return 404 Not Found for non-existent or other user's tasks
- [ ] T052 [P] [US3] Create TaskDetail Server Component in frontend/components/todos/TaskDetail.tsx
- [X] T053 [US3] Create API client for get task in frontend/lib/api-client.ts: fetchTodoById()
- [X] T054 [US3] Fetch task details with Authorization header
- [ ] T055 [US3] Display all task fields in TaskDetail component with proper error handling

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Update Existing Task (Priority: P2)

**Goal**: Allow authenticated users to modify task title, description, and completion status

**Independent Test**: Update various fields, verify changes persisted correctly including completion status, title changes, description updates, validates ownership and field constraints

### Implementation for User Story 4

- [X] T056 [US4] Implement update todo service in backend/app/services/todo_service.py: update_todo_for_user()
- [X] T057 [US4] Implement PUT /api/v1/todos/{id} endpoint in backend/app/api/v1/todos.py
- [X] T058 [US4] Validate task ownership before update
- [X] T059 [US4] Allow partial updates using Optional fields in Pydantic schema
- [X] T060 [US4] Validate updated fields (title, description) with same constraints as creation
- [X] T061 [US4] Update updated_at timestamp on each modification
- [X] T062 [US4] Return 200 with updated task object
- [X] T063 [US4] Return 404 for non-existent or other user's tasks
- [X] T064 [US4] Return 422 for invalid field updates
- [ ] T065 [P] [US4] Create EditTaskForm Client Component in frontend/components/todos/EditTaskForm.tsx
- [X] T066 [US4] Create API client for update task in frontend/lib/api-client.ts: updateTodo()
- [X] T067 [US4] Send PUT request with updated fields and Authorization header
- [ ] T068 [US4] Pre-populate form with current task values in EditTaskForm
- [ ] T069 [US4] Handle success/error responses and update UI accordingly

**Checkpoint**: User Stories 1-4 should all work independently

---

## Phase 7: User Story 5 - Delete Task (Priority: P2)

**Goal**: Allow authenticated users to permanently remove tasks they own

**Independent Test**: Create task, delete it, verify no longer appears in list, attempting to access returns 404, validates ownership

### Implementation for User Story 5

- [X] T070 [US5] Implement delete todo service in backend/app/services/todo_service.py: delete_todo_for_user()
- [X] T071 [US5] Implement DELETE /api/v1/todos/{id} endpoint in backend/app/api/v1/todos.py
- [X] T072 [US5] Validate task ownership before deletion
- [X] T073 [US5] Delete task from database
- [X] T074 [US5] Return 204 No Content status on successful deletion
- [X] T075 [US5] Return 404 for non-existent or other user's tasks
- [X] T076 [US5] Return 401 for unauthenticated requests
- [ ] T077 [P] [US5] Add delete button to TodoItem component in frontend/components/todos/TodoItem.tsx
- [X] T078 [US5] Create API client for delete task in frontend/lib/api-client.ts: deleteTodo()
- [X] T079 [US5] Send DELETE request with Authorization header
- [ ] T080 [US5] Show confirmation dialog before deletion
- [ ] T081 [US5] Remove deleted task from UI list using optimistic update or re-fetch
- [ ] T082 [US5] Handle 404 and 401 errors gracefully in frontend

**Checkpoint**: User Stories 1-5 should all work independently

---

## Phase 8: User Story 6 - Toggle Task Completion (Priority: P3)

**Goal**: Allow users to quickly mark tasks as completed or incomplete with one click

**Independent Test**: Toggle completion status multiple times, verify each state change persisted correctly and reflected in list responses

### Implementation for User Story 6

- [X] T083 [US6] Implement toggle completion service in backend/app/services/todo_service.py: toggle_todo_completion()
- [X] T084 [US6] Implement PATCH /api/v1/todos/{id}/complete endpoint in backend/app/api/v1/todos.py
- [X] T085 [US6] Validate task ownership before toggle
- [X] T086 [US6] Toggle is_completed field to opposite value
- [X] T087 [US6] Update updated_at timestamp on toggle
- [X] T088 [US6] Return 200 with updated task showing new completion status
- [X] T089 [US6] Return 404 for non-existent or other user's tasks
- [X] T090 [US6] Return 401 for unauthenticated requests
- [ ] T091 [P] [US6] Add completion toggle checkbox to TodoItem component
- [X] T092 [US6] Create API client for toggle completion in frontend/lib/api-client.ts: toggleTodoCompletion()
- [X] T093 [US6] Send PATCH request with Authorization header
- [ ] T094 [US6] Update checkbox state immediately with optimistic UI
- [ ] T095 [US6] Revert optimistic update on error
- [ ] T096 [US6] Handle errors gracefully and show user feedback

**Checkpoint**: All user stories (1-6) should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T097 [P] Add comprehensive error boundary in frontend/components/shared/ErrorBoundary.tsx
- [ ] T098 [P] Add loading states to all API calls in frontend
- [ ] T099 Optimize database queries with proper indexes (user_id, created_at) in backend/app/models/todo.py
- [ ] T100 Implement proper logging in backend app for all API operations
- [ ] T101 Add request rate limiting middleware in backend/app/core/middleware.py
- [ ] T102 Add OpenAPI/Swagger documentation for all endpoints in backend/app/main.py
- [ ] T103 Add TypeScript type definitions sharing between frontend and backend if needed
- [ ] T104 Implement frontend route protection for authenticated pages
- [ ] T105 Add responsive design for mobile/tablet in frontend
- [ ] T106 Create README documentation for backend and frontend setup
- [ ] T107 Create .env.example with all required variables and comments
- [ ] T108 Update CLAUDE.md if needed based on implementation learnings

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order: P1 → P2 → P3
  - Note: P2 stories (US2, US4, US5) could be parallelized after US1 if team allows
  - P3 stories (US3, US6) could be parallelized after P1/P2 if team allows
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - List Tasks**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2) - Create Task**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 3 (P3) - View Details**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 4 (P2) - Update Task**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 5 (P2) - Delete Task**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 6 (P3) - Toggle Completion**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable

### Within Each User Story

- Services before endpoints
- Backend implementation before frontend components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T005, T006)
- All Foundational tasks marked [P] can run in parallel within Phase 2 (T010-T013)
- Once Foundational phase completes, user stories can be parallelized:
  - P1 (US1) first, then P2 stories (US2, US4, US5) in parallel, then P3 stories (US3, US6) in parallel
- All frontend component tasks marked [P] within a story can run in parallel
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1 (P1 - List Tasks)

```bash
# Launch all parallel frontend components for User Story 1:
Task: "Create TodoList Server Component in frontend/components/todos/TodoList.tsx"

# Sequential tasks that depend on earlier ones:
Task: "Implement list todos service in backend/app/services/todo_service.py"
# Then:
Task: "Implement GET /api/v1/todos endpoint in backend/app/api/v1/todos.py"
# Then:
Task: "Create API client for list todos in frontend/lib/api-client.ts: fetchTodos()"
```

---

## Parallel Example: User Story 2 (P2 - Create Task)

```bash
# Parallel tasks (can run together):
Task: "Create TodoForm Client Component in frontend/components/todos/TodoForm.tsx"

# Sequential tasks:
Task: "Implement create todo service in backend/app/services/todo_service.py"
# Then:
Task: "Implement POST /api/v1/todos endpoint in backend/app/api/v1/todos.py"
# Then:
Task: "Create API client for create task in frontend/lib/api-client.ts: createTodo()"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T019) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T020-T032)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Create test user via Better Auth
   - Create test tasks directly in database
   - Verify GET /api/v1/todos returns only user's tasks
   - Verify 401 for unauthenticated requests
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 4 (Update) → Test independently → Deploy/Demo
5. Add User Story 5 (Delete) → Test independently → Deploy/Demo
6. Add User Story 3 (View Details) → Test independently → Deploy/Demo
7. Add User Story 6 (Toggle) → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T019)
2. Once Foundational is done:
   - Developer A: User Story 1 (P1) - List Tasks
   - Developer B: User Story 2 (P2) - Create Task
   - Developer C: User Story 4 (P2) - Update Task
3. After P1 complete, Developer A can move to P3 stories:
   - Developer A: User Story 3 (P3) - View Details
   - Developer B moves to User Story 5 (P2) - Delete Task
4. Finally, Developer C handles User Story 6 (P3) - Toggle Completion
5. Stories complete and integrate independently

---

## Notes

- **[P] tasks** = different files, no dependencies, can run in parallel
- **[US#] label** = maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Foundational phase (T008-T019) is CRITICAL - blocks ALL user stories
- Better Auth handles user management, FastAPI handles task business logic
- Shared JWT_SECRET_KEY is required between Better Auth and FastAPI
- Tasks are user-scoped via user_id foreign key
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

- **Total Tasks**: 108
- **Setup Phase**: 7 tasks
- **Foundational Phase**: 12 tasks (CRITICAL - blocks all)
- **User Story 1 (List Tasks - P1)**: 13 tasks
- **User Story 2 (Create Task - P2)**: 14 tasks
- **User Story 3 (View Details - P3)**: 9 tasks
- **User Story 4 (Update Task - P2)**: 14 tasks
- **User Story 5 (Delete Task - P2)**: 13 tasks
- **User Story 6 (Toggle Completion - P3)**: 14 tasks
- **Polish Phase**: 12 tasks

- **Parallel Opportunities Identified**: 13 tasks marked [P] across all phases
- **Independent Test Criteria**: Each user story has clear independent test scenario
- **Suggested MVP Scope**: Phase 1 + Phase 2 + User Story 1 (32 tasks total)
