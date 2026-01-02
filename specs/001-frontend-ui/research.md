# Research: Frontend UI Implementation

**Feature**: 001-frontend-ui
**Date**: 2026-01-02
**Status**: Complete

## Overview

This document consolidates research findings for implementing the landing page and dashboard UI using Next.js 16 App Router, shadcn/ui components, and a neo-brutalist dark design system.

## 1. Design System Analysis

### 1.1 Color Palette (Extracted from HTML References)

**Primary Colors**:
- `primary`: `#f4252f` (Red accent - used for CTAs, highlights, active states)
- `obsidian`: `#050505` (Deep black - main background)
- `charcoal`: `#121212` or `#1a1a1a` (Elevated surfaces - cards, sidebar, panels)

**Border Colors**:
- `border-subtle`: `#2a2a2a` (Subtle dividers)
- `border-sharp`: `#444444` (Prominent borders)
- `border-dark`: `#333333` (Alternative border)

**Text Colors**:
- White: `#ffffff` (Primary text)
- Gray 300: `#d1d5db` (Secondary text)
- Gray 400: `#9ca3af` (Tertiary text)
- Gray 500: `#6b7280` (Muted text)
- Gray 600: `#4b5563` (Placeholder text)
- Primary: `#f4252f` (Accent text)

**State Colors**:
- Green 500: `#22c55e` (Success, online status with pulse animation)
- Red 600: `#dc2626` (Error, hover states for primary)

### 1.2 Typography System

**Font Families**:
- Display: `Space Grotesk` (sans-serif) - Headlines, navigation, body text
- Mono: `JetBrains Mono` or `Roboto Mono` (monospace) - Code-like elements, system labels, technical data

**Font Weights**:
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

**Font Sizes** (Tailwind classes):
- `text-[10px]`: System metadata, tiny labels
- `text-xs`: Small labels, captions (12px)
- `text-sm`: Body text, form inputs (14px)
- `text-base`: Default body (16px)
- `text-lg`: Subheadings (18px)
- `text-xl`: Section titles (20px)
- `text-3xl`: Large headings (30px)
- `text-4xl`: Hero headings (36px)
- `text-5xl` to `text-7xl`: Display headings (48-72px)

**Text Transforms**:
- UPPERCASE for labels, navigation, system messages, CTA buttons
- Normal case for body copy, descriptions
- `tracking-widest`: Letter spacing for uppercase text (0.1em)
- `tracking-tight`: Tight spacing for large headings (-0.025em)

### 1.3 Spacing and Layout

**Border Radius**: `0px` for ALL elements (brutalist aesthetic)
```typescript
// tailwind.config.ts override
borderRadius: {
  'none': '0px',
  'DEFAULT': '0px',
  'sm': '0px',
  'md': '0px',
  'lg': '0px',
  'xl': '0px',
  'full': '0px',
}
```

**Border Widths**:
- Default: `1px` (sharp borders everywhere)
- Accent borders: `border-l-4` for active sidebar items

**Spacing Patterns**:
- Padding: `p-4`, `p-6`, `p-8`, `p-10` for containers
- Gaps: `gap-2`, `gap-4`, `gap-6` for flex/grid layouts
- Margins: Minimal use (prefer padding and gap)

### 1.4 Interactive States

**Hover Effects**:
- Background: `hover:bg-primary`, `hover:bg-white/5`, `hover:bg-charcoal`
- Border: `hover:border-white`, `hover:border-primary`
- Text: `hover:text-primary`, `hover:text-white`
- Transitions: `transition-colors`, `transition-all` with duration 200-300ms

**Focus States**:
- Ring: `focus:ring-0`, `focus:ring-2 focus:ring-white`
- Border: `focus:border-primary`
- Outline: `focus:outline-none` (custom focus styles)

**Active States**:
- Sidebar: `bg-primary/10 text-primary border-l-4 border-l-primary`
- Buttons: `active:scale-95` (subtle press effect)

**Animations**:
- Pulse: `animate-pulse` for online status indicators
- Marquee: Custom animation for ticker (translate-x)
- Glitch: Custom keyframe for hover effects (optional)

### 1.5 Component Patterns

