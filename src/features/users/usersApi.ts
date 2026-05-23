import { api } from '../../api/http'
import type { User } from '../../types/auth'

export async function getUsers() {
  const { data } = await api.get<User[]>('/users')
  return data
}
