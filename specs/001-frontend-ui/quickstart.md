# Quickstart Guide: Frontend UI Implementation

**Feature**: 001-frontend-ui
**Date**: 2026-01-02
**Status**: Complete

## Overview

This guide provides step-by-step instructions for setting up the development environment and implementing the landing page and dashboard UI.

## Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher (or pnpm/yarn)
- **Git**: Latest version
- **Code Editor**: VS Code (recommended) with ESLint and Prettier extensions

## 1. Environment Setup

### 1.1 Clone and Navigate to Frontend

```bash
cd D:\GIAIC\Hackathon\Hackathon2.0\Phase2\frontend
```

### 1.2 Install Dependencies

```bash
npm install
# or
pnpm install
```

### 1.3 Verify Next.js Installation

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the Next.js default page.

## 2. Install shadcn/ui Components

### 2.1 Verify shadcn/ui Configuration

Check that `components.json` exists in the frontend directory. If not, initialize:

```bash
npx shadcn@latest init
```

**Configuration options**:
- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes

### 2.2 Install Required Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add navigation-menu
npx shadcn@latest add dropdown-menu
npx shadcn@latest add separator
npx shadcn@latest add input
npx shadcn@latest add skeleton
```

This will create component files in `components/ui/`.

## 3. Configure Design System

### 3.1 Update Tailwind Configuration

Edit `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f4252f',
        obsidian: '#050505',
        charcoal: {
          DEFAULT: '#121212',
          light: '#1a1a1a',
        },
        border: {
          subtle: '#2a2a2a',
          sharp: '#444444',
          dark: '#333333',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
        'DEFAULT': '0px',
        'sm': '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        'full': '0px',
      },
    },
  },
  plugins: [],
}

export default config
```

### 3.2 Update Global Styles

Edit `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-obsidian text-white font-display antialiased;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-track {
    background: #050505;
  }

  ::-webkit-scrollbar-thumb {
    background: #333;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #f4252f;
  }
}

