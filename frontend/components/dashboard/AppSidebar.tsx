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
    url: "/todos",
    icon: ListTodo,
  },
]

const systemItems = [
  {
    title: "System Config",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Security",
    url: "/security",
    icon: Shield,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-border-subtle bg-charcoal">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border-subtle">
        <div className="flex items-center gap-2 px-4 w-full">
          <div className="h-8 w-8 bg-primary flex items-center justify-center font-bold text-white shrink-0">
            Σ
          </div>
          <span className="font-display font-bold uppercase tracking-widest text-white truncate group-data-[collapsible=icon]:hidden">
            Specify<span className="text-primary">+</span>
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
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
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
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border-subtle p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive text-gray-400 font-mono text-xs uppercase tracking-wider h-11 px-4">
              <LogOut className="size-4" />
              <span>Terminate Session</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
