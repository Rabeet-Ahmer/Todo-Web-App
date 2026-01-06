# Frontend Development Rules

## Next.js 16 App Router Conventions

### 1. Component Architecture

**Default: Server Components**
- No `'use client'` directive unless necessary
- Server Components can fetch data directly (no need for `useEffect`)
- Better performance: 80%+ of components should be Server Components

**When to Use Client Components:**
Only when you need:
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`localStorage`, `window`, `document`)
- State management (`useState`, `useReducer`)
- Form submission with user interaction
- Hooks like `useRouter`, `useSearchParams`, `usePathname`

**Mark Client Components:**
```typescript
'use client'  // Must be at the TOP of the file, before any imports

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

**Nesting Client Components:**
```typescript
// Server Component (default)
import Header from './header'
import Counter from './counter'  // Client Component

export default function Page() {
  return (
    <div>
      <Header />           {/* Server Component */}
      <Counter />          {/* Client Component */}
    </div>
  )
}
```

### 2. File Organization

**Pages and Routes:**
- Pages in `app/`: `page.tsx`, `layout.tsx`
- Route groups: `(auth)/`, `(dashboard)/` with parentheses (no URL segment)
- Dynamic routes: `[id]/page.tsx`, `[slug]/page.tsx`
- Parallel routes: `@team/page.tsx`
- Intercepting routes: `(..)parent/page.tsx`

**Example Structure:**
```
app/
├── auth/                    # Auth group (no URL segment)
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── dashboard/               # Dashboard group
│   ├── layout.tsx
│   ├── todos/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── settings/
│       └── page.tsx
├── api/                       # Better Auth API route
│   └── auth/
│       └── [...better-auth]/
│           └── route.ts
├── layout.tsx                 # Root layout
├── page.tsx                   # Home page
├── globals.css                # Tailwind styles
└── favicon.ico
```

### 3. Styling Standards

**Tailwind CSS Only:**
- No custom CSS files unless for animations (`styles/animations.css`)
- Use `cn()` utility from `lib/utils.ts` for class merging
- shadcn/ui primitives in `components/ui/`
- **shadcn/ui is initialized** - Use Shadcn MCP for components
- Design tokens via Tailwind config, not magic numbers

**Utility Function (lib/utils.ts):**
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Usage Example:**
```typescript
import { cn } from "@/lib/utils"

interface ButtonProps {
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  className?: string
  children: React.ReactNode
}

export function Button({ variant, size, className, children }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-md font-medium transition-colors",
        {
          "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
          "bg-gray-200 text-gray-900 hover:bg-gray-300": variant === "secondary",
        },
        {
          "px-3 py-1 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        className
      )}
    >
      {children}
    </button>
  )
}
```

### 4. Type Safety

**Zod Schemas for Runtime Validation:**
```typescript
// lib/validations/todo.schema.ts
import { z } from "zod"

export const todoSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  is_completed: z.boolean(),
  created_at: z.string().datetime(),
})

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
})

export const updateTodoSchema = createTodoSchema.partial().extend({
  is_completed: z.boolean().optional(),
})

export type Todo = z.infer<typeof todoSchema>
export type CreateTodo = z.infer<typeof createTodoSchema>
export type UpdateTodo = z.infer<typeof updateTodoSchema>
```

**Shared Types (lib/types.ts):**
```typescript
// Shared between frontend and backend (synchronized)
export interface User {
  id: number
  email: string
  username: string
  is_active: boolean
  created_at: string
}

export interface Todo {
  id: number
  title: string
  description?: string
  is_completed: boolean
  user_id: number
  created_at: string
  updated_at: string
}

export interface ApiError {
  detail: string
  status_code: number
}
```

**Type Safety Rules:**
- No `any` types - use `unknown` or proper interfaces
- Use `z.infer<>` to generate types from Zod schemas
- React.FC discouraged; use function components directly
- Always define prop interfaces for components

### 5. Better Auth Integration (Frontend)

**Architecture Overview:**
- **Better Auth** handles authentication only (users, sessions, JWT generation)
- **FastAPI** handles business logic (todos, tasks, CRUD operations)
- **Both connect to the same PostgreSQL database** (different tables)
- **Shared JWT secret** between Better Auth and FastAPI for token validation
- **Frontend bridges both**: Extracts JWT from Better Auth cookie → Sends to FastAPI

```
┌─────────────────────────────────────────────────┐
│              Next.js Frontend                   │
│         (Better Auth + UI Components)           │
└─────────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌────────────────┐      ┌────────────────┐
│  Better Auth   │      │   FastAPI      │
│  - Users table │      │  - Todos table │
│  - Sessions    │◄─────┤  - Validates   │
│  - JWT + Cookie│      │    JWT token   │
└────────────────┘      └────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
              ┌──────────────┐
              │ PostgreSQL   │
              │              │
              │ users        │ ← Better Auth owns
              │ sessions     │ ← Better Auth owns
              │ todos        │ ← FastAPI owns (FK to users)
              └──────────────┘
