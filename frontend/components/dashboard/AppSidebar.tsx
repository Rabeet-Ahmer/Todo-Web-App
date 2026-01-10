"use client"

import * as React from "react"
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  LogOut,
  User,
  Shield,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import Link from "next/link"
import { UserProfile } from "./UserProfile"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    url: "/dashboard/todos",
    icon: ListTodo,
  },
]

// const systemItems = [
//   {
//     title: "System Config",
//     url: "/settings",
//     icon: Settings,
//   },
//   {
//     title: "Security",
//     url: "/security",
//     icon: Shield,
//   },
// ]

interface User {
  id: number
  email: string
  username: string
}

interface AppSidebarProps {
  user: User
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/")
          },
        },
      })
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }

  return (
    <Sidebar collapsible="icon" className="z-20 border-r border-border-subtle bg-charcoal">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border-subtle">
        <div className="flex items-center gap-2 px-4 w-full">
          <div className="h-8 w-8 bg-primary flex items-center justify-center font-bold text-white shrink-0">
            Σ
          </div>
          <span className="font-display font-bold uppercase tracking-widest text-white truncate group-data-[collapsible=icon]:hidden">
            Tasks<span className="text-primary">+</span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-4">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="hover:bg-primary/10 hover:text-primary text-gray-400 font-mono text-xs uppercase tracking-wider h-11 px-4 transition-all"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-4">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="hover:bg-primary/10 hover:text-primary text-gray-400 font-mono text-xs uppercase tracking-wider h-11 px-4 transition-all"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <UserProfile user={user} />
        ) : (
          <div className="p-4 text-center text-gray-500 text-xs font-mono uppercase tracking-wider">
            Loading user data...
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
