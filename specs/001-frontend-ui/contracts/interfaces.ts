/**
 * TypeScript Interfaces for Frontend UI Components
 * Feature: 001-frontend-ui
 * Generated: 2026-01-02
 *
 * All component prop interfaces with strict null safety.
 * See data-model.md for detailed documentation.
 */

// =============================================================================
// STATE MODELS
// =============================================================================

export interface SidebarState {
  /** Whether the sidebar is collapsed (icons only) */
  collapsed: boolean
  /** Toggle the collapsed state */
  toggle: () => void
  /** Set collapsed state explicitly */
  setCollapsed: (collapsed: boolean) => void
}

export interface NavigationState {
  /** Current active route path */
  activePath: string
  /** Whether mobile menu is open */
  mobileMenuOpen: boolean
  /** Set active path (usually derived from URL) */
  setActivePath: (path: string) => void
  /** Toggle mobile menu */
  toggleMobileMenu: () => void
}

export interface SessionContext {
  /** Authenticated user data */
  user: User | null
  /** Session object */
  session: Session | null
  /** Loading state */
  isLoading: boolean
  /** Whether user is authenticated */
  isAuthenticated: boolean
}

export interface User {
  id: number
  email: string
  username: string
  is_active: boolean
  created_at: string
}

export interface Session {
  id: string
  userId: number
  expiresAt: string
  token: string
}

// =============================================================================
// LANDING PAGE COMPONENTS
// =============================================================================

export interface HeroProps {
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

export interface FeatureCardProps {
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

export interface FeaturesGridProps {
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

export interface CTASectionProps {
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

// =============================================================================
// DASHBOARD COMPONENTS
// =============================================================================

export interface SidebarProps {
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

export interface SidebarNavItem {
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

export interface SidebarNavProps {
  /** Navigation items */
  items: SidebarNavItem[]
  /** Whether sidebar is collapsed */
  collapsed: boolean
  /** Custom className */
  className?: string
}

export interface TopNavProps {
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

export interface Notification {
  id: string
  message: string
  timestamp: string
  read: boolean
  href?: string
}

export interface DashboardShellProps {
  /** Page title */
  title: string
  /** Page description */
  description?: string
  /** Child content */
  children: React.ReactNode
  /** Custom className */
  className?: string
}

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

export interface HeaderProps {
  /** Navigation items */
  navItems: NavItem[]
  /** User session (null if unauthenticated) */
  user?: User | null
  /** Whether to show login/signup buttons */
  showAuth?: boolean
  /** Custom className */
  className?: string
}

export interface NavItem {
  label: string
  href: string
  active?: boolean
}

export interface FooterProps {
  /** Footer sections */
  sections: FooterSection[]
  /** Copyright text */
  copyright: string
  /** Custom className */
  className?: string
}

export interface FooterSection {
  title: string
  links: Array<{
    label: string
    href: string
  }>
}

export interface ErrorBoundaryProps {
  /** Child content to protect */
  children: React.ReactNode
  /** Optional fallback UI */
  fallback?: React.ReactNode
  /** Error callback */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

// =============================================================================
// FORM MODELS
// =============================================================================

export interface EmailCaptureFormData {
  email: string
}

// =============================================================================
// DESIGN TOKENS
// =============================================================================

export interface ThemeConfig {
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

// =============================================================================
// ROUTES
// =============================================================================

export type PublicRoute = '/' | '/login' | '/register' | '/about' | '/contact'

export type ProtectedRoute =
  | '/dashboard'
  | '/dashboard/todos'
  | '/dashboard/todos/[id]'
  | '/dashboard/settings'
  | '/dashboard/profile'

export interface RouteConfig {
  path: string
  label: string
  icon?: string
  protected: boolean
  layout?: 'default' | 'dashboard' | 'auth'
}

// =============================================================================
// RESPONSIVE UTILITIES
// =============================================================================

export interface ResponsiveValue<T> {
  mobile: T
  tablet: T
  desktop: T
}

export type SidebarDisplay = 'hidden' | 'icon-only' | 'full'

export interface SidebarResponsive {
  mobile: SidebarDisplay
  tablet: SidebarDisplay
  desktop: SidebarDisplay
}
