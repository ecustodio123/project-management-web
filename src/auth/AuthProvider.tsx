import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getMe } from '../features/auth/authApi'
import type { AuthResponse, User } from '../types/auth'
import { AuthContext, type AuthContextValue } from './authContext'
import { tokenStorage } from './tokenStorage'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(() => tokenStorage.get())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function initializeAuth() {
      const storedToken = tokenStorage.get()

      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false)
        }
        return
      }

      try {
        const currentUser = await getMe()

        if (isMounted) {
          setToken(storedToken)
          setUser(currentUser)
        }
      } catch {
        tokenStorage.clear()

        if (isMounted) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      isMounted = false
    }
  }, [])

  const logout = useCallback(() => {
    tokenStorage.clear()
    setToken(null)
    setUser(null)
    queryClient.clear()
  }, [queryClient])

  const setSession = useCallback(
    async (auth: AuthResponse) => {
      tokenStorage.set(auth.access_token)
      setToken(auth.access_token)

      if (auth.user) {
        setUser(auth.user)
        queryClient.setQueryData(['auth', 'me'], auth.user)
        return
      }

      const currentUser = await getMe()
      setUser(currentUser)
      queryClient.setQueryData(['auth', 'me'], currentUser)
    },
    [queryClient],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      setSession,
      logout,
    }),
    [isLoading, logout, setSession, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
