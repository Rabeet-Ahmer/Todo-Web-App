import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { cookies } from "next/headers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border-subtle px-4 bg-charcoal">
          <SidebarTrigger className="-ml-1 text-primary" />
          <div className="h-4 w-[1px] bg-border-subtle mx-2" />
          <h1 className="font-display text-sm font-bold uppercase tracking-widest text-white">
            System Dashboard
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-obsidian text-white animate-fade-in">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
