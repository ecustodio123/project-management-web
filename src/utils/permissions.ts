import type { ProjectRole } from '../types/project'

export function canWriteProjectContent(role?: ProjectRole | string) {
  return role === 'OWNER' || role === 'ADMIN' || role === 'MEMBER'
}

export function canManageProject(role?: ProjectRole | string) {
  return role === 'OWNER' || role === 'ADMIN'
}

export function canDeleteProject(role?: ProjectRole | string) {
  return role === 'OWNER'
}

export function canUpdateMemberRoles(role?: ProjectRole | string) {
  return role === 'OWNER'
}
