import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroProps {
  title: string
  subtitle: string
  primaryCta: { text: string; href: string }
  secondaryCta: { text: string; href: string }
  backgroundImage?: string
}

export function Hero({ title, subtitle, primaryCta, secondaryCta, backgroundImage }: HeroProps) {
  return (
    <section className="relative flex flex-col justify-center p-8 md:p-16 lg:p-24 min-h-[600px] border-b border-border-sharp">
      {backgroundImage && (
        <div className="absolute inset-0 opacity-10">
          <div className="bg-grid-pattern w-full h-full" />
        </div>
      )}
      <div className="relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter mb-6 uppercase">
          {title}
        </h1>
        <p className="font-mono text-sm md:text-base text-gray-400 max-w-lg mb-10 leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="default" className="uppercase tracking-widest bg-primary hover:bg-red-600 text-white font-bold">
            <Link href={primaryCta.href}>{primaryCta.text}</Link>
          </Button>
          <Button asChild variant="outline" className="uppercase tracking-widest font-mono border-border-dark hover:bg-border-dark">
            <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
