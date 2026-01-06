"use server"

import { requireAuth } from "@/actions/auth.actions"
import { issueBackendJwt } from "@/lib/backend-jwt"
import type { Todo } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function createTodoAction(formData: FormData) {
    const title = formData.get('title')
    const description = formData.get('description')
    const priority = formData.get('priority')

    if (typeof title !== 'string' || !title.trim()) {
        throw new Error('Title is required')
    }

    const payload: Partial<Todo> = {
        title: title.trim(),
        description: typeof description === 'string' && description.trim().length > 0
            ? description.trim()
            : undefined,
        priority:
            priority === "LOW" || priority === "MEDIUM" || priority === "HIGH"
                ? priority
                : "MEDIUM",
    }

    const session = await requireAuth()
    const userId = (session as any)?.user?.id as string | undefined

    if (!userId) {
        throw new Error("Authenticated session is missing user id")
    }

    const token = await issueBackendJwt(userId)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

    const response = await fetch(`${baseUrl}/todos`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        throw new Error(`Failed to create todo: ${await response.text()}`)
    }

    const todo = await response.json() as Todo
    revalidatePath('/dashboard/todos')
    revalidatePath('/dashboard')
    return todo
}

export async function toggleTodoAction(id: number, completed: boolean) {
    const session = await requireAuth()
    const userId = (session as any)?.user?.id as string | undefined

    if (!userId) {
        throw new Error("Authenticated session is missing user id")
    }

    const token = await issueBackendJwt(userId)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

    const response = await fetch(`${baseUrl}/todos/${id}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
    })

    if (!response.ok) {
        throw new Error(`Failed to update todo: ${await response.text()}`)
    }

    const todo = await response.json() as Todo
    revalidatePath('/dashboard/todos')
    revalidatePath('/dashboard')
    return todo
}

export async function deleteTodoAction(id: number) {
    const session = await requireAuth()
    const userId = (session as any)?.user?.id as string | undefined

    if (!userId) {
        throw new Error("Authenticated session is missing user id")
    }

    const token = await issueBackendJwt(userId)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

    const response = await fetch(`${baseUrl}/todos/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to delete todo: ${await response.text()}`)
    }
    revalidatePath('/dashboard/todos')
    revalidatePath('/dashboard')
}
