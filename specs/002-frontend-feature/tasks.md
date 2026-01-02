# Tasks: Frontend UI Components Architecture

**Input**: Design documents from `/specs/002-frontend-feature/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create frontend directory structure per implementation plan
- [x] T002 Configure `frontend/globals.css` with Tailwind 4.x base styles
- [x] T003 [P] Implement `frontend/lib/utils.ts` for `cn()` utility
- [x] T004 [P] Setup `frontend/components/shared/ErrorBoundary.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T005 [P] Install core shadcn/ui primitives: button, card, input, label, form
- [x] T006 Implement `frontend/app/layout.tsx` with font and metadata configuration
- [x] T007 [P] Create `frontend/app/loading.tsx` and `frontend/app/not-found.tsx` placeholders
- [x] T008 [P] Setup `frontend/lib/validations/auth.schema.ts` and `frontend/lib/validations/todo.schema.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Authentication Flow UI (Priority: P1) 🎯 MVP

**Goal**: Implement the login and registration page layouts and forms.

**Independent Test**: Navigate to `/login` and `/register` to verify form fields and basic validation.

### Implementation for User Story 1

- [x] T009 [P] [US1] Implement `frontend/app/(auth)/login/page.tsx` with email/password form
- [x] T010 [P] [US1] Implement `frontend/app/(auth)/register/page.tsx` with name/email/password form
- [x] T011 [P] [US1] Create `frontend/components/auth/AuthCard.tsx` wrapper for auth forms
- [x] T012 [US1] Add client-side validation to auth forms using Zod schemas

**Checkpoint**: User Story 1 is fully functional as a UI increment.

---

## Phase 4: User Story 2 - Todo Management UI (Priority: P1)

**Goal**: Implement the dashboard shell and todo list view.

**Independent Test**: Navigate to `/dashboard` and `/todos` and verify the sidebar and task list display.

### Implementation for User Story 2

- [x] T013 [US2] Install shadcn/ui sidebar component block
- [x] T014 [US2] Implement `frontend/app/(dashboard)/layout.tsx` with responsive sidebar
- [x] T015 [P] [US2] Implement `frontend/app/(dashboard)/page.tsx` (Dashboard Home)
- [x] T016 [P] [US2] Implement `frontend/app/(dashboard)/todos/page.tsx` with task list container
- [x] T017 [P] [US2] Create `frontend/components/todos/TodoItem.tsx` and `frontend/components/todos/TodoList.tsx`
- [x] T018 [US2] Add mock task data for UI demonstration in `frontend/app/(dashboard)/todos/page.tsx`

**Checkpoint**: User Story 2 provides the core application experience with mock data.

---

## Phase 5: User Story 3 - Task Detail View (Priority: P2)

**Goal**: Implement the dynamic route for individual task details.

**Independent Test**: Navigate to `/todos/1` and verify the detailed task view.

### Implementation for User Story 3

- [x] T019 [US3] Implement `frontend/app/(dashboard)/todos/[id]/page.tsx` for dynamic task details
- [x] T020 [US3] Create `frontend/components/todos/TodoDetail.tsx` component
- [x] T021 [P] [US3] Implement `frontend/app/(dashboard)/todos/[id]/not-found.tsx` for missing tasks

**Checkpoint**: All user stories have functional UI routes.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T022 [P] Implement persistent sidebar state (collapsed/expanded) in `localStorage`
- [x] T023 Add toast notifications container in root layout using `sonner`
- [x] T024 [P] Optimize initial load by adding `Suspense` boundaries where appropriate
- [x] T025 Run `frontend/quickstart.md` validation to ensure all paths are reachable

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup.
- **User Stories (Phase 3-5)**: Depend on Foundational (Phase 2). US1 and US2 are both P1 and can be done in parallel if Foundation is complete.
- **Polish (Final Phase)**: Depends on all stories.

### Parallel Opportunities

- T003, T004 (Setup utilities)
- T007, T008 (Base placeholders and schemas)
- T009, T010, T011 (Auth pages and wrappers)
- T015, T016, T017 (Dashboard pages and todo list components)

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Setup and Foundational.
2. Complete Auth UI (US1).
3. Complete Dashboard shell and Todo list (US2).
4. **STOP and VALIDATE**: Verify end-to-to navigation from Login -> Dashboard -> Todos.
