export const taskKeys = {
  byProject: (projectId: string) => ['projects', projectId, 'tasks'] as const,
  detail: (id: string) => ['tasks', id] as const,
}