@layer utilities {
  /* Grid background pattern */
  .bg-grid-pattern {
    background-image: linear-gradient(#1a1a1a 1px, transparent 1px),
                      linear-gradient(90deg, #1a1a1a 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* Sharp border utility */
  .sharp-border {
    border: 1px solid #2a2a2a;
  }
}
```

### 3.3 Create Constants File

Create `lib/constants.ts`:

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

export const ROUTES = {
  HOME: { path: '/', label: 'Home', protected: false, layout: 'default' as const },
  DASHBOARD: { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', protected: true, layout: 'dashboard' as const },
  TODOS: { path: '/dashboard/todos', label: 'Todos', icon: 'task', protected: true, layout: 'dashboard' as const },
  SETTINGS: { path: '/dashboard/settings', label: 'Settings', icon: 'settings', protected: true, layout: 'dashboard' as const },
  LOGIN: { path: '/login', label: 'Login', protected: false, layout: 'auth' as const },
  REGISTER: { path: '/register', label: 'Sign Up', protected: false, layout: 'auth' as const },
} as const
```

## 4. Create Custom Hooks

### 4.1 Sidebar State Hook

Create `hooks/useSidebar.ts`:

```typescript
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
      name: 'sidebar-storage',
    }
  )
)
```

**Note**: Install zustand if not already:
```bash
npm install zustand
```

### 4.2 Media Query Hook

Create `hooks/useMediaQuery.ts`:

```typescript
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
```

## 5. Component Development Workflow

### 5.1 Component Structure

Follow this pattern for all new components:

```
components/
├── landing/           # Landing page components
│   ├── Hero.tsx
│   ├── FeatureCard.tsx
│   └── ...
├── dashboard/         # Dashboard components
│   ├── Sidebar.tsx
│   ├── TopNav.tsx
│   └── ...
├── shared/            # Shared components
│   ├── Header.tsx
│   └── Footer.tsx
└── ui/                # shadcn/ui primitives
    ├── button.tsx
    └── ...
```

### 5.2 Example Component Template

**Server Component** (default):

```typescript
// components/landing/Hero.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroProps {
  title: string
  subtitle: string
  primaryCta: { text: string; href: string }
  secondaryCta: { text: string; href: string }
}

export function Hero({ title, subtitle, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section className="flex flex-col justify-center p-8 md:p-16 lg:p-24 min-h-[600px] border-b border-border-sharp">
      <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter mb-6 uppercase">
        {title}
      </h1>
      <p className="font-mono text-sm md:text-base text-gray-400 max-w-lg mb-10 leading-relaxed">
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default" className="uppercase tracking-widest">
          <Link href={primaryCta.href}>{primaryCta.text}</Link>
        </Button>
        <Button asChild variant="outline" className="uppercase tracking-widest font-mono">
          <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
        </Button>
      </div>
    </section>
  )
}
```

**Client Component** (when needed):

```typescript
'use client' // MUST be at top

import { useState } from 'react'

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`transition-all ${collapsed ? 'w-20' : 'w-64'}`}>
      <button onClick={() => setCollapsed(!collapsed)}>Toggle</button>
      {children}
    </aside>
  )
}
```

### 5.3 Import Aliases

Use Next.js import aliases:

```typescript
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/landing/Hero'
import { useSidebar } from '@/hooks/useSidebar'
import { THEME } from '@/lib/constants'
```

## 6. Development Commands

### 6.1 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
```

### 6.2 Add to package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  }
}
```

## 7. Testing Strategy

### 7.1 Component Testing (Future)

Install testing dependencies:

```bash
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

Example test:

```typescript
// components/landing/__tests__/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import { Hero } from '../Hero'

describe('Hero Component', () => {
  it('renders title and subtitle', () => {
    render(
      <Hero
        title="Test Title"
        subtitle="Test Subtitle"
        primaryCta={{ text: "CTA 1", href: "/cta1" }}
        secondaryCta={{ text: "CTA 2", href: "/cta2" }}
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })
})
```

### 7.2 E2E Testing (Future)

Install Playwright:

```bash
npm install -D @playwright/test
npx playwright install
```

Example E2E test:

```typescript
// tests/e2e/landing.spec.ts
import { test, expect } from '@playwright/test'

test('landing page loads and displays hero', async ({ page }) => {
  await page.goto('http://localhost:3000')

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('button', { name: /get started/i })).toBeVisible()
})
```

## 8. Debugging Tips

### 8.1 Common Issues

**Issue**: "Module not found" errors
- **Solution**: Check import paths use `@/` prefix
- **Solution**: Verify tsconfig.json has correct paths configuration

**Issue**: Styles not applying
- **Solution**: Check Tailwind content paths in tailwind.config.ts
- **Solution**: Restart dev server after config changes

**Issue**: Server/Client Component errors
- **Solution**: Verify `'use client'` directive at top of file (before imports)
- **Solution**: Check that Client Components don't import Server-only features

### 8.2 VS Code Extensions

Recommended extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Error Translator
- Better Comments

## 9. Implementation Checklist

### Phase 1: Setup ✅
- [x] Install dependencies
- [x] Configure Tailwind with design tokens
- [x] Install shadcn/ui components
- [x] Create custom hooks
- [x] Create constants file

### Phase 2: Landing Page (from tasks.md)
- [ ] Create Hero component
- [ ] Create FeatureCard component
- [ ] Create FeaturesGrid component
- [ ] Create CTASection component
- [ ] Create Header component
- [ ] Create Footer component
- [ ] Update app/page.tsx with landing page

### Phase 3: Dashboard (from tasks.md)
- [ ] Create Sidebar component
- [ ] Create SidebarNav component
- [ ] Create TopNav component
- [ ] Create DashboardShell component
- [ ] Create app/(dashboard)/layout.tsx
- [ ] Create app/(dashboard)/page.tsx

### Phase 4: Polish (from tasks.md)
- [ ] Test responsive behavior at all breakpoints
- [ ] Add loading states with Suspense
- [ ] Add error boundaries
- [ ] Verify WCAG AA accessibility
- [ ] Run Lighthouse performance audit
- [ ] Verify 80%+ Server Components

## 10. Resources

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Better Auth](https://better-auth.vercel.app)

### Design References
- Landing page: `frontend/design-reference/landing-page/`
- Dashboard: `frontend/design-reference/dashboard/`

### Project Documents
- Specification: `specs/001-frontend-ui/spec.md`
- Data Models: `specs/001-frontend-ui/data-model.md`
- Implementation Plan: `specs/001-frontend-ui/plan.md`
- Research: `specs/001-frontend-ui/research.md`

---

**Status**: ✅ Complete
**Next**: Execute implementation tasks from `/sp.tasks`
