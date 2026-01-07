import { TodoList } from "@/components/todos/TodoList"
import { type Todo } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { requireAuth } from "@/actions/auth.actions"
import { createTodoAction } from "@/actions/todo.actions"
import { issueBackendJwt } from "@/lib/backend-jwt"

// Force dynamic rendering since we use headers() for auth
export const dynamic = 'force-dynamic'

export default async function TodosPage() {
  const session = await requireAuth()
  const userId = (session as any)?.user?.id as string | undefined

  if (!userId) {
    throw new Error("Authenticated session is missing user id")
  }

  const token = await issueBackendJwt(userId)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

  let todos: Todo[] = []

  try {
    const response = await fetch(`${baseUrl}/todos`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (response.ok) {
      todos = await response.json()
    } else {
      console.error("Failed to fetch todos:", await response.text())
    }
  } catch (error) {
    console.error("Failed to fetch todos:", error)
  }

  const incompleteTodos = todos.filter((todo) => !todo.completed)
  const completeTodos = todos.filter((todo) => todo.completed)

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="animate-slide-down">
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-display">
            Active Objectives
          </h2>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-1">
            Operational status of primary tasks
          </p>
        </div>
      </div>

      <form
        action={async (formData) => {
          "use server"
          await createTodoAction(formData)
        }}
        className="space-y-4 bg-charcoal border border-border-subtle p-4"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            name="title"
            placeholder="Define new objective title"
            className="flex-1 font-mono text-xs uppercase tracking-widest"
            required
          />
          <Input
            name="description"
            placeholder="Optional description"
            className="flex-1 font-mono text-xs uppercase tracking-widest"
          />
          <select
            name="priority"
            defaultValue="MEDIUM"
            className="flex-1 font-mono text-xs uppercase tracking-widest bg-charcoal border border-border-subtle text-gray-200 px-3 py-2"
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
          <Button
            type="submit"
            className="bg-primary hover:bg-red-600 text-white font-bold uppercase tracking-widest rounded-none gap-2"
          >
            <Plus className="size-4" />
            Initialize Task
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        <section>
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4 border-l-2 border-primary pl-3">
            Priority Queue
          </h3>
          <TodoListWrapper todos={incompleteTodos} />
        </section>

        <section>
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500 mb-4 border-l-2 border-border-subtle pl-3">
            Standard Operations
          </h3>
          <TodoListWrapper todos={completeTodos} />
        </section>
      </div>
    </div>
  )
}

function TodoListWrapper({ todos }: { todos: Todo[] }) {
  if (!todos || todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border-subtle bg-charcoal/50 animate-fade-in">
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
          No objectives found in database
        </p>
      </div>
    )
  }

  return <TodoList todos={todos} />
}
