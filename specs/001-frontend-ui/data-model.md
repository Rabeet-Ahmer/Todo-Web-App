# Data Models: Frontend UI Components

**Feature**: 001-frontend-ui
**Date**: 2026-01-02
**Status**: Complete

## Overview

This document defines the data structures, component interfaces, and state models for the landing page and dashboard UI. All types are TypeScript interfaces with strict null safety.

## 1. UI State Models

### 1.1 Sidebar State

**Purpose**: Manage collapsible sidebar navigation state across the dashboard

```typescript
interface SidebarState {
  /** Whether the sidebar is collapsed (icons only) */
  collapsed: boolean

  /** Toggle the collapsed state */
  toggle: () => void

  /** Set collapsed state explicitly */
  setCollapsed: (collapsed: boolean) => void
}
```

**Storage**: Persisted in localStorage with key `sidebar-storage`

**Validation Rules**:
- `collapsed` must be boolean (default: `false`)
- State must survive page refreshes
- State must be consistent across all dashboard pages

**State Transitions**:
```
[collapsed: false] --toggle()--> [collapsed: true]
[collapsed: true]  --toggle()--> [collapsed: false]
[collapsed: *]     --setCollapsed(value)--> [collapsed: value]
```

### 1.2 Navigation State

**Purpose**: Track active route for visual highlighting

```typescript
interface NavigationState {
  /** Current active route path */
  activePath: string

  /** Whether mobile menu is open */
  mobileMenuOpen: boolean

  /** Set active path (usually derived from URL) */
  setActivePath: (path: string) => void

  /** Toggle mobile menu */
  toggleMobileMenu: () => void
}
```

**Storage**: Ephemeral (component state only, derived from Next.js router)

**Validation Rules**:
- `activePath` must be valid route string starting with `/`
- `mobileMenuOpen` defaults to `false`
- Mobile menu closes on route change

### 1.3 Session Context (from Better Auth)

**Purpose**: User session data for authenticated routes

```typescript
interface SessionContext {
  /** Authenticated user data */
  user: User | null

  /** Session object */
  session: Session | null

  /** Loading state */
  isLoading: boolean

  /** Whether user is authenticated */
  isAuthenticated: boolean
}

interface User {
  id: number
  email: string
  username: string
  is_active: boolean
  created_at: string
}

interface Session {
  id: string
  userId: number
  expiresAt: string
  token: string
}
```

**Storage**: Server-side session cookie (Better Auth managed)

**Validation Rules**:
- `user` is `null` when unauthenticated
- `session` is `null` when unauthenticated
- `isLoading` is `true` during initial session check
- `isAuthenticated` is derived from `!!session`

## 2. Component Interfaces

### 2.1 Landing Page Components

#### Hero Component

```typescript
interface HeroProps {
  /** Main headline text */
  title: string

  /** Subtitle/description */
  subtitle: string

  /** Primary CTA button text */
  primaryCta: {
    text: string
    href: string
  }

  /** Secondary CTA button text */
  secondaryCta: {
    text: string
    href: string
  }

  /** Optional background image */
  backgroundImage?: string
}
```

**Example**:
```typescript
<Hero
  title="Execute Tasks. Zero Latency."
  subtitle="The precision tool for the modern operator. Absolute clarity for your daily objectives."
  primaryCta={{ text: "Get Started", href: "/register" }}
  secondaryCta={{ text: "View Demo", href: "#demo" }}
  backgroundImage="/images/hero-bg.jpg"
/>
```

**Validation**:
- `title` required, 10-100 characters
- `subtitle` required, 20-300 characters
- `primaryCta.href` must be valid URL or route
- `backgroundImage` optional, must be valid image path

#### Feature Card Component

```typescript
interface FeatureCardProps {
  /** Feature icon (Material Symbol name) */
  icon: string

  /** Feature title */
  title: string

  /** Feature description */
  description: string

  /** Optional link to learn more */
  href?: string

  /** Custom className for styling overrides */
  className?: string
}
```

