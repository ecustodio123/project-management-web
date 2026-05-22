import { api } from '../../api/http'
import type { TaskFile } from '../../types/file'

export async function getTaskFiles(taskId: string) {
  const { data } = await api.get<TaskFile[]>(`/tasks/${taskId}/files`)
  return data
}

export async function uploadTaskFile(taskId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post<TaskFile>(`/tasks/${taskId}/files`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export function getFileDownloadUrl(fileId: string) {
  return `${api.defaults.baseURL}/files/${fileId}/download`
}

export async function deleteFile(id: string) {
  await api.delete(`/files/${id}`)
}
