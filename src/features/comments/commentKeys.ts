export const commentKeys = {
  byTask: (taskId: string) => ['tasks', taskId, 'comments'] as const,
}