**Example**:
```typescript
<FeatureCard
  icon="visibility_off"
  title="Focus_Mode"
  description="Distraction-free UI environment engineered for deep work sessions."
  className="hover:border-primary"
/>
```

**Validation**:
- `icon` must be valid Material Symbol name
- `title` required, 5-50 characters
- `description` required, 20-200 characters
- `href` optional, must be valid URL if provided

#### Features Grid Component

```typescript
interface FeaturesGridProps {
  /** Array of features to display */
  features: Array<{
    icon: string
    title: string
    description: string
    href?: string
  }>

  /** Grid columns (responsive) */
  columns?: {
    mobile: 1
    tablet: 2
    desktop: 3
  }

  /** Custom className */
  className?: string
}
```

**Example**:
```typescript
<FeaturesGrid
  features={[
    { icon: "visibility_off", title: "Focus Mode", description: "..." },
    { icon: "terminal", title: "Keyboard First", description: "..." },
    { icon: "lock", title: "Encrypted Sync", description: "..." },
  ]}
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
/>
```

**Validation**:
- `features` array must have 1-12 items
- Each feature validated per FeatureCardProps
- `columns` optional, defaults shown above

#### CTA Section Component

```typescript
interface CTASectionProps {
  /** Section headline */
  headline: string

  /** Section description */
  description: string

  /** CTA button config */
  cta: {
    text: string
    href: string
    variant?: 'primary' | 'secondary'
  }

  /** Optional email capture form */
  emailCapture?: boolean

  /** Custom className */
  className?: string
}
```

**Example**:
```typescript
<CTASection
  headline="Ready to Execute?"
  description="Join the elite operators using our protocol to dominate their workflow."
  cta={{ text: "Get Started", href: "/register", variant: "primary" }}
  emailCapture={true}
/>
```

### 2.2 Dashboard Components

#### Sidebar Component

```typescript
interface SidebarProps {
  /** Navigation items */
  items: SidebarNavItem[]

  /** Current user (for profile display) */
  user: User

  /** Collapsed state (controlled) */
  collapsed?: boolean

  /** Collapse toggle handler */
  onToggle?: () => void

  /** Custom className */
  className?: string
}

interface SidebarNavItem {
  /** Display label */
  label: string

  /** Material Symbol icon name */
  icon: string

  /** Route href */
  href: string

  /** Whether item is active */
  active?: boolean

  /** Badge count (e.g., notifications) */
  badge?: number
}
```

**Example**:
```typescript
<Sidebar
  items={[
    { label: "Overview", icon: "dashboard", href: "/dashboard", active: true },
    { label: "Todos", icon: "task", href: "/dashboard/todos", badge: 5 },
    { label: "Settings", icon: "settings", href: "/dashboard/settings" },
  ]}
  user={{ id: 1, email: "user@example.com", username: "user", is_active: true, created_at: "2026-01-01" }}
  collapsed={false}
  onToggle={() => console.log("Toggle sidebar")}
/>
```

**Validation**:
- `items` array required, 2-10 items
- Each item must have valid icon and href
- `user` required, validated User interface
- `collapsed` optional, defaults to false
- Only one item can have `active: true`

#### Sidebar Nav Component

```typescript
interface SidebarNavProps {
  /** Navigation items */
  items: SidebarNavItem[]

  /** Whether sidebar is collapsed */
  collapsed: boolean

  /** Custom className */
  className?: string
}
```

**Server Component** - Renders navigation items without state

#### Top Nav Component

```typescript
interface TopNavProps {
  /** Page title */
  title: string

  /** User data for profile dropdown */
  user: User

  /** Optional search functionality */
  showSearch?: boolean

  /** Optional notifications */
  notifications?: Notification[]

  /** Custom className */
  className?: string
}

interface Notification {
  id: string
  message: string
  timestamp: string
  read: boolean
  href?: string
}
```

