# Implementation Plan: Frontend UI Development (Landing Page & Dashboard)

**Branch**: `001-frontend-ui` | **Date**: 2026-01-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-frontend-ui/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a modern, responsive frontend UI featuring a public landing page and authenticated dashboard for the Todo Web App. The landing page serves as the primary conversion funnel with hero section, feature highlights, and authentication CTAs. The dashboard provides an authenticated workspace with collapsible sidebar navigation for todo management. Both interfaces follow a neo-brutalist dark design aesthetic inspired by the provided design references, implemented using Next.js 16 App Router with Server Components as the default pattern, shadcn/ui primitives, and Tailwind CSS styling.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16.1.1 (App Router), React 19.2.3
**Primary Dependencies**:
- shadcn/ui (UI primitives - button, card, navigation-menu, dropdown-menu, input, separator)
- Tailwind CSS 4.x with PostCSS for styling
- Better Auth (authentication - session validation, route protection)
- Zod for client-side validation
- React Hook Form for form handling
- next/image for optimized image loading

**Storage**: Client-side state for UI preferences (sidebar collapsed/expanded state using localStorage or cookies)
**Testing**: React Testing Library for component testing, Playwright for E2E testing of user flows
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge) with responsive support for mobile (≥375px), tablet (768-1023px), and desktop (≥1024px)
**Project Type**: Web application (frontend only - this plan covers frontend/app directory)
**Performance Goals**:
- Landing page FCP <1.5s on desktop connections
- Bundle size <250KB gzipped for initial load
- Interactive elements respond within 100ms
- 80%+ Server Components (minimize 'use client' directives)

**Constraints**:
- Must integrate with existing Better Auth middleware for dashboard protection
- Must follow CLAUDE.md conventions (Server Components default, cn() utility, no custom CSS files)
- Zero border radius (brutalist aesthetic per design references)
- Dark mode only (no light mode toggle)
- Keyboard accessibility required (WCAG 2.1 AA compliance)

**Scale/Scope**:
- 2 primary pages (landing page at `/`, dashboard at `/dashboard`)
- ~15-20 reusable components (hero, feature card, sidebar, nav bar, etc.)
- 3 responsive breakpoints (mobile, tablet, desktop)
- Single feature branch implementation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I - Component-First Design
- **Compliance**: Each UI element (hero, feature card, sidebar nav, etc.) will be isolated as a reusable component with single responsibility
- **Validation**: Component tree will be reviewed to ensure no components handle multiple concerns

### ✅ Principle II - Type Safety by Default
- **Compliance**: All components will have explicit TypeScript prop interfaces. No `any` types. Zod schemas for form validation.
- **Validation**: TypeScript strict mode enabled, type checking passes before PR merge

### ✅ Principle III - Server-Client Clarity
- **Compliance**: Default to Server Components. Client Components only for interactive elements (sidebar toggle, form inputs, navigation dropdowns)
- **Validation**: 80%+ Server Components verified by counting `'use client'` directives
- **Expected Client Components**: SidebarToggle, NavigationMenu (dropdown), TodoForm inputs, LogoutButton

### ✅ Principle IV - Predictable Data Flow
- **Compliance**: Props-down pattern for all component data. UI state (sidebar collapsed) managed via custom hooks (useSidebar)
- **Validation**: No prop drilling beyond 2 levels; context used for deeply nested state if needed

### ✅ Principle V - Styling as a System
- **Compliance**: Tailwind CSS only. Design tokens extracted from HTML references and configured in tailwind.config.ts. shadcn/ui theming for component variants.
- **Validation**: Zero custom CSS files (except animations.css if needed). All styles via Tailwind utility classes and cn() merging

### ✅ Principle VI - API-First Design
- **Compliance**: This feature is UI-only. Authentication handled by Better Auth (existing). No new APIs created in this phase.
- **Validation**: N/A for UI-only feature (Future: API integration for todos will follow existing FastAPI contracts)

