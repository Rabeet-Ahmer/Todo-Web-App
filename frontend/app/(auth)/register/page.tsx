"use client"

import { AuthCard } from "@/components/auth/AuthCard"
import { RegisterForm } from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <AuthCard
      title="Request Activation"
      description="Initialize new operative credentials"
      footerLink={{
        text: "Already active?",
        href: "/login",
        linkText: "System Access",
      }}
    >
      <RegisterForm />
    </AuthCard>
  )
}
