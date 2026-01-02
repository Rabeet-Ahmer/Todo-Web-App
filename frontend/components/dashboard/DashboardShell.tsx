import { cn } from '@/lib/utils'

interface DashboardShellProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ title, description, children, className }: DashboardShellProps) {
  return (
    <div className={cn("p-8", className)}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold uppercase tracking-wider mb-2">{title}</h2>
        {description && (
          <p className="text-gray-400 font-mono text-sm">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}