```

**Environment Variables (.env.local):**
```bash
# Better Auth (Next.js)
BETTER_AUTH_SECRET="super-secret-key-123"
BETTER_AUTH_URL="http://localhost:3000"

# Database (Both Better Auth and FastAPI share this)
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

# FastAPI Backend
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

**Better Auth Setup (lib/auth.ts):**
```typescript
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/db"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
  },
})
```

**Better Auth API Route (app/api/auth/[...better-auth]/route.ts):**
```typescript
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

**Middleware for Route Protection:**
```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const { pathname } = request.nextUrl

  // Redirect authenticated users from login/signup
  if (sessionCookie && ["/login", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Protect dashboard routes
  if (!sessionCookie && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"]
}
```

**Session Validation in Server Components:**
```typescript
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <h1>Welcome, {session.user.email}</h1>
      <p>User ID: {session.user.id}</p>
    </div>
  )
}
```

**JWT Token Extraction for FastAPI Communication:**
```typescript
// lib/auth-client.ts
import { cookies } from "next/headers"

/**
 * Extract JWT token from Better Auth session cookie
 * This token will be sent to FastAPI for authentication
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()

  // Better Auth stores session in cookies with specific names
  // The exact cookie name depends on your Better Auth configuration
  const sessionToken = cookieStore.get("better-auth.session_token")

  if (!sessionToken) {
    return null
  }

  return sessionToken.value
}

/**
 * Better Auth client for auth operations
 */
export const authClient = auth
```

**API Client for FastAPI Communication:**
```typescript
// lib/api-client.ts
import { getAuthToken } from "./auth-client"

/**
 * Base API client for FastAPI backend
 * Automatically includes JWT token from Better Auth session
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken()

  if (!token) {
    throw new Error("Not authenticated. Please login first.")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error: ApiError = await response.json()

    // Handle authentication errors
    if (response.status === 401) {
      // Token invalid or expired - redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      throw new Error("Session expired. Please login again.")
    }

    throw new Error(error.detail || "API request failed")
  }

  return response.json()
}

/**
 * Helper for GET requests
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: "GET" })
}

/**
 * Helper for POST requests
 */
export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * Helper for PATCH requests
 */
