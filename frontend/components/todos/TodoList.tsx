import { type Todo } from "@/lib/types"
import { TodoItem } from "./TodoItem"

interface TodoListProps {
  todos: Todo[]
}

export function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border-subtle bg-charcoal/50 animate-fade-in">
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
          No objectives found in database
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {todos.map((todo, index) => (
        <div
          key={todo.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
        >
          <TodoItem todo={todo} />
        </div>
      ))}
    </div>
  )
}
