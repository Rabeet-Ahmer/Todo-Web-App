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
      "bg-charcoal border border-border-sharp p-6 md:p-10 transition-all-fast hover:border-primary group",
      className
    )}>
      <span className="material-symbols-outlined text-4xl text-primary mb-4 block transition-transform group-hover:scale-110">
        {icon}
      </span>
      <h3 className="text-xl font-bold mb-3 uppercase tracking-wider transition-colors group-hover:text-primary">
        {title}
      </h3>
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