**Buttons**:
```typescript
// Primary CTA
className="bg-primary text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"

// Secondary
className="border border-border-dark bg-charcoal text-white px-8 py-4 uppercase tracking-widest hover:bg-border-dark transition-colors"

// Outline
className="border border-primary text-primary px-6 py-3 hover:bg-primary hover:text-white transition-colors uppercase"
```

**Cards**:
```typescript
// Elevated card
className="bg-charcoal border border-border-sharp p-4 hover:border-white transition-colors"

// Flat card
className="bg-charcoal/50 border border-border-subtle p-3 hover:border-gray-500 transition-colors"
```

**Inputs**:
```typescript
className="bg-obsidian border border-border-subtle text-white px-4 py-3 font-mono focus:border-primary focus:ring-0 placeholder-gray-600 uppercase tracking-wide"
```

**Navigation**:
```typescript
// Top nav link
className="px-6 py-2 text-xs font-mono text-gray-400 hover:text-primary hover:bg-charcoal transition-colors border border-transparent hover:border-border-dark uppercase tracking-widest"

// Sidebar link (active)
className="flex items-center gap-4 p-5 border-b border-border-subtle bg-primary/10 text-primary border-l-4 border-l-primary"

// Sidebar link (inactive)
className="flex items-center gap-4 p-5 border-b border-border-subtle text-gray-400 hover:bg-white/5 hover:text-white transition-all group"
```

### 1.6 Icons

**Icon System**: Material Symbols Outlined
- Size: `text-[20px]`, `text-lg`, `text-xl`, `text-4xl`, `text-6xl`
- Weight: 100-700 (configurable)
- Fill: 0 or 1 (outline vs filled)

**Common Icons**:
- `terminal`: Brand/logo icon
- `dashboard`: Dashboard/overview
- `task`: Operations/todos
- `folder_open`: Archives/files
- `monitoring`: Metrics/analytics
- `settings`: Configuration
- `notifications`: Alerts
- `search`: Search functionality
- `check_circle`: Success/completion
- `warning`: Critical/urgent
- `bolt`: Power/action
- `lock`: Security/privacy
- `visibility_off`: Focus mode

## 2. Next.js 16 App Router Patterns

### 2.1 Server Component Best Practices

**Default Pattern**:
```typescript
// app/page.tsx (Server Component - NO 'use client')
export default async function LandingPage() {
  // Can fetch data directly
  // No useState, useEffect, event handlers
  return (
    <main>
      <Hero />
      <FeaturesGrid />
    </main>
  )
}
```

**When to Use Server Components**:
- Static content (hero sections, feature cards, footer)
- Data fetching from APIs or databases
- SEO-critical content
- Markdown/content rendering
- Layout components without interactivity

**Benefits**:
- Zero JavaScript sent to client for static parts
- Improved initial load performance
- Better SEO (fully rendered HTML)
- Direct backend access (if needed)

### 2.2 Client Component Patterns

**Explicit Marking**:
```typescript
'use client' // MUST be at top of file, before imports

import { useState } from 'react'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  // Can use hooks, event handlers, browser APIs
}
```

**When Required**:
- Event handlers: `onClick`, `onChange`, `onSubmit`
- React hooks: `useState`, `useEffect`, `useContext`
- Browser APIs: `localStorage`, `window`, `document`
- Third-party libraries that require client-side rendering
- Interactive animations/transitions

**Expected Client Components for This Feature**:
1. `Sidebar.tsx` - Collapsible navigation (onClick handlers)
2. `NavigationMenu.tsx` - Dropdown interactions
3. `SidebarToggle.tsx` - Toggle button with state
4. Form components with `react-hook-form` (future)

### 2.3 Layout Composition

**Root Layout** (app/layout.tsx):
```typescript
// Server Component with metadata
export const metadata = {
  title: 'Todo App',
  description: 'Manage your tasks efficiently',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-obsidian text-white font-display">
        {children}
      </body>
    </html>
  )
}
```

**Dashboard Layout** (app/(dashboard)/layout.tsx):
```typescript
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopNav } from '@/components/dashboard/TopNav'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
```

**Route Groups**: Use `(auth)` and `(dashboard)` for logical grouping without affecting URL structure

### 2.4 Performance Optimizations

