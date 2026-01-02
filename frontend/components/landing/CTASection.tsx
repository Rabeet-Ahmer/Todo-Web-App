import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CTASectionProps {
  headline: string
  description: string
  cta: {
    text: string
    href: string
    variant?: 'primary' | 'secondary'
  }
  emailCapture?: boolean
  className?: string
}

export function CTASection({ headline, description, cta, emailCapture, className }: CTASectionProps) {
  return (
    <section className={cn("bg-primary p-8 md:p-16 border-y border-border-sharp", className)}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-wider text-black">
          {headline}
        </h2>
        <p className="text-black/80 font-mono text-sm md:text-base mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {emailCapture && (
            <input
              type="email"
              placeholder="ENTER EMAIL"
              className="px-6 py-3 bg-black text-white border border-black font-mono uppercase tracking-wider placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
          )}
          <Button asChild variant={cta.variant === 'secondary' ? 'outline' : 'default'} className="uppercase tracking-widest bg-black text-white hover:bg-black/80 font-bold border-black">
            <Link href={cta.href}>{cta.text}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
