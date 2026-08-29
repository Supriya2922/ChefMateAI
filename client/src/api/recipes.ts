import { apiFetch } from './http'
import type {
  RecipeDetail,
  RecipeFiltersResponse,
  RecipeListResponse,
  RecipeQuery,
} from './types'

function recipeQueryString(params?: RecipeQuery): string {
  if (!params) {
    return ''
  }

  const search = new URLSearchParams()
  const term = params.search?.trim()
  if (term) {
    search.set('search', term)
  }
  if (params.cuisine) {
    search.set('cuisine', params.cuisine)
  }
  if (params.diet) {
    search.set('diet', params.diet)
  }
  if (params.difficulty) {
    search.set('difficulty', params.difficulty)
  }

  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export function getRecipes(params?: RecipeQuery): Promise<RecipeListResponse> {
  return apiFetch<RecipeListResponse>(`/api/recipes${recipeQueryString(params)}`)
}

export function getRecipe(id: number): Promise<RecipeDetail> {
  return apiFetch<RecipeDetail>(`/api/recipes/${id}`)
}

export function getRecipeFilters(): Promise<RecipeFiltersResponse> {
  return apiFetch<RecipeFiltersResponse>('/api/recipes/filters')
}
