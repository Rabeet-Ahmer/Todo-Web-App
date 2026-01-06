# Tasks: Frontend UI Development (Landing Page & Dashboard)

**Input**: Design documents from `/specs/001-frontend-ui/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/interfaces.ts, quickstart.md

**Tests**: Tests are NOT explicitly requested in the specification. This task list focuses on implementation only. Testing will be added in a future phase if required.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: All frontend work in `frontend/` directory
- Components in `frontend/components/`
- Pages in `frontend/app/`
- Hooks in `frontend/hooks/`
- Utils in `frontend/lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and configure design system

- [ ] T001 Install shadcn/ui components via npx: button, card, navigation-menu, dropdown-menu, separator, input, skeleton
- [ ] T002 [P] Configure Tailwind CSS with design tokens in frontend/tailwind.config.ts (colors: primary #f4252f, obsidian #050505, charcoal #121212, border-subtle #2a2a2a, border-sharp #444444; fonts: Space Grotesk, JetBrains Mono; borderRadius: 0px for all)
- [ ] T003 [P] Update global styles in frontend/app/globals.css (import fonts, add custom scrollbar, bg-grid-pattern utility, sharp-border utility)
- [ ] T004 [P] Create constants file in frontend/lib/constants.ts with THEME object and ROUTES configuration
- [ ] T005 [P] Install zustand for state management: npm install zustand
- [ ] T006 [P] Create useSidebar hook in frontend/hooks/useSidebar.ts with collapsed state, toggle, and setCollapsed functions using zustand persist middleware
- [ ] T007 [P] Create useMediaQuery hook in frontend/hooks/useMediaQuery.ts for responsive breakpoint detection

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core shared components that multiple user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Create ErrorBoundary component in frontend/components/shared/ErrorBoundary.tsx (Client Component with error state, fallback UI, onError callback)
- [ ] T009 [P] Verify Better Auth middleware exists and protects /dashboard routes in frontend/middleware.ts (should already exist per CLAUDE.md)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Landing Page Navigation and Discovery (Priority: P1) 🎯 MVP

**Goal**: Deliver a complete landing page with hero section, feature highlights, navigation bar with auth CTAs, and responsive design. This is the primary conversion funnel for new users.

**Independent Test**: Navigate to root URL `/` and verify hero section renders with value proposition, navigation bar shows "Login" and "Sign Up" buttons, feature cards display in grid, all sections are responsive at 375px, 768px, and 1024px breakpoints, and clicking auth buttons navigates to correct routes.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create Hero component in frontend/components/landing/Hero.tsx (Server Component) with title, subtitle, primaryCta, secondaryCta props; render with 5xl-7xl headings, font-mono description, flex button layout
- [ ] T011 [P] [US1] Create FeatureCard component in frontend/components/landing/FeatureCard.tsx (Server Component) with icon, title, description, href props; use Material Symbols icon, hover:border-primary transition
- [ ] T012 [P] [US1] Create FeaturesGrid component in frontend/components/landing/FeaturesGrid.tsx (Server Component) with features array prop, responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] T013 [P] [US1] Create CTASection component in frontend/components/landing/CTASection.tsx (Server Component) with headline, description, cta, emailCapture props; bg-primary with black text
- [ ] T014 [P] [US1] Create Header component in frontend/components/shared/Header.tsx (Server Component) with navItems, user, showAuth props; sticky top nav with 64px height, border-b border-border-sharp
- [ ] T015 [P] [US1] Create Footer component in frontend/components/shared/Footer.tsx (Server Component) with sections, copyright props; 4-column grid on desktop, stacked on mobile
- [ ] T016 [US1] Update frontend/app/page.tsx to compose landing page with Header (showAuth=true), Hero, FeaturesGrid (3 features from research.md), CTASection, and Footer components
- [ ] T017 [US1] Add feature data constants in frontend/lib/constants.ts: FEATURES array with 3 features (Focus_Mode, Keyboard_First, Encrypted_Sync) matching design references
- [ ] T018 [US1] Test landing page responsive behavior at 375px (mobile), 768px (tablet), 1024px (desktop) - verify hero stacks, features grid adapts, nav collapses

**Checkpoint**: At this point, User Story 1 (landing page) should be fully functional and testable independently. Users can view landing page and navigate to auth pages.

---

## Phase 4: User Story 4 - Responsive Design Across Devices (Priority: P2)

