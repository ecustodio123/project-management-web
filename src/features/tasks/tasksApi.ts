import { api } from '../../api/http'
import type { Task, TaskInput } from '../../types/task'

export async function getProjectTasks(projectId: string) {
  const { data } = await api.get<Task[]>(`/projects/${projectId}/tasks`)
  return data
}

export async function createTask(projectId: string, payload: TaskInput) {
  const { data } = await api.post<Task>(`/projects/${projectId}/tasks`, payload)
  return data
}

export async function getTask(id: string) {
  const { data } = await api.get<Task>(`/tasks/${id}`)
  return data
}

export async function updateTask(id: string, payload: Partial<TaskInput>) {
  const { data } = await api.patch<Task>(`/tasks/${id}`, payload)
  return data
}

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`)
}
