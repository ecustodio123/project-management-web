import { api } from '../../api/http'
import type { Comment, CommentInput } from '../../types/comment'

type TaskCommentsResponse = {
  comments?: Comment[]
  items?: Comment[]
}

export async function getTaskComments(taskId: string) {
  const { data } = await api.get<TaskCommentsResponse | Comment[]>(`/tasks/${taskId}/comments`)

  if (Array.isArray(data)) {
    return data
  }

  return data.comments ?? data.items ?? []
}

export async function createComment(taskId: string, payload: CommentInput) {
  const { data } = await api.post<Comment>(`/tasks/${taskId}/comments`, payload)
  return data
}

export async function deleteComment(id: string) {
  await api.delete(`/comments/${id}`)
}
