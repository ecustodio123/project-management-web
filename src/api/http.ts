import axios from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  if (config.headers.Authorization) {
    return config
  }

  try {
    const session = await fetchAuthSession()
    const accessToken = session.tokens?.accessToken?.toString()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    console.log('ACCESS TOKEN SENT:', accessToken);
  } catch {
    // No active Cognito session.
  }

  return config
})