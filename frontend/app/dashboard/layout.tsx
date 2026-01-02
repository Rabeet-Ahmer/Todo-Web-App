import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopNav } from '@/components/dashboard/TopNav'
import { DASHBOARD_NAV } from '@/lib/constants'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mock user data - replace with actual session data from Better Auth
  const user = {
    id: 1,
    email: 'user@example.com',
    username: 'operator',
    is_active: true,
    created_at: '2026-01-02',
  }

  return (
    <div className="flex h-screen overflow-hidden bg-obsidian">
      <Sidebar items={DASHBOARD_NAV} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title="Dashboard" user={user} showSearch={true} />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
