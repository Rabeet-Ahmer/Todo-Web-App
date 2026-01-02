/**
 * TodoItem Component.
 *
 * Displays a single todo with completion status.
 * This is a Server Component by default.
 */

import { Todo } from '@/lib/types'

interface TodoItemProps {
  todo: Todo
  onToggle?: () => void
}

/**
 * TodoItem Server Component.
 *
 * Renders a single todo item with checkbox and details.
 */
export default function TodoItem({ todo }: TodoItemProps) {
  return (
    <li className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex-shrink-0">
        <input
          type="checkbox"
          checked={todo.is_completed}
          disabled
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-not-allowed opacity-50"
          aria-label={`Mark "${todo.title}" as ${todo.is_completed ? 'incomplete' : 'complete'}`}
        />
      </div>

      <div className="flex-grow min-w-0">
        <h3 className={`text-lg font-medium ${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {todo.title}
        </h3>

        {todo.description && (
          <p className={`mt-1 text-sm ${todo.is_completed ? 'text-gray-400' : 'text-gray-600'}`}>
            {todo.description}
          </p>
        )}

        <p className="mt-2 text-xs text-gray-400">
          Created: {new Date(todo.created_at).toLocaleDateString()}
          {todo.updated_at !== todo.created_at && ` • Updated: ${new Date(todo.updated_at).toLocaleDateString()}`}
        </p>
      </div>
    </li>
  )
}
