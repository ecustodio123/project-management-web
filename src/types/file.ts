import type { User } from './auth'
import type { Task } from './task'

export type TaskFile = {
  id: string
  originalName: string
  filename: string
  path: string
  mimeType: string
  size: number
  taskId: string
  task?: Task
  uploadedById: string
  uploadedBy?: User
  createdAt: string
  updatedAt: string
}
