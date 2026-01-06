"use client";

import { type Todo } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { deleteTodoAction, toggleTodoAction } from "@/actions/todo.actions";
import { useOptimistic, useState } from "react";

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
    setOptimisticTodo(!optimisticTodo.completed);
    await toggleTodoAction(todo.id, !optimisticTodo.completed);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTodoAction(todo.id);
  };

  return (
    <Card className="border-border-subtle bg-charcoal hover:border-primary/50 transition-colors group">
      <CardContent className="p-4 flex items-center gap-4">
        <Checkbox
          checked={optimisticTodo.completed}
          onCheckedChange={handleToggle}
          className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "text-sm font-bold uppercase tracking-wider",
              optimisticTodo.completed ? "text-gray-500 line-through" : "text-white"
            )}>
              {optimisticTodo.title}
            </h3>
          </div>
          {optimisticTodo.description && (
            <p className="text-xs text-gray-400 font-mono line-clamp-1">
              {optimisticTodo.description}
            </p>
          )}
          <div className="text-[10px] text-gray-500 font-mono">
            ID: {optimisticTodo.id} | Created: {new Date(optimisticTodo.created_at).toLocaleDateString()}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-[10px] text-red-500 font-mono hover:text-red-300 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
