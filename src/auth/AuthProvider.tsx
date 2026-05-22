import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState, type ReactNode } from 'react'
import { getMe } from '../features/auth/authApi'
import { AuthContext, type AuthContextValue } from './authContext'
import { tokenStorage } from './tokenStorage'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState(() => tokenStorage.get())

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    enabled: Boolean(token),
    retry: false,
  })

  const value = useMemo<AuthContextValue>(() => {
    const clearSession = () => {
      tokenStorage.clear()
      setToken(null)
      queryClient.clear()
    }

    return {
      user: meQuery.data ?? null,
      token,
      isAuthenticated: Boolean(token && meQuery.data),
      isLoading: Boolean(token && meQuery.isLoading),
      setSession: (auth) => {
        tokenStorage.set(auth.token)
        setToken(auth.token)
        queryClient.setQueryData(['auth', 'me'], auth.user)
      },
      logout: clearSession,
    }
  }, [meQuery.data, meQuery.isLoading, queryClient, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
