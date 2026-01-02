import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface User {
  id: number
  email: string
  username: string
}

interface Notification {
  id: string
  message: string
  timestamp: string
  read: boolean
  href?: string
}

interface TopNavProps {
  title: string
  user: User
  showSearch?: boolean
  notifications?: Notification[]
  className?: string
}

export function TopNav({ title, user, showSearch, notifications, className }: TopNavProps) {
  return (
    <header className={cn("h-16 border-b border-border-sharp bg-obsidian px-6 flex items-center justify-between", className)}>
      <h1 className="text-xl font-bold uppercase tracking-wider">{title}</h1>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="hidden md:flex items-center">
            <input
              type="search"
              placeholder="SEARCH..."
              className="px-4 py-2 bg-charcoal border border-border-subtle text-white font-mono text-xs uppercase tracking-wider placeholder-gray-600 focus:outline-none focus:border-primary w-64"
            />
          </div>
        )}

        {notifications && notifications.length > 0 && (
          <button className="relative text-gray-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            {notifications.some(n => !n.read) && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 font-mono hidden md:inline">{user.username}</span>
          <div className="w-8 h-8 bg-primary flex items-center justify-center text-white font-bold text-sm">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
