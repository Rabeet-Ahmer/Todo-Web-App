# Quickstart: Frontend UI Development

## Prerequisites
- Node.js 20+
- Shadcn UI initialized (already done)

## Environment Setup
Ensure `.env.local` contains:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:3000
```

## Running the UI
```bash
cd frontend
npm run dev
```

## Key Folders
- `app/`: Routing and layouts
- `components/ui/`: Shadcn primitives
- `components/todos/`: Feature-specific components
- `lib/validations/`: Zod schemas for forms

## Component Guidelines
1. **Server Components (Default)**: Use for `page.tsx`, `layout.tsx`, and read-only UI.
2. **Client Components**: Add `'use client'` only for interactive forms or browser APIs.
3. **Icons**: Use `lucide-react`.
