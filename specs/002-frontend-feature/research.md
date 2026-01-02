# Research: Frontend UI Components Architecture

## Next.js 16 Best Practices

Based on Context7 research for Next.js v16.1.0:

- **Server Components**: Default for layouts and pages. Use for data fetching and static markup.
- **Client Components**: Marked with `'use client'`. Required for interactivity (hooks, event handlers).
- **Dynamic Routes**: Resolving `params` in Client Components requires the `use()` hook from React 19 as `params` is now a Promise.
- **Context Providers**: Must be Client Components that wrap `children`.
- **Navigation**: Use `useSelectedLayoutSegment` for active link styling in Client Components.

## UI Component Strategy

Utilizing shadcn/ui primitives and blocks:

- **Layout**: `sidebar-07` (Collapses to icons) or `sidebar-16` (Sticky header) for the main application dashboard.
- **Auth**: `login-01` and `signup-01` as base blocks for authentication pages.
- **Todos**: `card` for task items, `form` with `react-hook-form` and `zod` for creation.
- **Feedback**: `skeleton` for loading states, `sonner` for toast notifications.

## Technical Decisions

| Decision | Rationale | Alternatives |
|----------|-----------|--------------|
| **React 19 Hooks** | Required for Next.js 16; `use()` for promise resolution in client components. | Prop drilling from server components (less flexible). |
| **shadcn/ui Sidebar** | Principle I & V compliance; provides accessible, reusable navigation. | Custom CSS sidebar (Principle V violation). |
| **Server Actions** | Simplified mutation logic and automatic revalidation. | API route handlers (more boilerplate). |
| **Route Groups** | Clean URL structure and shared layouts without URL segments. | Flat structure (complex layout management). |
