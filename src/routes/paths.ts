export const paths = {
  login: '/login',
  register: '/register',
  projects: '/projects',
  projectDetail: (id: string) => `/projects/${id}`,
  taskDetail: (projectId: string, taskId: string) => `/projects/${projectId}/tasks/${taskId}`,
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
}
