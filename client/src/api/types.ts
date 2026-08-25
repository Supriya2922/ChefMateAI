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
