import type { User } from './auth'

export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'

export type Project = {
  id: string
  name: string
  description: string | null
  ownerId: string
  owner?: User
  members?: ProjectMember[]
  tasks?: unknown[]
  createdAt: string
  updatedAt: string
}

export type ProjectInput = {
  name: string
  description?: string | null
}

export type ProjectMember = {
  id: string
  userId: string
  projectId: string
  role: ProjectRole
  user?: User
  project?: Project
  createdAt: string
  updatedAt: string
}
