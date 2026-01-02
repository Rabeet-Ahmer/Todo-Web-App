'use client'

import { useSidebar } from '@/hooks/useSidebar'
import { SidebarNav } from './SidebarNav'
import { cn } from '@/lib/utils'

interface SidebarNavItem {
  readonly label: string
  readonly icon: string
  readonly href: string
  readonly active?: boolean
  readonly badge?: number
}

interface User {
  id: number
  email: string
  username: string
}

interface SidebarProps {
  items: readonly SidebarNavItem[]
  user: User
  className?: string
}

export function Sidebar({ items, user, className }: SidebarProps) {
  const { collapsed, toggle } = useSidebar()

  return (
    <aside className={cn(
      "flex flex-col bg-charcoal border-r border-border-sharp transition-all duration-300",
      collapsed ? "w-20" : "w-64",
      className
    )}>
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-sharp">
        {!collapsed && (
          <span className="font-mono font-bold text-xl tracking-wider uppercase text-primary">
            TODO
          </span>
        )}
        <button
          onClick={toggle}
          className="text-gray-400 hover:text-primary transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-outlined">
            {collapsed ? 'menu_open' : 'menu'}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <SidebarNav items={items} collapsed={collapsed} />
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border-sharp">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary flex items-center justify-center text-white font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.username}</p>
              <p className="text-xs text-gray-400 truncate font-mono">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
