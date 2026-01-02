import { type Todo } from "@/lib/validations/todo.schema"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface TodoItemProps {
  todo: Todo
}

const priorityColors = {
  LOW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  HIGH: "bg-primary/10 text-primary border-primary/20",
}

export function TodoItem({ todo }: TodoItemProps) {
  return (
    <Card className="border-border-subtle bg-charcoal hover:border-primary/50 transition-colors group">
      <CardContent className="p-4 flex items-center gap-4">
        <Checkbox
          checked={todo.is_completed}
          className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "text-sm font-bold uppercase tracking-wider",
              todo.is_completed ? "text-gray-500 line-through" : "text-white"
            )}>
              {todo.title}
            </h3>
            <Badge variant="outline" className={cn(
              "text-[10px] font-mono px-1 py-0 rounded-none",
              priorityColors[todo.priority]
            )}>
              {todo.priority}
            </Badge>
          </div>
          {todo.description && (
            <p className="text-xs text-gray-400 font-mono line-clamp-1">
              {todo.description}
            </p>
          )}
        </div>
        <div className="text-[10px] text-gray-500 font-mono hidden group-hover:block transition-all">
          ID: {todo.id.slice(0, 8)}
        </div>
      </CardContent>
    </Card>
  )
}
