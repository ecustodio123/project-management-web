import { LoginForm } from '../features/auth/LoginForm'
import { usePageTitle } from '../hooks/usePageTitle'

export function LoginPage() {
  usePageTitle('Login')
  return <LoginForm />
}
