import { FeatureCard } from './FeatureCard'
import { cn } from '@/lib/utils'

interface Feature {
  readonly icon: string
  readonly title: string
  readonly description: string
  readonly href?: string
}

interface FeaturesGridProps {
  features: readonly Feature[]
  columns?: {
    mobile: number
    tablet: number
    desktop: number
  }
  className?: string
}

export function FeaturesGrid({ features, columns = { mobile: 1, tablet: 2, desktop: 3 }, className }: FeaturesGridProps) {
  return (
    <section className={cn("p-8 md:p-16", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  )
}
