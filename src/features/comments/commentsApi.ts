import { api } from '../../api/http'
import type { Comment, CommentInput } from '../../types/comment'

export async function getTaskComments(taskId: string) {
  const { data } = await api.get<Comment[]>(`/tasks/${taskId}/comments`)
  return data
}

export async function createComment(taskId: string, payload: CommentInput) {
  const { data } = await api.post<Comment>(`/tasks/${taskId}/comments`, payload)
  return data
}

export async function deleteComment(id: string) {
  await api.delete(`/comments/${id}`)
}
