# Data Model: Frontend UI Layer

This document defines the entities and UI-specific data structures for the frontend implementation.

## UI Entities

### UserSession
Represents the current user's session state (derived from Better Auth).

- **user**: object
  - **id**: string
  - **email**: string
  - **name**: string
- **isAuthenticated**: boolean (computed)
- **isLoading**: boolean

### TodoUI
Optimistic representation of a Todo item for the UI.

- **id**: number | string (temp ID for optimistic updates)
- **title**: string
- **description**: string | null
- **is_completed**: boolean
- **is_optimistic**: boolean (internal flag for UI state)
- **created_at**: string (ISO)

### NavigationItem
Structure for sidebar and header links.

- **title**: string
- **href**: string
- **icon**: ReactComponent
- **isActive**: boolean (computed via `usePathname`)

## State Transitions

### Todo Creation
1. User submits form.
2. **Optimistic State**: Add item to `TodoUI` list with `is_optimistic: true`.
3. **Server Action**: Call `createTodo`.
4. **Resync**: Revalidate path; actual item replaces optimistic item.

### Filter Changes
- `all` | `active` | `completed`
- Stored as URL search param `?filter=...` for shareable state.
