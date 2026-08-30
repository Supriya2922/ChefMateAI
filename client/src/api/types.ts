export type DietaryPreference = 'Vegetarian' | 'NonVegetarian' | 'Vegan'

export type CookingSkill = 'Beginner' | 'Intermediate' | 'Advanced'

export type AuthResponse = {
  token: string
  email: string
  displayName: string
}

export type Profile = {
  displayName: string
  email: string
  phoneNumber: string | null
  dietaryPreference: DietaryPreference | null
  cookingSkill: CookingSkill | null
  householdSize: number | null
  allergies: string[]
  cuisines: string[]
}

export type CatalogItem = {
  id: number
  name: string
}

export type RegisterPayload = {
  email: string
  password: string
  displayName: string
  phoneNumber?: string
}

export type UpdateProfilePayload = {
  dietaryPreference: DietaryPreference
  cookingSkill: CookingSkill
  householdSize: number
  allergies: string[]
  cuisines: string[]
}

export type PantryUnit =
  | 'Piece'
  | 'Gram'
  | 'Kilogram'
  | 'Milliliter'
  | 'Liter'
  | 'Bunch'
  | 'Pack'
  | 'Cup'
  | 'Tablespoon'
  | 'Teaspoon'

export type ExpiryStatus = 'None' | 'Fresh' | 'ExpiringSoon' | 'Expired'

export type PantryCategory = {
  id: number
  name: string
}

export type PantryItemSource = 'Manual' | 'PantryScan'

export type PantryItem = {
  id: number
  ingredientId: number | null
  name: string
  quantity: number
  unit: PantryUnit
  category: PantryCategory
  expiryDate: string | null
  expiryStatus: ExpiryStatus
  daysUntilExpiry: number | null
  source: PantryItemSource
  createdAt: string
  updatedAt: string
}

export type PantrySummary = {
  totalCount: number
  expiringSoonCount: number
  expiredCount: number
}

export type PantryListResponse = {
  items: PantryItem[]
  summary: PantrySummary
}

export type PantryQuery = {
  search?: string
  categoryId?: number
  expiryStatus?: ExpiryStatus
  sort?: string
}

export type PantryItemPayload = {
  name: string
  quantity: number
  unit: PantryUnit
  categoryName: string
  expiryDate?: string | null
}

export type PantryScanStatus = 'Processing' | 'Completed' | 'Failed'

export type PantryScanDetectedItem = {
  id: number
  ingredientId: number | null
  name: string
  quantity: number | null
  unit: string | null
  confidence: number | null
  needsQuantityConfirmation: boolean
}

export type PantryScanResponse = {
  scanId: number
  status: PantryScanStatus
  items: PantryScanDetectedItem[]
}

export type ConfirmPantryScanItemPayload = {
  ingredientId: number
  quantity: number
  unit: PantryUnit
}

export type ConfirmPantryScanPayload = {
  items: ConfirmPantryScanItemPayload[]
}

export type ConfirmPantryScanResponse = {
  addedOrUpdatedCount: number
  items: PantryItem[]
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert'

export type RecipeDiet = 'Vegetarian' | 'NonVegetarian'

export type RecipeDifficulty = 'Easy' | 'Medium' | 'Hard'

export type RecipeSummary = {
  id: number
  title: string
  description: string
  imageUrl: string
  cuisineName: string
  categoryName: string
  mealType: MealType
  diet: RecipeDiet
  difficulty: RecipeDifficulty
  cookTimeMinutes: number
  calories: number
  ingredientCount: number
  tags: string[]
}

export type RecipeIngredient = {
  name: string
  quantity: string
}

export type RecipeDetail = {
  id: number
  externalId: string
  title: string
  description: string
  instructions: string
  imageUrl: string
  cuisineName: string
  categoryName: string
  mealType: MealType
  diet: RecipeDiet
  difficulty: RecipeDifficulty
  cookTimeMinutes: number
  calories: number
  youtubeUrl: string | null
  source: string
  isAiGenerated: boolean
  ingredients: RecipeIngredient[]
  tags: string[]
}

export type RecipeListResponse = {
  items: RecipeSummary[]
}

export type RecipeFiltersResponse = {
  cuisines: string[]
}

export type RecipeQuery = {
  search?: string
  cuisine?: string
  diet?: RecipeDiet
  difficulty?: RecipeDifficulty
}
