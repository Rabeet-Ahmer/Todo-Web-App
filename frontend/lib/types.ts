/** Shared TypeScript types between frontend and backend. */

export interface User {
  id: number
  email: string
  email_verified: boolean
  name?: string
  image?: string
  created_at: string
  updated_at: string
}

export interface Todo {
  id: number
  title: string
  description?: string | null
  is_completed: boolean
  user_id: number
  created_at: string
  updated_at: string
}

export interface ApiError {
  detail: string
  status_code: number
}

export interface PaginationParams {
  skip: number
  limit: number
}
