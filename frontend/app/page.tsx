import { Hero } from '@/components/landing/Hero'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { CTASection } from '@/components/landing/CTASection'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { FEATURES } from '@/lib/constants'

export default function LandingPage() {
  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Security', href: '#security' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Careers', href: '#careers' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#docs' },
        { label: 'API', href: '#api' },
        { label: 'Support', href: '#support' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#privacy' },
        { label: 'Terms', href: '#terms' },
        { label: 'License', href: '#license' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-obsidian">
      <Header navItems={navItems} showAuth={true} />

      <main>
        <Hero
          title="Execute Tasks. Zero Latency."
          subtitle="The precision tool for the modern operator. Absolute clarity for your daily objectives."
          primaryCta={{ text: 'Get Started', href: '/register' }}
          secondaryCta={{ text: 'View Demo', href: '#demo' }}
          backgroundImage="/images/hero-bg.jpg"
        />

        <FeaturesGrid
          features={FEATURES}
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          className="border-b border-border-sharp"
        />

        <CTASection
          headline="Ready to Execute?"
          description="Join the elite operators using our protocol to dominate their workflow."
          cta={{ text: 'Get Started', href: '/register', variant: 'primary' }}
          emailCapture={true}
        />
      </main>

      <Footer sections={footerSections} copyright="© 2026 Todo App. All rights reserved." />
    </div>
  )
}
