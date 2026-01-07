"use client"

import Link from 'next/link'
import { useSession } from "@/lib/auth-client"

export default function NotFound() {
  const { data: session, isPending } = useSession()

  const redirectHref = session ? "/dashboard" : "/"
  const buttonText = session ? "Return to Dashboard" : "Return to Home"

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-obsidian p-4 text-center animate-fade-in">
      <h1 className="mb-4 text-9xl font-bold text-primary animate-scale-in">404</h1>
      <h2 className="mb-8 font-mono text-xl uppercase tracking-widest text-white animate-slide-up">
        Resource Not Found
      </h2>
      <p className="mb-12 max-w-md text-gray-400 animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
        The requested module or path does not exist in the current system context.
      </p>
      <Link
        href={redirectHref}
        className="border border-primary bg-transparent px-8 py-3 font-bold text-primary uppercase tracking-widest transition-all-fast hover:bg-primary hover:text-white animate-slide-up"
        style={{ animationDelay: "200ms", animationFillMode: "both" }}
      >
        {isPending ? "Verifying access..." : buttonText}
      </Link>
    </div>
  )
}
