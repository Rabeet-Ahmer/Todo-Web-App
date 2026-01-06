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

export const FEATURES = [
  {
    icon: 'visibility_off',
    title: 'Focus_Mode',
    description: 'Distraction-free UI environment engineered for deep work sessions.',
  },
  {
    icon: 'keyboard',
    title: 'Keyboard_First',
    description: 'Execute any operation via command palette. Zero mouse dependency.',
  },
  {
    icon: 'lock',
    title: 'Encrypted_Sync',
    description: 'End-to-end encryption for your tasks. Zero-knowledge architecture.',
  },
] as const

export const DASHBOARD_NAV = [
  { label: 'Overview', icon: 'dashboard', href: '/dashboard', active: false },
  { label: 'Todos', icon: 'task', href: '/dashboard/todos', active: false },
  { label: 'Settings', icon: 'settings', href: '/dashboard/settings', active: false },
] as const
