"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations/auth.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
import { toast } from "sonner"

export function LoginForm() {
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
    try {
        const { error } = await signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/dashboard"
        });

        if (error) {
            toast.error(error.message || "Failed to login");
        } else {
            toast.success("Access granted");
            router.push("/dashboard");
        }
    } catch (e: any) {
        toast.error("Authentication protocol failure");
    } finally {
        setIsLoading(false)
    }
  }

  return (
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
  )
}
