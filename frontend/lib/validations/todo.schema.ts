import { z } from "zod"

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  is_completed: z.boolean().default(false),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  created_at: z.string(),
  updated_at: z.string(),
})

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
})

export const updateTodoSchema = createTodoSchema.partial().extend({
  is_completed: z.boolean().optional(),
})

export type Todo = z.infer<typeof todoSchema>
export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
