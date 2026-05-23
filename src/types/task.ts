import type { User } from './auth'
import type { Comment } from './comment'
import type { TaskFile } from './file'
import type { Project } from './project'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  projectId: string
  project?: Project
  assigneeId: string | null
  assignee?: User | null
  createdById: string
  createdBy?: User
  comments?: Comment[]
  files?: TaskFile[]
  createdAt: string
  updatedAt: string
}

export type TaskInput = {
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string | null
  dueDate?: string | null
}
