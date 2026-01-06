"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth-client"
import { toast } from "sonner"

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: RegisterInput) {
    setIsLoading(true)
    try {
        const { error } = await signUp.email({
            email: values.email,
            password: values.password,
            name: values.name,
            callbackURL: "/dashboard"
        });

        if (error) {
            toast.error(error.message || "Failed to register");
        } else {
            toast.success("Activation successful");
            router.push("/login");
        }
    } catch (e: any) {
        toast.error("Initialization protocol failure");
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                Operative Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Operator Alpha"
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                  Access Key
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                  Verify Key
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
        </div>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-red-600 text-white font-bold uppercase tracking-widest py-6 rounded-none mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Initializing..." : "Register Credentials"}
        </Button>
      </form>
    </Form>
  )
}
