export type Project = {
  id: string
  name: string
  description?: string
  status?: 'active' | 'archived' | 'completed'
  createdAt?: string
  updatedAt?: string
}

export type ProjectInput = {
  name: string
  description?: string
}

export type ProjectMember = {
  userId: string
  name: string
  email: string
  role: 'owner' | 'manager' | 'member' | 'client'
}
