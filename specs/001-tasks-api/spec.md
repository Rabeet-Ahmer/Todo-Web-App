# Feature Specification: Tasks API

**Feature Branch**: `001-tasks-api`
**Created**: 2025-12-31
**Status**: Draft
**Input**: Below are the required endpoints (you can add more if needed). For Context read @backend\CLAUDE.md

Endpoint:
GET: /api/v1/todos - List all tasks
POST: /api/v1/todos - Create a new task
GET: /api/v1/todos/{id} - Get task details
PUT: /api/v1/todos/{id} - Update a task
DELETE: /api/v1/todos/{id} - Delete a task
PATCH: /api/v1/todos/{id}/complete - Toggle completion

## User Scenarios & Testing

<!--
IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
you should still have a viable MVP (Minimum Viable Product) that delivers value.

Assign priorities (P1, P2, P3, etc.) to each story, where P1 is most critical.
Think of each story as a standalone slice of functionality that can be:
- Developed independently
- Tested independently
- Deployed independently
- Demonstrated to users independently
-->

### User Story 1 - List User Tasks (Priority: P1)

An authenticated user navigates to tasks dashboard and wants to view all their assigned tasks. The system displays a paginated list of tasks with their current completion status, sorted by most recently modified.

**Why this priority**: This is the primary entry point for users to interact with the tasks feature. Without the ability to list tasks, users cannot perform any other task-related actions. High priority as it's the first screen users see after login.

**Independent Test**: Can be fully tested by creating test tasks for a user and verifying that API returns only that user's tasks in the correct order with proper pagination.

**Acceptance Scenarios**:

1. **Given** User is authenticated with valid JWT token, **When** User requests GET /api/v1/todos with valid Authorization header, **Then** System returns list of todos belonging to that user with status 200

2. **Given** User is authenticated, **When** User requests GET /api/v1/todos without JWT token, **Then** System returns 401 Unauthorized error

3. **Given** User has no tasks, **When** User requests tasks list, **Then** System returns empty array with status 200

4. **Given** User has more than 100 tasks, **When** User requests tasks list with default pagination, **Then** System returns first 100 tasks with pagination metadata

---

### User Story 2 - Create New Task (Priority: P2)

A user wants to create a new task from the dashboard. The user provides a task title (required), optional description, and submits a form. The system creates a task, associates it with the authenticated user, and confirms creation with task details including generated ID.

**Why this priority**: Users need to be able to create tasks for the system to be functional. This enables the core value of the application - task management. While listing tasks is more fundamental, creating tasks is a primary action users will perform.

**Independent Test**: Can be tested independently by creating a task via POST request and verifying that task appears in subsequent GET requests with correct user association, ID, and timestamps.

**Acceptance Scenarios**:

1. **Given** User is authenticated, **When** User submits POST /api/v1/todos with valid title in request body, **Then** System creates task, returns 201 Created with task object including generated ID, user_id, and timestamps

2. **Given** User is authenticated, **When** User submits POST /api/v1/todos without title field, **Then** System returns 422 validation error with details about missing required field

3. **Given** User is authenticated, **When** User submits POST /api/v1/todos with title exceeding 200 characters, **Then** System returns 422 validation error with details about maximum length constraint

4. **Given** User is not authenticated, **When** User attempts to create task, **Then** System returns 401 Unauthorized error

---

### User Story 3 - View Task Details (Priority: P3)

A user wants to view detailed information about a specific task by clicking on it from the list. The system retrieves and displays full task details including title, description, completion status, creation date, and last modified date.

**Why this priority**: Viewing task details is important for users to understand context and requirements before editing or completing tasks. It's lower priority than list and create actions but necessary for full task management functionality.

**Independent Test**: Can be tested independently by retrieving a specific task ID and verifying all fields are returned correctly including optional description field.

**Acceptance Scenarios**:

1. **Given** User is authenticated and task exists and belongs to user, **When** User requests GET /api/v1/todos/{id}, **Then** System returns task details with status 200

2. **Given** User is authenticated but task belongs to different user, **When** User requests GET /api/v1/todos/{id}, **Then** System returns 404 Not Found error

3. **Given** User is authenticated, **When** User requests GET /api/v1/todos/{id} for non-existent ID, **Then** System returns 404 Not Found error

---

### User Story 4 - Update Existing Task (Priority: P2)

A user wants to modify an existing task's information. The user can update the title, description, and/or completion status of a task. The system validates that the user owns the task, applies the changes, persists them, and returns the updated task.

**Why this priority**: Task modification is a core feature - users need to correct mistakes, add information, or mark tasks as complete. This is critical for the ongoing usefulness of tasks after creation.

**Independent Test**: Can be tested independently by updating various fields and verifying that changes are persisted correctly, including completion status toggling, title changes, and description updates.

**Acceptance Scenarios**:

1. **Given** User is authenticated and owns the task, **When** User submits PUT /api/v1/todos/{id} with updated fields, **Then** System updates task and returns 200 with updated task object

2. **Given** User is authenticated but does not own the task, **When** User attempts PUT /api/v1/todos/{id}, **Then** System returns 404 Not Found error

3. **Given** User is authenticated and owns the task, **When** User submits PUT /api/v1/todos/{id} with no changes (empty body), **Then** System returns 422 validation error or returns task without changes

4. **Given** User is authenticated and owns the task, **When** User submits PUT /api/v1/todos/{id} with invalid title (empty or too long), **Then** System returns 422 validation error with specific field violations

