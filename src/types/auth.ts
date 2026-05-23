export type User = {
  id: string
  email: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export type AuthResponse = {
  access_token: string
  user: User
}

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  name: string
  email: string
  password: string
}
