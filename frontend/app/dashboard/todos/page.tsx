import { TodoList } from "@/components/todos/TodoList"
import { type Todo } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { requireAuth } from "@/actions/auth.actions"

export default async function TodosPage() {
  // Check if user is authenticated
  const session = await requireAuth()

  // For server components, we'll need to fetch the todos here
  // We'll use the API client to fetch todos
  const token = session?.session?.token || null;

  // Since we can't directly use the hook in a server component,
  // we'll fetch the data directly
  let todos: Todo[] = [];

  if (token) {
    try {
      // Fetch todos from the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store", // Disable caching for real-time data
      });

      if (response.ok) {
        todos = await response.json();
      } else if (response.status === 401) {
        // If unauthorized, redirect to login (this will be handled by requireAuth)
        console.error("Unauthorized access - token may be invalid");
      } else {
        console.error("Failed to fetch todos:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  }

  // Split todos by completion status for display
  const incompleteTodos = todos.filter(todo => !todo.completed);
  const completeTodos = todos.filter(todo => todo.completed);

  // We'll render a client component that handles the actual data fetching
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

// Client component to handle the display of todos
function TodoListWrapper({ todos }: { todos: Todo[] }) {
  if (!todos || todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border-subtle bg-charcoal/50">
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
          No objectives found in database
        </p>
      </div>
    );
  }

  return (
    <TodoList todos={todos} />
  );
}