export async function apiPatch<T>(endpoint: string, data: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

/**
 * Helper for DELETE requests
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: "DELETE" })
}
```

**Signup Page with Better Auth:**
```typescript
// app/(auth)/signup/page.tsx
"use client"

import { useState } from "react"
import { signUp } from "better-auth/react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Sign up with Better Auth
      // Better Auth directly creates user in PostgreSQL
      await signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      })

      // Better Auth automatically handles:
      // 1. Password hashing
      // 2. User creation in PostgreSQL
      // 3. Session creation
      // 4. JWT token generation
      // 5. Cookie setting

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password (min 8 characters)"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  )
}
```

**Login Page with Better Auth:**
```typescript
// app/(auth)/login/page.tsx
"use client"

import { useState } from "react"
import { signIn } from "better-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Sign in with Better Auth
      // Better Auth validates credentials against PostgreSQL
      await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      })

      // Better Auth automatically handles:
      // 1. Credential validation
      // 2. Session lookup
      // 3. JWT token generation (or retrieval from existing session)
      // 4. Cookie setting

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Invalid email or password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Login"}
      </button>
    </form>
  )
}
```

**Logout:**
```typescript
// components/auth/LogoutButton.tsx
"use client"

import { signOut } from "better-auth/react"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    // Better Auth handles session cleanup
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login")
        },
      },
    })
  }

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}
```

### 6. Data Fetching Patterns

**Server Components (fetching from FastAPI):**
```typescript
// app/todos/page.tsx (Server Component)
import { getAuthToken } from "@/lib/auth-client"
import { redirect } from "next/navigation"

export default async function TodosPage() {
  const token = await getAuthToken()

  if (!token) {
    redirect("/login")
  }

  // Fetch todos from FastAPI
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    cache: "no-store",  // Disable caching for real-time data
  })

  if (!response.ok) {
    if (response.status === 401) {
      redirect("/login")
    }
    throw new Error("Failed to fetch todos")
  }

  const todos = await response.json()

  return (
    <div>
      <h1>My Todos</h1>
      <TodoList todos={todos} />
    </div>
  )
}
```

**Client Components with SWR:**
```typescript
// hooks/useTodos.ts
import useSWR from "swr"
import { apiGet } from "@/lib/api-client"

export function useTodos() {
  const { data, error, mutate } = useSWR<Todo[]>(
    "/api/v1/todos",
    () => apiGet<Todo[]>("/api/v1/todos"),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  return {
    todos: data,
    isLoading: !error && !data,
    error,
    mutate,
  }
}

// Usage in Client Component
"use client"
import { useTodos } from "@/hooks/useTodos"

export default function TodoList() {
  const { todos, isLoading, error } = useTodos()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

**Server Actions for Mutations:**
```typescript
// actions/todo.actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { apiPost, apiPatch, apiDelete } from "@/lib/api-client"

export async function createTodo(title: string, description?: string) {
  const todo = await apiPost<Todo>("/api/v1/todos", {
    title,
    description,
  })

  revalidatePath("/todos")
  revalidatePath("/dashboard")
  return todo
}

export async function updateTodo(id: number, updates: Partial<Todo>) {
  const todo = await apiPatch<Todo>(`/api/v1/todos/${id}`, updates)

  revalidatePath("/todos")
  revalidatePath("/dashboard")
  return todo
}

export async function deleteTodo(id: number) {
  await apiDelete(`/api/v1/todos/${id}`)

  revalidatePath("/todos")
  revalidatePath("/dashboard")
}

export async function toggleTodoComplete(id: number, is_completed: boolean) {
  return updateTodo(id, { is_completed })
}
```

**Invoking Server Actions from Client Components:**
```typescript
"use client"

import { createTodo } from "@/actions/todo.actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateTodoForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      await createTodo(
        formData.get("title") as string,
        formData.get("description") as string
      )
      router.refresh() // Refresh server components
    } catch (error) {
      console.error("Failed to create todo:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Todo"}
      </button>
    </form>
  )
}
```

### 7. Component Patterns

**Props-Down, Events-Up:**
```typescript
// Parent Component
import TodoItem from "./TodoItem"

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  const handleToggle = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo
      )
    )
  }

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => handleToggle(todo.id)}
        />
      ))}
    </ul>
  )
}

// Child Component
interface TodoItemProps {
  todo: Todo
  onToggle: () => void
}

export default function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.is_completed}
        onChange={onToggle}
      />
      <span>{todo.title}</span>
    </li>
  )
}
```

**Custom Hooks Pattern (hooks/):**
```typescript
// hooks/useAuth.ts
import { useAuthClient } from "better-auth/react"

export function useAuth() {
  const authClient = useAuthClient()
  const { data: session, isPending } = authClient.useSession()

  return {
    user: session?.user,
    session,
    isLoading: isPending,
    isAuthenticated: !!session,
  }
}

// hooks/useOptimistic.ts
import { useOptimistic, useTransition } from "react"

export function useOptimisticTodos(todos: Todo[]) {
  const [isPending, startTransition] = useTransition()
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  )

  const createTodo = async (title: string) => {
    // Optimistic update
    const optimisticTodo: Todo = {
      id: Date.now(),
      title,
      is_completed: false,
      user_id: 0, // Will be set by server
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    startTransition(() => {
      addOptimisticTodo(optimisticTodo)
    })

    // Actual API call
    await createTodoAction(title)
  }

  return { todos: optimisticTodos, createTodo, isPending }
}
```

**Feature-Based Folders:**
```
components/
├── todos/                      # Todo feature components
│   ├── TodoList.tsx
│   ├── TodoItem.tsx
│   ├── TodoForm.tsx           # Client Component
│   └── TodoFilters.tsx        # Client Component
├── auth/                       # Auth feature components
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── LogoutButton.tsx
└── shared/                     # Shared components
    ├── Header.tsx
    ├── Footer.tsx
    └── ErrorBoundary.tsx
```

### 8. Form Handling

**React Hook Form + Zod:**
```typescript
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTodoSchema, type CreateTodo } from "@/lib/validations/todo.schema"

export default function CreateTodoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodo>({
    resolver: zodResolver(createTodoSchema),
  })

  const onSubmit = async (data: CreateTodo) => {
    await createTodo(data.title, data.description)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("title")}
        placeholder="Title"
      />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <textarea
        {...register("description")}
        placeholder="Description"
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Todo"}
      </button>
    </form>
  )
}
```

### 9. Performance Requirements

**Server Component Target:**
- 80%+ of components should be Server Components
- Only mark Client Components when absolutely necessary

**Bundle Size:**
- <250KB gzipped for initial load
- Use dynamic imports for heavy Client Components:

```typescript
import dynamic from "next/dynamic"

const TodoForm = dynamic(() => import("./components/todos/TodoForm"), {
  loading: () => <p>Loading...</p>,
  ssr: false,  // Disable SSR if needed
})
```

**Rendering Performance:**
- First Contentful Paint: <1.5s
- Use `next/image` for all images (automatic optimization)
- Use `Suspense` boundaries for streaming:

```typescript
import { Suspense } from "react"

export default function TodosPage() {
  return (
    <div>
      <h1>My Todos</h1>
      <Suspense fallback={<div>Loading todos...</div>}>
        <TodoList />
      </Suspense>
    </div>
  )
}
```

### 10. Error Handling

**Error Boundaries:**
```typescript
// components/shared/ErrorBoundary.tsx
"use client"

import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-500 rounded-md">
          <h2 className="text-red-500 font-bold">Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      )
    }

    return this.props.children
  }
}
```

**Not-Found Pages:**
```typescript
// app/todos/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Todo Not Found</h2>
      <p>This todo does not exist.</p>
    </div>
  )
}
```

**Global Error Page:**
```typescript
// app/global-error.tsx
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
      </body>
    </html>
  )
}
```

**API Error Handling (already in api-client.ts above):**
- 401 errors redirect to login
- Other errors are thrown with messages
- Automatic token inclusion in headers

### 11. Routing Hooks (Client Components Only)

```typescript
"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

export default function Component() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleNavigate = () => {
    router.push("/dashboard")
    router.replace("/dashboard")  // Replace history
    router.refresh()             // Refresh current route
  }

  return <div>Current path: {pathname}</div>
}
```

### 12. Accessibility

**Semantic HTML:**
```typescript
// ✅ Good
<nav>
  <ul>
    <li><a href="/todos">Todos</a></li>
  </ul>
</nav>

<button type="button">Click me</button>

// ❌ Bad
<div className="nav">
  <div onClick={() => router.push("/todos")}>Todos</div>
</div>

<div onClick={handleClick}>Click me</div>
```

**ARIA Labels:**
```typescript
<button
  onClick={() => toggleMenu()}
  aria-label="Toggle menu"
  aria-expanded={isOpen}
>
  <MenuIcon />
</button>
```

**Keyboard Navigation:**
```typescript
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick()
    }
  }}
  onClick={handleClick}
>
  Accessible Button
</div>
```

### 13. File Naming Conventions

**Frontend Files:**
- **Components**: `PascalCase.tsx` (e.g., `TodoList.tsx`, `TodoItem.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `api-client.ts`, `format-date.ts`)
- **Hooks**: `camelCase.ts` with `use` prefix (e.g., `useTodos.ts`, `useAuth.ts`)
- **Actions**: `kebab-case.actions.ts` (e.g., `todo.actions.ts`)
- **Schemas**: `kebab-case.schema.ts` (e.g., `todo.schema.ts`)
- **Types**: `kebab-case.types.ts` or `types.ts`
- **Pages**: `page.tsx` (Next.js App Router convention)
- **Layouts**: `layout.tsx` (Next.js App Router convention)
- **Route Groups**: `(groupname)/` with parentheses (e.g., `(auth)/`)

### 14. Directory Organization Rules

1. **Server Components by default** - No `'use client'` directive unless necessary
2. **Colocation**: Keep related files together (component + test + styles if needed)
3. **Feature-based folders**: Group by feature, not by type (e.g., `components/todos/` not `components/forms/`)
4. **Shared utilities in `lib/`**: Common helpers, API clients, type definitions
5. **UI primitives in `components/ui/`**: shadcn/ui components only

---

## **Summary: Better Auth + FastAPI Architecture**

**What Better Auth Does:**
- Handles user registration and login
- Stores users and sessions in PostgreSQL
- Generates JWT tokens and sets httpOnly cookies
- Validates sessions for frontend route protection

**What FastAPI Does:**
- Validates JWT tokens from frontend
- Queries Better Auth's user table to verify users
- Handles business logic (todos CRUD)
- Stores todos in PostgreSQL with user_id foreign key

**What Frontend Does:**
- Extracts JWT token from Better Auth cookie
- Sends JWT to FastAPI in Authorization header
- Handles UI for auth and business features
- Bridges Better Auth and FastAPI
