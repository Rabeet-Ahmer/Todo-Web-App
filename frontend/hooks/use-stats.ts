import useSWR from 'swr'
import { api } from '@/lib/api-client'

export interface TodoStats {
  total: number
  pending: number
  completed: number
}

export function useStats() {
  const { data, error, mutate, isLoading } = useSWR<TodoStats>(
    '/users/me/todos/stats',
    (url: string) => api.get<TodoStats>(url),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Refresh stats every 30 seconds
    }
  )

  return {
    stats: data,
    isLoading,
    error,
    mutate,
  }
}
