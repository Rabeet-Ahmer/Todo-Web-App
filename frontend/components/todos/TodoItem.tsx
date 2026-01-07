"use client";

import { type Todo } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { deleteTodoAction, toggleTodoAction } from "@/actions/todo.actions";
import { startTransition, useOptimistic, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [optimisticTodo, setOptimisticTodo] = useOptimistic(todo, (current, completed: boolean) => ({
    ...current,
    completed
  }));

  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    const nextCompleted = !optimisticTodo.completed;

    // React 19: optimistic updates must be inside a transition or action
    startTransition(() => {
      setOptimisticTodo(nextCompleted);
    });

    await toggleTodoAction(todo.id, nextCompleted);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTodoAction(todo.id);
  };

  return (
    <Card className="border-border-subtle bg-charcoal transition-all-fast hover:border-primary/40 animate-scale-in">
      <CardContent className="p-4 flex items-center gap-4">
        <Checkbox
          checked={optimisticTodo.completed}
          onCheckedChange={handleToggle}
          className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all-fast"
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "text-sm font-bold uppercase tracking-wider transition-all-fast",
              optimisticTodo.completed ? "text-gray-500 line-through" : "text-white"
            )}>
              {optimisticTodo.title}
            </h3>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-mono px-2 py-0.5 rounded-none uppercase tracking-widest transition-colors",
                optimisticTodo.priority === "HIGH"
                  ? "border-primary text-primary"
                  : optimisticTodo.priority === "MEDIUM"
                  ? "border-yellow-500 text-yellow-400"
                  : "border-blue-500 text-blue-400"
              )}
            >
              {optimisticTodo.priority}
            </Badge>
          </div>
          {optimisticTodo.description && (
            <p className="text-xs text-gray-400 font-mono line-clamp-1">
              {optimisticTodo.description}
            </p>
          )}
          <div className="text-[10px] text-gray-500 font-mono">
            ID: {optimisticTodo.id} | {new Date(optimisticTodo.created_at).toISOString().slice(0, 10)}
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50 transition-all-fast rounded-sm"
          aria-label="Delete todo"
        >
          <Trash2 className="size-4" />
        </button>
      </CardContent>
    </Card>
  )
}
