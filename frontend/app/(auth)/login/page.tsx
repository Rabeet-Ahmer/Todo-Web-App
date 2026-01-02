"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations/auth.schema"
import { AuthCard } from "@/components/auth/AuthCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginInput) {
    setIsLoading(true)
    console.log("Login values:", values)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                  Identifier (Email)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="operator@system.io"
                    className="bg-obsidian border-border-subtle text-white focus:border-primary rounded-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[10px] text-primary uppercase font-mono" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                  Access Key (Password)
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-obsidian border-border-subtle text-white focus:border-primary rounded-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[10px] text-primary uppercase font-mono" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-red-600 text-white font-bold uppercase tracking-widest py-6 rounded-none mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Validating..." : "Execute Access"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  )
}
