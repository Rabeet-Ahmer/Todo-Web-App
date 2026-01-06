"use server"

import { api } from '@/lib/api-client'
import type { Todo } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function createTodoAction(title: string, description?: string) {
    const todo = await api.post<Todo>('/todos', { title, description })
    revalidatePath('/todos')
    return todo
}

export async function toggleTodoAction(id: number, completed: boolean) {
    const todo = await api.patch<Todo>(`/todos/${id}`, { completed })
    revalidatePath('/todos')
    return todo
}

export async function deleteTodoAction(id: number) {
    await api.delete(`/todos/${id}`)
    revalidatePath('/todos')
}
