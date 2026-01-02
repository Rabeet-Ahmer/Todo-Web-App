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
      <Card className="w-full max-w-md border-border-subtle bg-charcoal">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-white uppercase font-display">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-400 font-mono text-xs uppercase tracking-widest">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-400 font-mono text-center w-full">
            {footerLink.text}{" "}
            <Link
              href={footerLink.href}
              className="text-primary hover:underline font-bold"
            >
              {footerLink.linkText}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