**Example**:
```typescript
<TopNav
  title="Dashboard"
  user={{ id: 1, email: "user@example.com", username: "user", is_active: true, created_at: "2026-01-01" }}
  showSearch={true}
  notifications={[
    { id: "1", message: "New todo added", timestamp: "2026-01-02T10:00:00Z", read: false },
  ]}
/>
```

#### Dashboard Shell Component

```typescript
interface DashboardShellProps {
  /** Page title */
  title: string

  /** Page description */
  description?: string

  /** Child content */
  children: React.ReactNode

  /** Custom className */
  className?: string
}
```

**Example**:
```typescript
<DashboardShell
  title="My Todos"
  description="Manage your tasks efficiently"
>
  <TodoList />
</DashboardShell>
```

### 2.3 Shared Components

#### Header Component

```typescript
interface HeaderProps {
  /** Navigation items */
  navItems: NavItem[]

  /** User session (null if unauthenticated) */
  user?: User | null

  /** Whether to show login/signup buttons */
  showAuth?: boolean

  /** Custom className */
  className?: string
}

interface NavItem {
  label: string
  href: string
  active?: boolean
}
```

**Example**:
```typescript
<Header
  navItems={[
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Docs", href: "/docs" },
  ]}
  user={null}
  showAuth={true}
/>
```

#### Footer Component

```typescript
interface FooterProps {
  /** Footer sections */
  sections: FooterSection[]

  /** Copyright text */
  copyright: string

  /** Custom className */
  className?: string
}

interface FooterSection {
  title: string
  links: Array<{
    label: string
    href: string
  }>
}
```

**Example**:
```typescript
<Footer
  sections={[
    {
      title: "Platform",
      links: [
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/#pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ]}
  copyright="© 2026 Todo App. All rights reserved."
/>
```

#### Error Boundary Component

```typescript
interface ErrorBoundaryProps {
  /** Child content to protect */
  children: React.ReactNode

  /** Optional fallback UI */
  fallback?: React.ReactNode

  /** Error callback */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}
```

**Example**:
```typescript
<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={(error) => console.error("Caught error:", error)}
>
  <DashboardContent />
</ErrorBoundary>
```

## 3. Form Models

### 3.1 Email Capture Form (Landing Page)

```typescript
interface EmailCaptureFormData {
  email: string
}

// Zod schema
const emailCaptureSchema = z.object({
  email: z.string().email("Invalid email address").min(5).max(100),
})
```

**Validation**:
- `email` must be valid email format
- 5-100 characters
- Required field

## 4. Design Token Models

### 4.1 Theme Configuration

```typescript
interface ThemeConfig {
  colors: {
    primary: string
    obsidian: string
    charcoal: string
    border: {
      subtle: string
      sharp: string
    }
    text: {
      primary: string
      secondary: string
      muted: string
    }
  }
  fonts: {
    display: string
    mono: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  breakpoints: {
    mobile: string
    tablet: string
    desktop: string
  }
}
```

**Constants** (lib/constants.ts):
```typescript
export const THEME = {
  colors: {
    primary: '#f4252f',
    obsidian: '#050505',
    charcoal: '#121212',
    border: {
      subtle: '#2a2a2a',
      sharp: '#444444',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
      muted: '#6b7280',
    },
  },
  fonts: {
    display: 'Space Grotesk, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  breakpoints: {
    mobile: '375px',
    tablet: '768px',
    desktop: '1024px',
  },
} as const
```

## 5. Route Models

### 5.1 Public Routes

```typescript
type PublicRoute = '/' | '/login' | '/register' | '/about' | '/contact'
```

### 5.2 Protected Routes (Dashboard)

```typescript
type ProtectedRoute =
  | '/dashboard'
  | '/dashboard/todos'
  | '/dashboard/todos/[id]'
  | '/dashboard/settings'
  | '/dashboard/profile'
```

