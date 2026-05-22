export type Task = {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  assigneeId?: string
  dueDate?: string
  createdAt?: string
  updatedAt?: string
}

export type TaskInput = {
  title: string
  description?: string
  status?: Task['status']
  assigneeId?: string
  dueDate?: string
}
