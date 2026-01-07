import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  active?: boolean
}

interface User {
  id: number
  email: string
  username: string
}

interface HeaderProps {
  navItems: NavItem[]
  user?: User | null
  showAuth?: boolean
  className?: string
}

export function Header({ navItems, user, showAuth = false, className }: HeaderProps) {
  return (
    <header className={cn("sticky top-0 z-50 bg-obsidian border-b border-border-sharp h-16", className)}>
      <nav className="h-full px-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="font-mono font-bold text-xl tracking-wider uppercase text-primary">
          TODO_APP
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-xs font-mono uppercase tracking-widest transition-all-fast relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all-fast hover:after:w-full",
                item.active
                  ? "text-primary"
                  : "text-gray-400 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}

          {showAuth && !user && (
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="uppercase tracking-widest font-mono hover:text-white">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="default" size="sm" className="uppercase tracking-widest bg-primary hover:bg-red-600 font-bold">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400">{user.username}</span>
              <Button asChild variant="default" size="sm" className="uppercase tracking-widest bg-primary hover:bg-red-600 font-bold">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" aria-label="Toggle menu">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </nav>
    </header>
  )
}
