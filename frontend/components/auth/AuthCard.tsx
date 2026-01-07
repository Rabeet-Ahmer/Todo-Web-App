import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
  footerLink: {
    text: string
    href: string
    linkText: string
  }
}

export function AuthCard({ title, description, children, footerLink }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian p-4">
      <Card className="w-full max-w-md border-border-subtle bg-charcoal animate-scale-in">
        <CardHeader className="space-y-1 animate-slide-down">
          <CardTitle className="text-2xl font-bold tracking-tight text-white uppercase font-display">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-400 font-mono text-xs uppercase tracking-widest">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          {children}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <div className="text-sm text-gray-400 font-mono text-center w-full">
            {footerLink.text}{" "}
            <Link
              href={footerLink.href}
              className="text-primary hover:underline font-bold transition-colors"
            >
              {footerLink.linkText}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
