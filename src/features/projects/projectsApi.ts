import { api } from '../../api/http'
import type { ActivityItem } from '../../types/activity'
import type { Project, ProjectInput, ProjectMember, ProjectRole } from '../../types/project'

type ProjectMembersResponse = {
  members?: ProjectMember[]
  items?: ProjectMember[]
}

export async function getProjects() {
  const { data } = await api.get<Project[]>('/projects')
  return data
}

export async function createProject(payload: ProjectInput) {
  const { data } = await api.post<Project>('/projects', payload)
  return data
}

export async function getProject(id: string) {
  const { data } = await api.get<Project>(`/projects/${id}`)
  return data
}

export async function updateProject(id: string, payload: Partial<ProjectInput>) {
  const { data } = await api.patch<Project>(`/projects/${id}`, payload)
  return data
}

export async function deleteProject(id: string) {
  await api.delete(`/projects/${id}`)
}

export async function getProjectMembers(projectId: string) {
  const { data } = await api.get<ProjectMembersResponse | ProjectMember[]>(`/projects/${projectId}/members`)

  if (Array.isArray(data)) {
    return data
  }

  return data.members ?? data.items ?? []
}

export async function addProjectMember(projectId: string, payload: { email: string; role: ProjectRole }) {
  const { data } = await api.post<ProjectMember>(`/projects/${projectId}/members`, payload)
  return data
}

export async function updateProjectMember(projectId: string, userId: string, payload: { role: ProjectRole }) {
  const { data } = await api.patch<ProjectMember>(`/projects/${projectId}/members/${userId}`, payload)
  return data
}

export async function removeProjectMember(projectId: string, userId: string) {
  await api.delete(`/projects/${projectId}/members/${userId}`)
}

export async function getProjectActivity(projectId: string) {
  const { data } = await api.get<ActivityItem[]>(`/projects/${projectId}/activity`)
  return data
}
