import { api } from '../../api/http'
import type { AuthResponse, LoginInput, RegisterInput, User } from '../../types/auth'

export async function login(payload: LoginInput) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function register(payload: RegisterInput) {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  return data
}

export async function getMe() {
  const { data } = await api.get<User>('/auth/me')
  return data
}