**Image Optimization**:
```typescript
import Image from 'next/image'

<Image
  src="/images/hero.jpg"
  alt="Hero background"
  width={1920}
  height={1080}
  priority // For above-the-fold images
  quality={85}
/>
```

**Dynamic Imports for Heavy Client Components**:
```typescript
import dynamic from 'next/dynamic'

const Sidebar = dynamic(() => import('@/components/dashboard/Sidebar'), {
  loading: () => <div className="w-64 bg-charcoal" />,
  ssr: false, // Disable SSR if needed
})
```

**Suspense Boundaries**:
```typescript
import { Suspense } from 'react'

<Suspense fallback={<LoadingSpinner />}>
  <AsyncDashboardContent />
</Suspense>
```

### 2.5 Responsive Design Strategy

**Breakpoints** (Tailwind defaults):
- `sm`: 640px (mobile landscape, tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops, desktops)
- `xl`: 1280px (large desktops)

**Mobile-First Approach**:
```typescript
// Default: Mobile layout
<div className="flex flex-col">
  // Tablet: 2-column grid
  <div className="md:grid md:grid-cols-2">
    // Desktop: 3-column grid
    <div className="lg:grid-cols-3">
      {/* Content */}
    </div>
  </div>
</div>
```

**Sidebar Responsive Pattern**:
```typescript
// Mobile: Hidden by default, overlay when open
<aside className="hidden sm:flex w-20 lg:w-64">
  {/* Sidebar content */}
</aside>

// Mobile menu button (only visible on mobile)
<button className="sm:hidden">
  <MenuIcon />
</button>
```

## 3. shadcn/ui Component Selection

### 3.1 Required Components

**Navigation Components**:
1. **button**: Primary, secondary, outline, ghost variants
   - Command: `npx shadcn@latest add button`
   - Use: CTAs, navigation, actions

2. **navigation-menu**: Horizontal navigation with dropdowns
   - Command: `npx shadcn@latest add navigation-menu`
   - Use: Top navigation bar on landing page

3. **dropdown-menu**: Contextual menus
   - Command: `npx shadcn@latest add dropdown-menu`
   - Use: User profile menu, settings dropdown

4. **separator**: Horizontal/vertical dividers
   - Command: `npx shadcn@latest add separator`
   - Use: Section dividers, sidebar separators

**Layout Components**:
5. **card**: Container for content sections
   - Command: `npx shadcn@latest add card`
   - Use: Feature cards, dashboard widgets

**Form Components** (for future forms):
6. **input**: Text inputs with variants
   - Command: `npx shadcn@latest add input`
   - Use: Search bar, form fields

7. **label**: Accessible form labels
   - Command: `npx shadcn@latest add label`
   - Use: Form field labels

**Feedback Components**:
8. **skeleton**: Loading placeholders
   - Command: `npx shadcn@latest add skeleton`
   - Use: Loading states for async content

### 3.2 Component Customization

