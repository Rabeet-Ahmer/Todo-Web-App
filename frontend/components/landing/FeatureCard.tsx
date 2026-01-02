import Link from 'next/link'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  href?: string
  className?: string
}

export function FeatureCard({ icon, title, description, href, className }: FeatureCardProps) {
  const card = (
    <div className={cn(
      "bg-charcoal border border-border-sharp p-6 md:p-10 hover:border-primary transition-colors",
      className
    )}>
      <span className="material-symbols-outlined text-4xl text-primary mb-4 block">
        {icon}
      </span>
      <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed font-mono">
        {description}
      </p>
    </div>
  )

  if (href) {
    return <Link href={href}>{card}</Link>
  }

  return card
}
