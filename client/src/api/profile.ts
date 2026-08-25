import { apiFetch } from './http'
import type { CatalogItem, Profile, UpdateProfilePayload } from './types'

export function getProfile(): Promise<Profile> {
  return apiFetch<Profile>('/api/profile')
}

export function updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
  return apiFetch<Profile>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function getAllergies(): Promise<CatalogItem[]> {
  return apiFetch<CatalogItem[]>('/api/allergies')
}

export function getCuisines(): Promise<CatalogItem[]> {
  return apiFetch<CatalogItem[]>('/api/cuisines')
}