### ✅ Principle VII - Performance-Aware Rendering
- **Compliance**: Server Components for static content (hero, features, landing page). Suspense boundaries for async dashboard content. Dynamic imports for heavy Client Components.
- **Validation**: Lighthouse score ≥90 for performance. Bundle analyzer confirms <250KB gzipped.

### ✅ Principle VIII - Tooling by Necessity
- **Compliance**: shadcn/ui justified for accessible UI primitives. Better Auth for route protection. Zod + React Hook Form for forms. No unnecessary state management libraries (React context sufficient for sidebar state).
- **Validation**: Each dependency documented in this plan with clear justification

### ✅ Principle IX - Explicit Data Modeling
- **Compliance**: UI state (sidebar collapsed: boolean) and session state (user from Better Auth) are explicitly typed
- **Validation**: N/A for UI-only feature (no database models in this phase)

### ✅ Principle X - Deterministic Error Handling
- **Compliance**: Error boundaries for page sections. Fallback UI for failed image loads. Try-catch for async operations with user-visible error messages.
- **Validation**: Error boundaries at page level. No silent failures in user interactions.

**Gate Status**: ✅ **PASSED** - All principles compliant. No violations requiring complexity justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-ui/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (Next.js patterns, shadcn components, design tokens)
├── data-model.md        # Phase 1 output (UI state models, component interfaces)
├── quickstart.md        # Phase 1 output (dev setup, component usage guide)
├── contracts/           # Phase 1 output (component API contracts, prop interfaces)
│   ├── components.json  # shadcn/ui configuration
│   └── interfaces.ts    # TypeScript interfaces for components
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # Root layout (Server Component)
│   ├── page.tsx                     # Landing page (Server Component) - MODIFY
│   ├── globals.css                  # Tailwind base + design tokens - MODIFY
│   ├── (auth)/                      # Auth route group
│   │   ├── login/page.tsx           # Login page (existing)
│   │   └── register/page.tsx        # Register page (existing)
│   └── (dashboard)/                 # Dashboard route group - CREATE
│       ├── layout.tsx               # Dashboard layout with sidebar - CREATE
│       └── page.tsx                 # Dashboard home - CREATE
│
├── components/                       # React components
│   ├── ui/                          # shadcn/ui primitives - ADD COMPONENTS
│   │   ├── button.tsx               # Button component (from shadcn)
│   │   ├── card.tsx                 # Card component (from shadcn)
│   │   ├── input.tsx                # Input component (from shadcn)
│   │   ├── navigation-menu.tsx      # Navigation menu (from shadcn)
│   │   ├── dropdown-menu.tsx        # Dropdown menu (from shadcn)
│   │   └── separator.tsx            # Separator (from shadcn)
│   ├── landing/                     # Landing page components - CREATE
│   │   ├── Hero.tsx                 # Hero section (Server Component)
│   │   ├── FeatureCard.tsx          # Feature card (Server Component)
│   │   ├── FeaturesGrid.tsx         # Features grid container (Server Component)
│   │   └── CTASection.tsx           # Call-to-action section (Server Component)
│   ├── dashboard/                   # Dashboard components - CREATE
│   │   ├── Sidebar.tsx              # Sidebar navigation (Client Component)
│   │   ├── SidebarNav.tsx           # Sidebar nav items (Server Component)
│   │   ├── TopNav.tsx               # Top navigation bar (Server Component)
│   │   └── DashboardShell.tsx       # Dashboard container (Server Component)
│   └── shared/                      # Shared components
│       ├── Header.tsx               # Navigation header - MODIFY
│       ├── Footer.tsx               # Footer - CREATE
│       └── ErrorBoundary.tsx        # Error boundary (existing or CREATE)
│
├── hooks/                            # Custom React hooks - CREATE
│   ├── useSidebar.ts                # Sidebar state management hook
│   └── useMediaQuery.ts             # Responsive breakpoint hook
│
├── lib/                              # Utilities
│   ├── utils.ts                     # cn() utility (existing)
│   └── constants.ts                 # Design constants - CREATE
│
├── styles/                           # Additional styles (minimal)
│   └── animations.css               # CSS animations (if needed) - OPTIONAL
│
├── public/                           # Static assets
│   └── images/                      # Placeholder images, icons - ADD
│
├── tailwind.config.ts               # Tailwind configuration - MODIFY (add design tokens)
├── tsconfig.json                    # TypeScript config (existing)
├── next.config.ts                   # Next.js config (existing)
└── package.json                     # Dependencies - MODIFY (add shadcn components)
```

**Structure Decision**: Web application structure (Option 2). This plan focuses on the `frontend/` directory only. Backend integration (Better Auth session validation) is handled via existing middleware. No backend changes required in this phase.

**File Operations Summary**:
- **CREATE**: 20+ new files (dashboard layouts, landing components, hooks, shadcn components)
- **MODIFY**: 4 files (app/page.tsx, app/globals.css, tailwind.config.ts, package.json)
- **EXISTING**: Leverage existing Better Auth middleware, lib/utils.ts, auth pages

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected.** All principles pass compliance checks. No complexity justification required.

## Phase 0: Research (Complete ✅)

**Deliverables**:
- ✅ `research.md` - Next.js patterns, shadcn components, design system analysis
- ✅ Design tokens extracted from HTML references
- ✅ Component selection rationale documented
- ✅ Architecture decisions matrix with alternatives

**Key Findings**:
1. **Design System**: Neo-brutalist dark theme with #f4252f primary, #050505 obsidian background, 0px border-radius
2. **Component Library**: shadcn/ui chosen for accessible primitives (8 components identified)
3. **State Management**: React Context sufficient for sidebar state (avoiding zustand complexity)
4. **Performance Strategy**: 80%+ Server Components, dynamic imports for dashboard, <250KB bundle target

## Phase 1: Design & Contracts (Complete ✅)

**Deliverables**:
- ✅ `data-model.md` - Component interfaces, UI state models, design tokens
- ✅ `contracts/interfaces.ts` - TypeScript interfaces for all components
- ✅ `quickstart.md` - Development setup and component usage guide
- ✅ Agent context updated (CLAUDE.md)

**Key Artifacts**:
1. **Component Interfaces**: 15+ interfaces defined (Hero, FeatureCard, Sidebar, TopNav, etc.)
2. **State Models**: SidebarState, NavigationState, SessionContext
3. **Design Tokens**: ThemeConfig with colors, fonts, spacing, breakpoints
4. **Route Models**: PublicRoute, ProtectedRoute, RouteConfig

## Phase 2: Implementation Planning

### 2.1 Implementation Strategy

**Approach**: Bottom-up component development with progressive composition

1. **Iteration 1**: shadcn/ui setup + design tokens (1-2 hours)
2. **Iteration 2**: Landing page components (4-6 hours)
3. **Iteration 3**: Dashboard components (6-8 hours)
4. **Iteration 4**: Integration + polish (2-3 hours)

**Total Estimated Time**: 13-19 hours

### 2.2 Task Breakdown Summary

**Setup Tasks** (Priority: P0 - Must complete first):
1. Install shadcn/ui components (7 components)
2. Configure Tailwind with design tokens
3. Create hooks (useSidebar, useMediaQuery)
4. Create constants file

**Landing Page Tasks** (Priority: P1 - Primary feature):
5. Create Hero component
6. Create FeatureCard component
7. Create FeaturesGrid component
8. Create CTASection component
9. Create Header component (shared)
10. Create Footer component (shared)
11. Update app/page.tsx with landing page composition

**Dashboard Tasks** (Priority: P2 - Secondary feature):
12. Create Sidebar component (Client Component)
13. Create SidebarNav component (Server Component)
14. Create TopNav component (Server Component)
15. Create DashboardShell component (Server Component)
16. Create app/(dashboard)/layout.tsx
17. Create app/(dashboard)/page.tsx

**Polish Tasks** (Priority: P3 - Final touches):
18. Add loading states (Suspense boundaries)
19. Add error boundaries
20. Test responsive behavior (3 breakpoints)
21. Verify accessibility (keyboard nav, ARIA labels)
22. Run performance audit (Lighthouse)
23. Verify 80%+ Server Components ratio

### 2.3 Testing Strategy

**Unit Tests** (Future phase):
- Component rendering tests with React Testing Library
- Hook behavior tests (useSidebar state transitions)
- Utility function tests (cn() class merging)

**Integration Tests** (Future phase):
- Landing page navigation flow
- Dashboard sidebar collapse/expand
- Route protection middleware

**E2E Tests** (Future phase):
- User journey: Landing → Signup → Dashboard
- Responsive behavior across breakpoints
- Keyboard accessibility flow

**Manual Testing Checklist**:
- [ ] Landing page renders hero, features, CTA
- [ ] Header shows login/signup buttons when unauthenticated
- [ ] Dashboard requires authentication (redirects to /login)
- [ ] Sidebar collapses/expands with state persistence
- [ ] Navigation highlights active route
- [ ] Mobile menu works on <768px screens
- [ ] All interactive elements keyboard accessible
- [ ] No console errors in browser

### 2.4 Deployment Readiness

**Pre-deployment Checklist**:
- [ ] TypeScript type checking passes (no errors)
- [ ] ESLint passes (no errors)
- [ ] Bundle size <250KB gzipped (verified with webpack-bundle-analyzer)
- [ ] Lighthouse score ≥90 for performance, accessibility, best practices
- [ ] All images optimized with next/image
- [ ] Fonts preloaded (Space Grotesk, JetBrains Mono)
- [ ] Meta tags for SEO (title, description, og:image)
- [ ] Favicon added to app/

**Production Build Test**:
```bash
npm run build
npm run start
# Test on http://localhost:3000
```

### 2.5 Risk Mitigation

**Identified Risks** (from research.md):

| Risk | Mitigation Strategy | Status |
|------|---------------------|--------|
| Performance budget exceeded | Dynamic imports for dashboard, code splitting by route | Planned |
| Better Auth integration issues | Follow CLAUDE.md patterns, test middleware early | Mitigated |
| Responsive layout breaks | Mobile-first development, test at all breakpoints | Planned |
| Client Component overuse | Default Server Components, explicit justification for 'use client' | Enforced |

### 2.6 Success Criteria Validation

**From spec.md Success Criteria**:

| Criterion | Validation Method | Target |
|-----------|-------------------|--------|
| SC-001: Landing FCP <2s | Lighthouse audit | <1.5s |
| SC-002: Dashboard render <1.5s | Performance API timing | <1.5s |
| SC-003: Responsive breakpoints | Manual testing at 375px, 768px, 1024px | Pass all |
| SC-004: Interaction latency <100ms | Performance API timing | <100ms |
| SC-005: Signup conversion | Navigation flow test | Click-through |
| SC-006: Sidebar persistence | localStorage check after refresh | Persists |
| SC-007: WCAG AA accessibility | axe-core / Lighthouse audit | Pass AA |
| SC-008: Bundle <250KB | webpack-bundle-analyzer | <250KB |
| SC-009: 80%+ Server Components | Count 'use client' directives | ≥80% |
| SC-010: Theme consistency | Visual regression test | Passes |

## Next Steps

**Immediate Action**: Run `/sp.tasks` to generate detailed implementation tasks

**Command**:
```bash
/sp.tasks
```

This will create `tasks.md` with:
- Detailed step-by-step tasks
- Acceptance criteria for each task
- Test cases for validation
- Task dependencies and sequencing

**After Tasks Generation**:
1. Review tasks.md for completeness
2. Begin implementation starting with P0 setup tasks
3. Follow quickstart.md for development workflow
4. Reference data-model.md for component interfaces
5. Use research.md for design pattern guidance

---

**Plan Status**: ✅ **COMPLETE**
**Branch**: 001-frontend-ui
**Next Command**: `/sp.tasks`
**Artifacts Generated**:
- specs/001-frontend-ui/plan.md (this file)
- specs/001-frontend-ui/research.md
- specs/001-frontend-ui/data-model.md
- specs/001-frontend-ui/contracts/interfaces.ts
- specs/001-frontend-ui/quickstart.md
