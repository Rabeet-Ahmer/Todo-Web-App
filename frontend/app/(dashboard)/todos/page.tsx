import { TodoList } from "@/components/todos/TodoList"
import { type Todo } from "@/lib/validations/todo.schema"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Mock data for UI demonstration
const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Infiltrate target database",
    description: "Access core systems and extract encrypted payloads.",
    is_completed: false,
    priority: "HIGH",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Secure communication uplink",
    description: "Establish encrypted VPN tunnel between local node and HQ.",
    is_completed: true,
    priority: "MEDIUM",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Scrub system logs",
    description: "Remove traces of operative presence from edge servers.",
    is_completed: false,
    priority: "LOW",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function TodosPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-display">
            Active Objectives
          </h2>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-1">
            Operational status of primary tasks
          </p>
        </div>
        <Button className="bg-primary hover:bg-red-600 text-white font-bold uppercase tracking-widest rounded-none gap-2">
          <Plus className="size-4" />
          Initialize Task
        </Button>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4 border-l-2 border-primary pl-3">
            Priority Queue
          </h3>
          <TodoList todos={mockTodos.filter(t => t.priority === "HIGH")} />
        </section>

        <section>
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500 mb-4 border-l-2 border-border-subtle pl-3">
            Standard Operations
          </h3>
          <TodoList todos={mockTodos.filter(t => t.priority !== "HIGH")} />
        </section>
      </div>
    </div>
  )
}
