const TOKEN_KEY = 'chefmate.token'

export class ApiError extends Error {
  readonly status: number
  readonly errors: string[]

  constructor(status: number, errors: string[]) {
    super(errors[0] ?? 'Something went wrong.')
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

function apiBase(): string {
  const base = import.meta.env.VITE_API_URL as string | undefined
  if (!base) {
    throw new Error('VITE_API_URL is not set. Copy client/.env.example to client/.env.')
  }
  return base.replace(/\/$/, '')
}

function readErrors(body: unknown): string[] {
  if (!body || typeof body !== 'object') {
    return ['Something went wrong.']
  }

  const record = body as Record<string, unknown>
  const errors = record.errors

  if (Array.isArray(errors)) {
    return errors.filter((item): item is string => typeof item === 'string')
  }

  if (errors && typeof errors === 'object') {
    return Object.values(errors as Record<string, unknown>)
      .flat()
      .filter((item): item is string => typeof item === 'string')
  }

  if (typeof record.title === 'string') {
    return [record.title]
  }

  return ['Something went wrong.']
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')

  if (init.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  const data = text ? (JSON.parse(text) as unknown) : null

  if (!response.ok) {
    throw new ApiError(response.status, readErrors(data))
  }

  return data as T
}

export async function apiFetchForm<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken()
  const headers = new Headers()
  headers.set('Accept', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${apiBase()}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  const text = await response.text()
  const data = text ? (JSON.parse(text) as unknown) : null

  if (!response.ok) {
    throw new ApiError(response.status, readErrors(data))
  }

  return data as T
}
