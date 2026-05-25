import { createContext, useContext } from 'react'
import type { User } from '../types/auth'

export type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  completeCognitoLogin: () => Promise<User>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}