/**
 * FastAPI backend API client.
 *
 * Handles communication between Next.js frontend and FastAPI backend.
 * Automatically includes JWT token from Better Auth session in Authorization headers.
 */

import { getAuthToken } from './auth-client'
import { Todo, ApiError } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Base API request function with JWT authentication.
 *
 * @param endpoint - API endpoint path (e.g., '/api/v1/todos')
 * @param options - RequestInit options
 * @returns Promise with parsed JSON response
 * @throws Error on authentication or API failures
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('Not authenticated. Please login first.')
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error: ApiError = await response.json()

    // Handle authentication errors
    if (response.status === 401) {
      // Token invalid or expired
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('Session expired. Please login again.')
    }

    throw new Error(error.detail || 'API request failed')
  }

  return response.json()
}

/**
 * GET request helper.
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' })
}

/**
 * POST request helper.
 */
export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * PATCH request helper.
 */
export async function apiPatch<T>(endpoint: string, data: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

/**
 * DELETE request helper.
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' })
}

/**
 * PUT request helper.
 */
export async function apiPut<T>(endpoint: string, data: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * API client for Todo operations.
 */
export const todosApi = {
  /**
   * Get all todos for authenticated user.
   */
  fetchTodos: (skip = 0, limit = 100) =>
    apiGet<Todo[]>(`/api/v1/todos?skip=${skip}&limit=${limit}`),

  /**
   * Create a new todo.
   */
  createTodo: (data: { title: string; description?: string | null }) =>
    apiPost<Todo>('/api/v1/todos', data),

  /**
   * Get a specific todo by ID.
   */
  fetchTodoById: (id: number) =>
    apiGet<Todo>(`/api/v1/todos/${id}`),

  /**
   * Update a todo.
   */
  updateTodo: (id: number, data: Partial<Todo>) =>
    apiPut<Todo>(`/api/v1/todos/${id}`, data),

  /**
   * Delete a todo.
   */
  deleteTodo: (id: number) =>
    apiDelete<void>(`/api/v1/todos/${id}`),

  /**
   * Toggle todo completion status.
   */
  toggleCompletion: (id: number) =>
    apiPatch<Todo>(`/api/v1/todos/${id}/complete`, {}),
}
