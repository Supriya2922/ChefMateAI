import { apiFetch } from './http'
import type {
  PantryCategory,
  PantryItem,
  PantryItemPayload,
  PantryListResponse,
  PantryQuery,
} from './types'

function pantryQueryString(params?: PantryQuery): string {
  if (!params) {
    return ''
  }

  const search = new URLSearchParams()
  const term = params.search?.trim()
  if (term) {
    search.set('search', term)
  }
  if (params.categoryId != null) {
    search.set('categoryId', String(params.categoryId))
  }
  if (params.expiryStatus) {
    search.set('expiryStatus', params.expiryStatus)
  }
  if (params.sort) {
    search.set('sort', params.sort)
  }

  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export function getPantryItems(params?: PantryQuery): Promise<PantryListResponse> {
  return apiFetch<PantryListResponse>(`/api/pantry${pantryQueryString(params)}`)
}

export function getPantryCategories(): Promise<PantryCategory[]> {
  return apiFetch<PantryCategory[]>('/api/pantry/categories')
}

export function getPantryItem(id: number): Promise<PantryItem> {
  return apiFetch<PantryItem>(`/api/pantry/${id}`)
}

export function createPantryItem(payload: PantryItemPayload): Promise<PantryItem> {
  return apiFetch<PantryItem>('/api/pantry', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updatePantryItem(id: number, payload: PantryItemPayload): Promise<PantryItem> {
  return apiFetch<PantryItem>(`/api/pantry/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function updatePantryQuantity(id: number, quantity: number): Promise<PantryItem> {
  return apiFetch<PantryItem>(`/api/pantry/${id}/quantity`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  })
}

export function deletePantryItem(id: number): Promise<void> {
  return apiFetch<void>(`/api/pantry/${id}`, {
    method: 'DELETE',
  })
}
