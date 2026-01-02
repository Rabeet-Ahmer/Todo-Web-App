import Link from 'next/link'
import { cn } from '@/lib/utils'

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  sections: FooterSection[]
  copyright: string
  className?: string
}

export function Footer({ sections, copyright, className }: FooterProps) {
  return (
    <footer className={cn("bg-charcoal border-t border-border-sharp p-8 md:p-16", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-xs font-bold mb-4 uppercase tracking-widest text-primary">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-xs font-mono text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border-subtle">
          <p className="text-center text-xs font-mono text-gray-600">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