**Goal**: Ensure all landing page and dashboard components adapt seamlessly to mobile, tablet, and desktop screen sizes with proper touch interactions and layout adjustments.

**Independent Test**: Resize browser to 375px, 768px, 1024px and verify layouts adapt correctly: mobile stacks vertically, tablet shows 2-column grids, desktop shows 3-column grids. Test touch interactions on mobile simulator.

### Implementation for User Story 4

- [ ] T019 [P] [US4] Add responsive classes to Hero component: text-5xl md:text-7xl for title, flex-col sm:flex-row for buttons, p-8 md:p-16 lg:p-24 for padding
- [ ] T020 [P] [US4] Add responsive classes to FeaturesGrid component: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, adjust card padding for mobile (p-6) vs desktop (p-10)
- [ ] T021 [P] [US4] Add responsive classes to Header component: hidden md:flex for desktop nav, hamburger menu button with sm:hidden for mobile
- [ ] T022 [P] [US4] Add responsive classes to Footer component: grid-cols-2 md:grid-cols-4 for footer sections
- [ ] T023 [US4] Verify mobile interactions: test touch targets ≥44x44px, test mobile menu open/close, test sidebar overlay behavior on <768px

**Checkpoint**: Landing page and dashboard should be fully responsive and touch-friendly across all device sizes.

---

## Phase 5: User Story 2 - Dashboard Layout and Navigation (Priority: P2)

**Goal**: Deliver an authenticated dashboard with collapsible sidebar navigation, top navigation bar, and main content area that updates based on sidebar selection. Enable users to navigate between dashboard sections.

**Independent Test**: Authenticate a user, navigate to `/dashboard`, verify sidebar renders with navigation links, click sidebar toggle and verify collapse/expand animation, click "Todos" link and verify navigation, verify sidebar state persists after page refresh.

### Implementation for User Story 2

- [ ] T024 [P] [US2] Create Sidebar component in frontend/components/dashboard/Sidebar.tsx (Client Component with 'use client') with items, user, collapsed, onToggle props; use useSidebar hook, render with w-20 (collapsed) or w-64 (expanded), transition-all
- [ ] T025 [P] [US2] Create SidebarNav component in frontend/components/dashboard/SidebarNav.tsx (Server Component) with items, collapsed props; map items to nav links with active state (bg-primary/10, border-l-4 border-l-primary), Material Symbols icons
- [ ] T026 [P] [US2] Create TopNav component in frontend/components/dashboard/TopNav.tsx (Server Component) with title, user, showSearch, notifications props; h-16 border-b border-border-sharp, display user profile icon, search bar (hidden md:flex)
- [ ] T027 [P] [US2] Create DashboardShell component in frontend/components/dashboard/DashboardShell.tsx (Server Component) with title, description, children props; wrapper for main content with title header and description
- [ ] T028 [US2] Create dashboard layout in frontend/app/(dashboard)/layout.tsx with Sidebar, TopNav, and main content area; flex h-screen layout, Sidebar on left, TopNav + main on right
- [ ] T029 [US2] Create dashboard home page in frontend/app/(dashboard)/page.tsx using DashboardShell with welcome message and overview content
- [ ] T030 [US2] Add sidebar navigation items in frontend/lib/constants.ts: DASHBOARD_NAV array with Overview, Todos, Settings icons and routes
- [ ] T031 [US2] Test sidebar collapse/expand: verify state persists in localStorage via useSidebar hook, verify animation smooth with transition-all, verify icons-only mode on collapsed
- [ ] T032 [US2] Test dashboard route protection: navigate to /dashboard without auth, verify redirect to /login via Better Auth middleware

**Checkpoint**: At this point, User Story 2 (dashboard) should be fully functional. Authenticated users can access dashboard, navigate sections, and sidebar state persists.

---

## Phase 6: User Story 3 - Dark Mode Theme Consistency (Priority: P3)

**Goal**: Ensure all components use consistent dark theme colors, typography, and interactive states across landing page and dashboard. Apply neo-brutalist aesthetic with sharp borders and consistent accent colors.

**Independent Test**: Visually inspect landing page and dashboard side-by-side, verify backgrounds use obsidian/charcoal consistently, verify text uses white/gray-400 hierarchy, verify all buttons/cards use primary red accent on hover, verify 0px border-radius on all elements.

### Implementation for User Story 3

