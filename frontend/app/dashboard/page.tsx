import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Overview"
      description="Welcome back, operator. Your daily mission briefing."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-charcoal border-border-sharp">
          <CardHeader>
            <CardTitle className="text-primary uppercase tracking-wider text-sm">Total Tasks</CardTitle>
            <CardDescription className="font-mono text-xs">Active operations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">24</p>
          </CardContent>
        </Card>

        <Card className="bg-charcoal border-border-sharp">
          <CardHeader>
            <CardTitle className="text-primary uppercase tracking-wider text-sm">Completed</CardTitle>
            <CardDescription className="font-mono text-xs">Missions accomplished</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">18</p>
          </CardContent>
        </Card>

        <Card className="bg-charcoal border-border-sharp">
          <CardHeader>
            <CardTitle className="text-primary uppercase tracking-wider text-sm">In Progress</CardTitle>
            <CardDescription className="font-mono text-xs">Active engagements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">6</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold uppercase tracking-wider mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-charcoal border border-border-subtle hover:border-primary transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">task</span>
                  <div>
                    <p className="font-mono text-sm">Task #{i}: Operation Complete</p>
                    <p className="text-xs text-gray-400 font-mono">2 hours ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs uppercase tracking-wider">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
