export const projectKeys = {
  all: ['projects'] as const,
  detail: (id: string) => ['projects', id] as const,
  members: (id: string) => ['projects', id, 'members'] as const,
  activity: (id: string) => ['projects', id, 'activity'] as const,
}