---

### User Story 5 - Delete Task (Priority: P2)

A user wants to permanently remove a task they no longer need. The user requests deletion of a specific task. The system verifies that the user owns the task, deletes it from the database, and confirms successful deletion.

**Why this priority**: Deletion is essential for task management - users need to remove completed tasks, cancel unwanted tasks, and keep their task list clean. Without deletion, the task list would grow indefinitely.

**Independent Test**: Can be tested independently by creating a task, deleting it, and verifying that it no longer appears in subsequent list requests and attempting to access it returns 404.

**Acceptance Scenarios**:

1. **Given** User is authenticated and owns the task, **When** User submits DELETE /api/v1/todos/{id}, **Then** System deletes task and returns 204 No Content status

2. **Given** User is authenticated but does not own the task, **When** User attempts DELETE /api/v1/todos/{id}, **Then** System returns 404 Not Found error

3. **Given** User is authenticated, **When** User attempts to delete non-existent task, **Then** System returns 404 Not Found error

4. **Given** User is not authenticated, **When** User attempts to delete task, **Then** System returns 401 Unauthorized error

---

### User Story 6 - Toggle Task Completion (Priority: P3)

A user wants to quickly mark a task as completed or incomplete without navigating to a separate edit screen. The user can click a checkbox or toggle button on a task to change its completion status. The system updates the completion status and returns confirmation.

**Why this priority**: Quick status toggling improves user experience by allowing one-click task completion. While important for usability, full editing (User Story 4) covers this functionality, so this is a convenience feature with lower priority.

**Independent Test**: Can be tested independently by toggling completion status multiple times and verifying that each state change is persisted correctly and reflected in list responses.

**Acceptance Scenarios**:

1. **Given** User is authenticated and owns the task, **When** User submits PATCH /api/v1/todos/{id}/complete to mark as complete, **Then** System updates task and returns 200 with updated task showing is_completed=true

2. **Given** User is authenticated and owns the task, **When** User submits PATCH /api/v1/todos/{id}/complete to mark as incomplete, **Then** System updates task and returns 200 with updated task showing is_completed=false

3. **Given** User is authenticated but does not own the task, **When** User attempts PATCH /api/v1/todos/{id}/complete, **Then** System returns 404 Not Found error

4. **Given** User is not authenticated, **When** User attempts to toggle completion, **Then** System returns 401 Unauthorized error

---

### Edge Cases

- What happens when user creates a task while offline?
  - Frontend should show optimistic UI update and queue request for when connection resumes
  - Backend should handle duplicate creation by validating uniqueness if required, or allow duplicates with different timestamps

- How does system handle concurrent modifications to the same task?
  - Use database-level locking or optimistic versioning if needed
  - Last-write-wins strategy is acceptable for simple task management

- What happens when user attempts to update/delete a task that was just deleted by another user?
  - Since tasks are user-scoped, this only applies if users share tasks (not in current scope)
  - Return 404 Not Found error

- How does system handle tasks with very long descriptions?
  - Store as TEXT type in database
  - Truncate or reject if exceeding maximum length (1000 characters) with 413 error

- What happens when user reaches task limit (e.g., 1000 tasks)?
  - Return tasks with pagination
  - Add metadata to response indicating total count and whether more pages exist

- How does system handle special characters in task titles?
  - Sanitize input on frontend and validate length on backend
  - Allow common characters but reject potentially malicious input patterns

- What happens if JWT token expires mid-request?
  - Return 401 Unauthorized error
  - Frontend should prompt user to re-authenticate

- How does system handle timezone differences for task dates?
  - Store all timestamps in UTC
  - Frontend converts to user's local timezone for display

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow authenticated users to list all their tasks with pagination support
- **FR-002**: System MUST allow authenticated users to create new tasks with title (required) and description (optional)
- **FR-003**: System MUST allow users to view individual task details by task ID
- **FR-004**: System MUST allow authenticated users who own a task to update task fields (title, description, completion status)
- **FR-005**: System MUST allow authenticated users who own a task to delete it permanently
- **FR-006**: System MUST allow users to toggle task completion status via dedicated endpoint
- **FR-007**: System MUST validate JWT token on every protected endpoint request
- **FR-008**: System MUST ensure users can only access their own tasks (security isolation)
- **FR-009**: System MUST return appropriate HTTP status codes (200, 201, 401, 403, 404, 422, 500)
- **FR-010**: System MUST validate input constraints (title max 200 characters, description max 1000 characters)

### Key Entities

- **Task**: Represents a single task or todo item
  - Attributes: id (unique identifier), title (required, max 200 chars), description (optional, max 1000 chars), is_completed (boolean), user_id (foreign key to users), created_at (timestamp), updated_at (timestamp)
  - Relationships: Belongs to exactly one User (from Better Auth's users table)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can retrieve their task list with page load time under 1 second
- **SC-002**: Task creation API responds in under 100ms (P95)
- **SC-003**: Task update API responds in under 100ms (P95)
- **SC-004**: Task deletion API responds in under 100ms (P95)
- **SC-005**: System enforces user task isolation - 100% of requests only return user's own data
- **SC-006**: All protected endpoints reject unauthenticated requests (401 status) within 50ms
- **SC-007**: 95% of task operations complete successfully on first attempt when inputs are valid
- **SC-008**: System handles concurrent requests gracefully without data corruption