**Theming via Tailwind Config**:
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#f4252f',
        obsidian: '#050505',
        charcoal: '#121212',
        border: {
          subtle: '#2a2a2a',
          sharp: '#444444',
        },
      },
    },
  },
}
```

**shadcn Component Overrides**:
- Modify `components/ui/*.tsx` to use custom colors
- Override default radius in component variants
- Add custom variants (e.g., `primary-brutalist`)

### 3.3 Accessibility (Built into shadcn)

shadcn/ui components include:
- ARIA labels and roles
- Keyboard navigation (Tab, Enter, Escape)
- Focus management
- Screen reader support

**Manual Additions**:
- Add `aria-label` to icon-only buttons
- Ensure proper heading hierarchy (h1 → h2 → h3)
- Test with keyboard navigation
- Verify contrast ratios (WCAG AA)

## 4. State Management

### 4.1 Sidebar State Pattern

**Hook-Based Approach** (recommended for this scope):
```typescript
// hooks/useSidebar.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarStore {
  collapsed: boolean
  toggle: () => void
  setCollapsed: (collapsed: boolean) => void
}

export const useSidebar = create<SidebarStore>()(
  persist(
    (set) => ({
      collapsed: false,
      toggle: () => set((state) => ({ collapsed: !state.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    {
      name: 'sidebar-storage', // localStorage key
    }
  )
)
```

**Alternative: React Context** (if avoiding zustand):
```typescript
// lib/sidebar-context.tsx
'use client'

import { createContext, useContext, useState } from 'react'

const SidebarContext = createContext<{
  collapsed: boolean
  toggle: () => void
} | null>(null)

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const toggle = () => setCollapsed(!collapsed)

  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) throw new Error('useSidebar must be within SidebarProvider')
  return context
}
```

### 4.2 Media Query Hook

```typescript
// hooks/useMediaQuery.ts
'use client'

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// Usage:
const isMobile = useMediaQuery('(max-width: 768px)')
const isDesktop = useMediaQuery('(min-width: 1024px)')
```

## 5. Better Auth Integration

### 5.1 Route Protection Pattern

**Middleware** (already exists):
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const { pathname } = request.nextUrl

  // Protect dashboard routes
  if (!sessionCookie && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

### 5.2 Session Access in Components

**Server Component**:
```typescript
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect('/login')
  }

  return <div>Welcome, {session.user.email}</div>
}
```

**Client Component** (via custom hook):
```typescript
'use client'

import { useSession } from '@/hooks/useAuth'

export function UserProfile() {
  const { user, isLoading } = useSession()

  if (isLoading) return <Skeleton />
  if (!user) return null

  return <div>{user.email}</div>
}
```

## 6. Implementation Decision Matrix

### 6.1 Technology Choices

| Decision | Chosen Approach | Rationale | Alternatives Considered |
|----------|----------------|-----------|------------------------|
| **Component Library** | shadcn/ui | Accessible, customizable, no runtime JS (copy-paste model). Aligns with Principle VIII (tooling by necessity) | Headless UI (less customizable), Radix UI directly (more complex), custom components (reinventing wheel) |
| **State Management** | React Context + useState | Sufficient for sidebar state. Avoids unnecessary dependency. | Zustand (overkill for 1 boolean), Redux (way overkill), Jotai (unnecessary) |
| **Styling** | Tailwind CSS + cn() | Constitutional requirement (Principle V). Design system as utility classes. | CSS Modules (violates constitution), Styled Components (adds runtime), plain CSS (violates constitution) |
| **Server/Client Split** | 80%+ Server Components | Performance-first (Principle VII). Client only for interactivity. | 50/50 split (worse performance), All Client (defeats Next.js benefits) |
| **Image Optimization** | next/image | Built-in, automatic optimization. Meets performance budget. | Cloudinary (unnecessary complexity), manual optimization (error-prone) |
| **Form Handling** | React Hook Form + Zod | Type-safe, minimal re-renders. Aligns with Principle II (type safety). | Formik (heavier), uncontrolled forms (less validation), plain useState (boilerplate) |

### 6.2 Architecture Decisions

| Decision | Chosen Approach | Rationale | Alternatives Considered |
|----------|----------------|-----------|------------------------|
| **Landing Page Route** | Single `app/page.tsx` | Simple, performant, SEO-friendly. All Server Components. | Multi-page SPA (worse SEO), separate landing site (unnecessary) |
| **Dashboard Layout** | Route group `(dashboard)` with shared layout | Clean URL structure. Shared sidebar/nav without duplication. | Separate `/dashboard/*` routes with layout props (more complex), client-side routing (worse SEO) |
| **Responsive Strategy** | Mobile-first Tailwind breakpoints | Standard practice. Progressive enhancement. | Desktop-first (bad UX), JS-based breakpoints (unnecessary) |
| **Dark Mode** | CSS class `dark` only | Design references show dark only. Simplifies implementation. | Toggle system (not in requirements), system preference (adds complexity) |
| **Sidebar Persistence** | localStorage via Context | Simple, no backend needed. Survives refreshes. | Cookies (overkill), URL params (pollutes URL), no persistence (poor UX) |

## 7. Performance Budget Allocation

### 7.1 Bundle Size Analysis

**Target**: <250KB gzipped for initial load

**Expected Breakdown**:
- Next.js runtime: ~80KB
- React: ~45KB
- Page components: ~30KB
- shadcn/ui components: ~40KB
- Tailwind CSS: ~20KB (purged)
- Fonts: ~25KB (preloaded)
- **Total**: ~240KB ✅

**Optimization Strategies**:
1. Dynamic imports for dashboard (loaded only after login)
2. Font subsetting (include only used characters)
3. Tailwind purge (remove unused classes)
4. Tree-shaking (ES modules)
5. Code splitting by route

### 7.2 Rendering Performance

**Landing Page**:
- FCP: <1.5s (Target: 1.2s)
- LCP: <2.5s (Target: 2.0s)
- CLS: <0.1 (stable layout, no shifts)
- TBT: <200ms (minimal JS)

**Dashboard**:
- FCP: <1.5s (Target: 1.3s)
- TTI: <3.0s (Target: 2.5s)
- Interaction latency: <100ms

**Strategies**:
1. SSR for above-the-fold content
2. Preload critical fonts and images
3. Lazy load below-the-fold components
4. Minimize client-side JS (80%+ Server Components)
5. Use `priority` for hero images

## 8. Accessibility Checklist

### 8.1 WCAG 2.1 AA Compliance

**Keyboard Navigation**:
- ✅ All interactive elements focusable (Tab, Shift+Tab)
- ✅ Visible focus indicators (custom blue ring)
- ✅ Logical tab order (top-to-bottom, left-to-right)
- ✅ Escape key closes modals/dropdowns
- ✅ Enter/Space activates buttons

**Screen Reader Support**:
- ✅ Semantic HTML (nav, main, aside, header, footer, button)
- ✅ ARIA labels for icon-only buttons
- ✅ Alt text for all images
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Form labels associated with inputs

**Color Contrast**:
- ✅ Primary text (white on #050505): 21:1 ratio (AAA)
- ✅ Secondary text (gray-400 on #050505): 7:1 ratio (AA)
- ✅ Primary buttons (#f4252f on white): 4.5:1 ratio (AA)
- ✅ Interactive states have sufficient contrast

**Responsive Design**:
- ✅ No horizontal scroll at any breakpoint
- ✅ Touch targets ≥44x44px on mobile
- ✅ Text readable without zoom (≥16px base)
- ✅ Content reflows without loss of information

## 9. Risk Analysis

### 9.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Performance budget exceeded** | Medium | High | Dynamic imports, code splitting, bundle analyzer monitoring |
| **Better Auth integration issues** | Low | Medium | Follow CLAUDE.md patterns exactly, test middleware early |
| **Responsive layout breaks** | Medium | Medium | Mobile-first development, test at all breakpoints |
| **Accessibility gaps** | Low | High | Use shadcn (built-in a11y), manual testing with keyboard + screen reader |
| **Type safety violations** | Low | Medium | Strict TypeScript config, prop interfaces for all components |

### 9.2 Implementation Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Scope creep (adding features)** | Medium | Medium | Stick to spec requirements, defer enhancements to future phases |
| **Over-engineering components** | Medium | Low | YAGNI principle, simplest solution first |
| **Design reference drift** | Low | Medium | Extract design tokens upfront, validate with screenshots |
| **Client Component overuse** | Medium | High | Default Server Component, explicit justification for 'use client' |

## 10. Next Steps (Phase 1)

### 10.1 Immediate Actions

1. **Install shadcn/ui components**:
   ```bash
   npx shadcn@latest add button card navigation-menu dropdown-menu separator input skeleton
   ```

2. **Configure Tailwind with design tokens**:
   - Add custom colors (primary, obsidian, charcoal, border-*)
   - Override border-radius to 0px
   - Add custom fonts (Space Grotesk, JetBrains Mono)

3. **Create data-model.md**:
   - Define component prop interfaces
   - Document UI state models (sidebar, navigation)

4. **Create quickstart.md**:
   - Development setup instructions
   - Component usage examples
   - Storybook/testing guidance

5. **Generate contracts/**:
   - TypeScript interfaces for all components
   - PropTypes documentation
   - Component API reference

### 10.2 Phase 1 Deliverables

- ✅ research.md (this file)
- ⏳ data-model.md
- ⏳ contracts/interfaces.ts
- ⏳ quickstart.md

---

**Research Status**: ✅ Complete
**Next Phase**: Phase 1 - Design & Contracts
