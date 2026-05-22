import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../auth/authContext'
import { paths } from './paths'

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={paths.projects} replace />
  }

  return <Outlet />
}
