"use client"

import { AuthCard } from "@/components/auth/AuthCard"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <AuthCard
      title="Access Core"
      description="Authentication protocol required for system access"
      footerLink={{
        text: "New operative?",
        href: "/register",
        linkText: "Request Activation",
      }}
    >
      <LoginForm />
    </AuthCard>
  )
}
