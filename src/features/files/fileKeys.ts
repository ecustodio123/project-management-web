export const fileKeys = {
  byTask: (taskId: string) => ['tasks', taskId, 'files'] as const,
}
