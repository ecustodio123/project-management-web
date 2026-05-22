export type Comment = {
  id: string
  taskId: string
  body: string
  authorName?: string
  createdAt?: string
}

export type CommentInput = {
  body: string
}