- [ ] T033 [P] [US3] Audit all components for theme consistency: verify bg-obsidian or bg-charcoal for backgrounds, text-white or text-gray-400 for text, border-border-subtle or border-border-sharp for borders
- [ ] T034 [P] [US3] Verify button variants in shadcn button component use primary red (#f4252f) for default variant, hover:bg-red-600 transition, uppercase tracking-widest text
- [ ] T035 [P] [US3] Verify card components use bg-charcoal with border border-border-sharp, hover:border-white transition
- [ ] T036 [P] [US3] Verify input components use bg-obsidian, border-border-subtle, focus:border-primary, placeholder-gray-600, font-mono
- [ ] T037 [US3] Add CSS custom properties in frontend/app/globals.css for theme tokens: --primary, --obsidian, --charcoal, --border-subtle (optional enhancement for shadcn theming)
- [ ] T038 [US3] Test interactive states: verify all buttons show hover states within 100ms, verify focus rings visible with focus:border-primary, verify active sidebar items show bg-primary/10

**Checkpoint**: All components should have consistent dark theme styling matching design references with neo-brutalist aesthetic.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final deployment readiness

- [ ] T039 [P] Add Suspense boundaries in frontend/app/(dashboard)/layout.tsx for async dashboard content with loading skeleton
- [ ] T040 [P] Add error boundary wrapper in frontend/app/layout.tsx to catch global errors
- [ ] T041 [P] Add next/image optimization for any hero background images in frontend/public/images/ with priority flag for above-the-fold images
- [ ] T042 [P] Add meta tags in frontend/app/layout.tsx: title, description, og:title, og:description, og:image for SEO
- [ ] T043 [P] Add favicon in frontend/app/favicon.ico
- [ ] T044 [P] Verify WCAG AA accessibility: test keyboard navigation (Tab, Shift+Tab, Enter, Escape), verify aria-labels on icon-only buttons, verify proper heading hierarchy (h1 → h2 → h3)
- [ ] T045 [P] Run Lighthouse audit: verify Performance ≥90, Accessibility ≥90, Best Practices ≥90, SEO ≥90
- [ ] T046 [P] Run production build test: npm run build && npm run start, verify no console errors, test all pages load
- [ ] T047 [P] Verify bundle size <250KB gzipped: run webpack-bundle-analyzer or check .next/server build output
- [ ] T048 [P] Count 'use client' directives: verify ≥80% Server Components (only Sidebar, SidebarNav children with interactions should be Client Components)
- [ ] T049 Documentation: Update frontend/README.md with setup instructions from quickstart.md
- [ ] T050 Code cleanup: Remove any unused imports, components, or console.log statements
- [ ] T051 Final validation: Run through quickstart.md setup steps to verify developer experience

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase - Landing page (P1 priority) 🎯 MVP
- **User Story 4 (Phase 4)**: Depends on User Story 1 - Responsive enhancements for landing page
- **User Story 2 (Phase 5)**: Depends on Foundational phase - Dashboard can develop in parallel with US1/US4
- **User Story 3 (Phase 6)**: Depends on User Story 1 AND User Story 2 - Theme consistency across both
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ MVP
- **User Story 4 (P2)**: Depends on User Story 1 completion - Enhances landing page with responsive design
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of User Story 1 (can develop in parallel)
- **User Story 3 (P3)**: Depends on User Story 1 AND User Story 2 - Applies theme consistency to both pages

### Within Each User Story

- **User Story 1**: Components can be built in parallel (T010-T015 marked [P]), then composed in page (T016), then tested (T017-T018)
- **User Story 4**: All responsive tasks can be done in parallel (T019-T022 marked [P]), then validated (T023)
- **User Story 2**: Components can be built in parallel (T024-T027 marked [P]), then composed in layout/page (T028-T029), then tested (T030-T032)
- **User Story 3**: All audit tasks can be done in parallel (T033-T036 marked [P]), then enhancements applied (T037), then validated (T038)

### Parallel Opportunities

- **Setup (Phase 1)**: Tasks T002, T003, T004, T005, T006, T007 can all run in parallel
- **Foundational (Phase 2)**: Tasks T008, T009 can run in parallel
- **User Story 1**: Tasks T010, T011, T012, T013, T014, T015 can all run in parallel (different component files)
- **User Story 4**: Tasks T019, T020, T021, T022 can all run in parallel (modifying different components)
- **User Story 2**: Tasks T024, T025, T026, T027 can all run in parallel (different component files)
- **User Story 3**: Tasks T033, T034, T035, T036 can all run in parallel (auditing different component types)
- **Polish (Phase 7)**: Tasks T039, T040, T041, T042, T043, T044, T045, T046, T047, T048 can mostly run in parallel
- **Cross-Phase Parallelism**: Once Foundational is complete, User Story 1 and User Story 2 can develop in parallel by different developers

---

## Parallel Example: User Story 1 (Landing Page)

```bash
# Launch all landing page components together:
Task: "Create Hero component in frontend/components/landing/Hero.tsx"
Task: "Create FeatureCard component in frontend/components/landing/FeatureCard.tsx"
Task: "Create FeaturesGrid component in frontend/components/landing/FeaturesGrid.tsx"
Task: "Create CTASection component in frontend/components/landing/CTASection.tsx"
Task: "Create Header component in frontend/components/shared/Header.tsx"
Task: "Create Footer component in frontend/components/shared/Footer.tsx"

# After components complete, compose the page:
Task: "Update frontend/app/page.tsx to compose landing page"
```

## Parallel Example: User Story 2 (Dashboard)

```bash
# Launch all dashboard components together:
Task: "Create Sidebar component in frontend/components/dashboard/Sidebar.tsx"
Task: "Create SidebarNav component in frontend/components/dashboard/SidebarNav.tsx"
Task: "Create TopNav component in frontend/components/dashboard/TopNav.tsx"
Task: "Create DashboardShell component in frontend/components/dashboard/DashboardShell.tsx"

# After components complete, compose the layout:
Task: "Create dashboard layout in frontend/app/(dashboard)/layout.tsx"
Task: "Create dashboard home page in frontend/app/(dashboard)/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007) - Install dependencies, configure design system
2. Complete Phase 2: Foundational (T008-T009) - Error boundaries and middleware check
3. Complete Phase 3: User Story 1 (T010-T018) - Landing page with hero, features, navigation
4. **STOP and VALIDATE**: Navigate to `/`, test all landing page sections, verify responsive behavior
5. Deploy/demo landing page as MVP ✅

### Incremental Delivery

1. **Foundation**: Setup + Foundational (T001-T009) → Design system ready
2. **MVP (US1)**: Landing page (T010-T018) → Test independently → Deploy/Demo 🎯
3. **Responsive (US4)**: Responsive enhancements (T019-T023) → Test at breakpoints → Deploy/Demo
4. **Dashboard (US2)**: Dashboard layout (T024-T032) → Test authenticated flow → Deploy/Demo
5. **Theme (US3)**: Theme consistency (T033-T038) → Visual validation → Deploy/Demo
6. **Polish**: Final polish (T039-T051) → Lighthouse audit → Production deploy

### Parallel Team Strategy

With multiple developers after Foundational phase (T009) completes:

1. **Developer A**: User Story 1 (Landing Page) - T010 through T018
2. **Developer B**: User Story 2 (Dashboard) - T024 through T032 (can start in parallel with Developer A)
3. **Developer C**: User Story 4 prep work - Research responsive patterns while A/B work

After US1 completes:
- **Developer C**: User Story 4 (Responsive) - T019 through T023 (enhances US1 work)

After US1 and US2 complete:
- **Any Developer**: User Story 3 (Theme) - T033 through T038 (audits both pages)

---

## Task Statistics

- **Total Tasks**: 51
- **Setup Tasks**: 7 (T001-T007)
- **Foundational Tasks**: 2 (T008-T009)
- **User Story 1 Tasks**: 9 (T010-T018) 🎯 MVP
- **User Story 4 Tasks**: 5 (T019-T023)
- **User Story 2 Tasks**: 9 (T024-T032)
- **User Story 3 Tasks**: 6 (T033-T038)
- **Polish Tasks**: 13 (T039-T051)

**Parallelizable Tasks**: 34 tasks marked with [P] can run concurrently
**Sequential Tasks**: 17 tasks require previous task completion

**MVP Scope** (Minimum for first deploy):
- Phase 1: Setup (7 tasks)
- Phase 2: Foundational (2 tasks)
- Phase 3: User Story 1 (9 tasks)
- **Total MVP Tasks**: 18 tasks

---

## Notes

- [P] tasks = different files, no dependencies - can execute in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are not included per specification - focus is on implementation
- Better Auth middleware already exists per CLAUDE.md - just verify it works
- All design tokens extracted from design references in research.md
- Component interfaces defined in contracts/interfaces.ts
- Development workflow documented in quickstart.md
- 80%+ Server Components enforced - only Sidebar and interactive elements need 'use client'
