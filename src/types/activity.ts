import type { User } from './auth'
import type { Project } from './project'

export type ActivityAction =
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_DELETED'
  | 'MEMBER_ADDED'
  | 'MEMBER_REMOVED'
  | 'MEMBER_ROLE_UPDATED'
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_DELETED'
  | 'COMMENT_CREATED'
  | 'COMMENT_DELETED'
  | 'FILE_UPLOADED'
  | 'FILE_DELETED'

export type ActivityMetadata = Record<string, unknown> | null

export type ActivityItem = {
  id: string
  action: ActivityAction
  entityType: string
  entityId: string
  message: string
  metadata: ActivityMetadata
  projectId: string
  project?: Project
  userId: string
  user?: User
  createdAt: string
}
