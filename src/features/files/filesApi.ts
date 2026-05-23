import { api } from '../../api/http'
import type { TaskFile } from '../../types/file'

type TaskFilesResponse = {
  files?: TaskFile[]
  items?: TaskFile[]
}

type DownloadUrlResponse = {
  url?: string
  downloadUrl?: string
  signedUrl?: string
}

export type FileDownloadResult =
  | {
      type: 'blob'
      blob: Blob
      filename?: string
    }
  | {
      type: 'url'
      url: string
    }

export async function getTaskFiles(taskId: string) {
  const { data } = await api.get<TaskFilesResponse | TaskFile[]>(`/tasks/${taskId}/files`)

  if (Array.isArray(data)) {
    return data
  }

  return data.files ?? data.items ?? []
}

export async function uploadTaskFile(taskId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post<TaskFile>(`/tasks/${taskId}/files`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export function getFileDownloadUrl(fileId: string) {
  return `${api.defaults.baseURL}/files/${fileId}/download`
}

export async function downloadFile(id: string): Promise<FileDownloadResult> {
  const response = await api.get<Blob>(`/files/${id}/download`, {
    responseType: 'blob',
  })

  const contentTypeHeader = response.headers['content-type']
  const contentType = typeof contentTypeHeader === 'string' ? contentTypeHeader : response.data.type

  if (isTextResponse(contentType)) {
    const text = (await response.data.text()).trim()
    const parsedUrl = parseDownloadUrl(text)

    if (parsedUrl) {
      return { type: 'url', url: parsedUrl }
    }

    throw new Error(text || 'The download endpoint returned a text response instead of a file.')
  }

  return {
    type: 'blob',
    blob: response.data,
    filename: getFilenameFromContentDisposition(response.headers['content-disposition']),
  }
}

export async function deleteFile(id: string) {
  await api.delete(`/files/${id}`)
}

function isTextResponse(contentType: string) {
  return (
    contentType.includes('application/json') ||
    contentType.includes('text/plain') ||
    contentType.includes('text/html')
  )
}

function parseDownloadUrl(text: string) {
  if (isHttpUrl(text)) {
    return text
  }

  try {
    const payload = JSON.parse(text) as DownloadUrlResponse
    const url = payload.downloadUrl ?? payload.signedUrl ?? payload.url
    return url && isHttpUrl(url) ? url : undefined
  } catch {
    return undefined
  }
}

function isHttpUrl(value: string) {
  return value.startsWith('http://') || value.startsWith('https://')
}

function getFilenameFromContentDisposition(value?: string | null) {
  if (!value || typeof value !== 'string') return undefined

  const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1])
  }

  const filenameMatch = value.match(/filename="?([^"]+)"?/i)
  return filenameMatch?.[1]
}
