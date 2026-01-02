/**
 * TodoList Server Component.
 *
 * Displays paginated list of todos for authenticated user.
 * This is a Server Component that fetches data directly.
 */

import { getAuthToken } from '@/lib/auth-client'
import { todosApi } from '@/lib/api-client'
import { Todo } from '@/lib/types'
import TodoItem from './TodoItem'

interface TodoListProps {
  initialTodos?: Todo[]
}

/**
 * Fetch todos from FastAPI.
 *
 * This function is called during Server Component rendering.
 */
async function fetchTodos(): Promise<Todo[]> {
  const token = await getAuthToken()

  if (!token) {
    // Redirect to login if not authenticated
    // In real app, this would be handled by middleware
    return []
  }

  try {
    return await todosApi.fetchTodos()
  } catch (error) {
    console.error('Failed to fetch todos:', error)
    return []
  }
}

/**
 * TodoList Server Component.
 *
 * This component fetches todos on the server and renders them.
 * Since it's a Server Component, it doesn't need 'use client'.
 */
export default async function TodoList({ initialTodos }: TodoListProps) {
  // Fetch todos on server (if not provided via props)
  const todos = initialTodos || await fetchTodos()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <span className="text-sm text-gray-500">
          {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks yet. Create one to get started!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  )
}
