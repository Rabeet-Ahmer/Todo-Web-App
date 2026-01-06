# Implementation Plan: Frontend UI Components Architecture

**Branch**: `002-frontend-feature` | **Date**: 2026-01-02 | **Spec**: `/specs/002-frontend-feature/spec.md`
**Input**: Feature specification for a comprehensive todo app UI using Next.js 16 and Shadcn.

## Summary

This plan outlines the implementation of the core frontend architecture. It focuses on establishing a robust file structure, implementing responsive layouts and theme-aware components, and preparing for authentication and todo management UI. We will use Next.js 16 (App Router) features including React 19 hooks and Server Components by default (80%+ target).

## Technical Context

- **Language/Version**: TypeScript 5.8+, React 19.2.3, Next.js 16.1.1
- **Primary Dependencies**: TailwindCSS 4.x, shadcn/ui, Zod, React Hook Form, Lucide React
- **Storage**: Browser `localStorage` for UI preferences (Sidebar state)
- **Testing**: Playwright for E2E UI testing (planned for Phase 2)
- **Target Platform**: All modern browsers (Next.js 16 targets latest ES features)
- **Project Type**: Web Application (Monorepo structure but current focus is `frontend/`)
- **Performance Goals**: FCP < 1.0s, TTI < 2.0s, Lighthouse Score 90+
- **Constraints**: No custom CSS allowed per Principle V; strict Server Component usage per Principle III.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: Component-First**: ✅ All UI built from shadcn primitives.
- **Principle II: Type Safety**: ✅ Strict TS config; Zod for form validation.
- **Principle III: Server-Client**: ✅ Pages/Layouts are Server Components; Interactivity isolated to leaf nodes.
- **Principle V: Styling**: ✅ Pure Tailwind; no custom CSS.
- **Principle VII: Performance**: ✅ Streaming with Suspense and loading.tsx.
- **Principle X: Error Handling**: ✅ Global Error Boundaries and typed API responses.

## Project Structure (Repository root)

```text
frontend/
├── app/
│   ├── (auth)/                  # Auth group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/             # Dashboard group
│   │   ├── layout.tsx           # Dashboard-specific layout (Sidebar)
│   │   ├── todos/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── page.tsx             # Dashboard home
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Tailwind base
├── components/
│   ├── ui/                      # shadcn primitives
│   ├── todos/                   # Feature components
│   └── shared/                  # Navigation, ErrorBoundary
├── lib/
│   ├── utils.ts                 # cn() utility
│   └── validations/             # Zod schemas
└── hooks/                       # useAuth, useOptimistic
```

**Structure Decision**: Standard Next.js 16 App Router structure with feature colocation in `components/`.

## Complexity Tracking

*No current violations identified.*

## Implementation Steps

### Phase 2: UI Implementation (Current Focus)

1. **Root Configuration**: Setup `globals.css` with Tailwind 4.x and `lib/utils.ts`.
2. **Auth UI**: Implement `(auth)` group with shadcn `Card` and `Form` components.
3. **Dashboard Shell**: Implement `(dashboard)/layout.tsx` using shadcn `Sidebar` block.
4. **Todo Views**:
   - `/todos`: Implement list view with card components.
   - `/todos/[id]`: Implement dynamic detail view.
5. **Shared Assets**: Add `ErrorBoundary.tsx`, `loading.tsx`, and `not-found.tsx` across routes.
