import { RegisterForm } from '../features/auth/RegisterForm'
import { usePageTitle } from '../hooks/usePageTitle'

export function RegisterPage() {
  usePageTitle('Register')
  return <RegisterForm />
}
