import axios from 'axios'

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    return typeof message === 'string' ? message : error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong'
}
