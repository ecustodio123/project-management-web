import type { User } from './auth'
import type { Task } from './task'

export type Comment = {
  id: string
  content: string
  taskId: string
  task?: Task
  userId: string
  user?: User
  createdAt?: string
  updatedAt?: string
}

export type CommentInput = {
  content: string
}
