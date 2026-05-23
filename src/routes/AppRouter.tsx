import { Navigate, createBrowserRouter } from 'react-router'
import { AppLayout } from '../layouts/AppLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { LoginPage } from '../pages/LoginPage'
import { ProjectDetailPage } from '../pages/ProjectDetailPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { paths } from './paths'

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: paths.login, element: <LoginPage /> },
          { path: paths.register, element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to={paths.projects} replace /> },
          { path: paths.projects, element: <ProjectsPage /> },
          { path: '/projects/:projectId', element: <ProjectDetailPage /> },
          { path: '/projects/:projectId/tasks/:taskId', element: <ProjectDetailPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={paths.projects} replace /> },
])