### 5.3 Route Configuration

```typescript
interface RouteConfig {
  path: string
  label: string
  icon?: string
  protected: boolean
  layout?: 'default' | 'dashboard' | 'auth'
}

export const ROUTES: Record<string, RouteConfig> = {
  HOME: { path: '/', label: 'Home', protected: false, layout: 'default' },
  DASHBOARD: { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', protected: true, layout: 'dashboard' },
  TODOS: { path: '/dashboard/todos', label: 'Todos', icon: 'task', protected: true, layout: 'dashboard' },
  SETTINGS: { path: '/dashboard/settings', label: 'Settings', icon: 'settings', protected: true, layout: 'dashboard' },
  LOGIN: { path: '/login', label: 'Login', protected: false, layout: 'auth' },
  REGISTER: { path: '/register', label: 'Sign Up', protected: false, layout: 'auth' },
}
```

## 6. Responsive Behavior Models

### 6.1 Breakpoint Utilities

```typescript
interface ResponsiveValue<T> {
  mobile: T
  tablet: T
  desktop: T
}

// Example usage:
const gridColumns: ResponsiveValue<number> = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
}
```

### 6.2 Sidebar Responsive States

```typescript
type SidebarDisplay = 'hidden' | 'icon-only' | 'full'

interface SidebarResponsive {
  mobile: SidebarDisplay    // 'hidden' (overlay when open)
  tablet: SidebarDisplay    // 'icon-only'
  desktop: SidebarDisplay   // 'full' or 'icon-only' (based on collapsed)
}
```

## 7. Type Safety Guarantees

### 7.1 Strict TypeScript Config

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 7.2 Component Prop Validation

All components use TypeScript interfaces for props. No `PropTypes` or `any` types allowed.

**Example**:
```typescript
// ✅ Good
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant: 'primary' | 'secondary'
}

export function Button({ children, onClick, variant }: ButtonProps) {
  // ...
}

// ❌ Bad
export function Button({ children, onClick, variant }: any) {
  // ...
}
```

## 8. Data Flow Patterns

### 8.1 Props-Down Pattern

```
┌─────────────────┐
│  Server: Page   │ (fetches session data)
└────────┬────────┘
         │ props
         ▼
┌─────────────────┐
│ Server: Layout  │ (passes data to children)
└────────┬────────┘
         │ props
         ▼
┌─────────────────┐
│ Client: Sidebar │ (manages UI state)
└────────┬────────┘
         │ props
         ▼
┌─────────────────┐
│ Server: NavItem │ (renders with data)
└─────────────────┘
```

### 8.2 State-Up Pattern

```
┌─────────────────┐
│ User clicks nav │
└────────┬────────┘
         │ event
         ▼
┌─────────────────┐
│ Sidebar (state) │ (updates collapsed state)
└────────┬────────┘
         │ re-render
         ▼
┌─────────────────┐
│ SidebarNav      │ (reflects new state)
└─────────────────┘
```

## 9. Performance Considerations

### 9.1 Component Memoization

Only Client Components with expensive renders should use memoization:

```typescript
import { memo } from 'react'

export const FeatureCard = memo(function FeatureCard({ icon, title, description }: FeatureCardProps) {
  // Only re-renders when props change
})
```

**When to use**:
- Large lists (e.g., 50+ feature cards)
- Components with expensive calculations
- Components that re-render frequently

**When NOT to use**:
- Server Components (no memo needed)
- Simple components (overhead > benefit)
- Components that always re-render (props always change)

### 9.2 Lazy Loading

Dynamic imports for heavy components:

```typescript
import dynamic from 'next/dynamic'

const Dashboard = dynamic(() => import('@/components/dashboard/Dashboard'), {
  loading: () => <DashboardSkeleton />,
  ssr: false, // Client-only rendering if needed
})
```

---

**Status**: ✅ Complete
**Next**: Generate TypeScript interfaces in contracts/interfaces.ts
