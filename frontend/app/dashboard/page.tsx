import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CheckCircle2, Clock } from "lucide-react"
import { requireAuth } from "@/actions/auth.actions"
import { issueBackendJwt } from "@/lib/backend-jwt"

// Force dynamic rendering since we use headers() for auth
export const dynamic = 'force-dynamic'

type TodoStats = {
  total: number
  pending: number
  completed: number
}

export default async function DashboardPage() {
  // Ensure user is authenticated
  const session = await requireAuth()
  const userId = (session as any)?.user?.id as string | undefined

  if (!userId) {
    throw new Error("Authenticated session is missing user id")
  }

  const token = await issueBackendJwt(userId)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

  let statsData: TodoStats = {
    total: 0,
    pending: 0,
    completed: 0,
  }

  try {
    const response = await fetch(`${baseUrl}/users/me/todos/stats`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (response.ok) {
      statsData = await response.json()
    } else {
      console.error("Failed to fetch todo stats:", await response.text())
    }
  } catch (error) {
    console.error("Failed to fetch todo stats:", error)
  }

  const stats = [
    {
      title: "Total Operations",
      description: "All tracked objectives",
      value: statsData.total.toString(),
      icon: Activity,
      color: "text-primary",
    },
    {
      title: "Tactical Execution",
      description: "Missions completed",
      value: statsData.completed.toString(),
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: "Active Engagements",
      description: "Immediate priority",
      value: statsData.pending.toString(),
      icon: Clock,
      color: "text-blue-500",
    },
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-display">
          Mission Overview
        </h2>
        <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">
          Synchronizing operative data with central command
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-charcoal border-border-subtle hover:border-primary/50 transition-all rounded-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`size-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1 font-display uppercase tracking-widest">{stat.value}</div>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider italic">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-primary border-l-2 border-primary pl-3">
          Tactical Briefing
        </h3>
        <Card className="bg-charcoal border-border-subtle rounded-none p-6">
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="mt-1 h-3 w-3 bg-primary animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Priority Update: System Lockdown</h4>
                <p className="text-xs text-gray-400 font-mono leading-relaxed max-w-2xl">
                  Central intelligence reports increasing latency in the sector. Operatives are advised to secure all local nodes and verify encrypted uplinks before executing further tasks.
                </p>
              </div>
            </div>
            <div className="h-[1px] bg-border-subtle w-full" />
            <div className="flex gap-4 items-start opacity-70">
              <div className="mt-1 h-3 w-3 bg-gray-600" />
              <div>
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">Notice: Log Rotation Imminent</h4>
                <p className="text-xs text-gray-500 font-mono leading-relaxed max-w-2xl">
                  Automated cleanup process will initiate in T-minus 48 hours. Ensure all mission-critical data is committed to the main branch before the rotation window.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
