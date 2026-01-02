import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SidebarNavItem {
  readonly label: string
  readonly icon: string
  readonly href: string
  readonly active?: boolean
  readonly badge?: number
}

interface SidebarNavProps {
  items: readonly SidebarNavItem[]
  collapsed: boolean
  className?: string
}

export function SidebarNav({ items, collapsed, className }: SidebarNavProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-4 p-5 border-b border-border-subtle transition-all group",
            item.active
              ? "bg-primary/10 text-primary border-l-4 border-l-primary"
              : "text-gray-400 hover:bg-white/5 hover:text-white",
            collapsed && "justify-center px-2"
          )}
        >
          <span className="material-symbols-outlined text-xl">
            {item.icon}
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 text-sm uppercase tracking-wider font-mono">
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-1 text-xs bg-primary text-white font-bold">
                  {item.badge}
                </span>
              )}
            </>
          )}
          {collapsed && item.badge !== undefined && item.badge > 0 && (
            <span className="absolute right-2 top-2 w-2 h-2 bg-primary rounded-full" />
          )}
        </Link>
      ))}
    </div>
  )
}
