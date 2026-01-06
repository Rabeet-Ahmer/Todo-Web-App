import useSWR from 'swr'
import { api } from '@/lib/api-client'
import type { Todo } from '@/lib/types'

export function useTodos() {
    const { data, error, mutate, isLoading } = useSWR<Todo[]>(
        '/todos',
        (url: string) => api.get<Todo[]>(url),
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        }
    )

    return {
        todos: data,
        isLoading,
        error,
        mutate,
    }
}
