import type { RecipeDiet } from '../api/types'

export function formatCookTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60

  if (remaining === 0) {
    return hours === 1 ? '1 hr' : `${hours} hr`
  }

  return `${hours} hr ${remaining} min`
}

export function formatDietLabel(diet: RecipeDiet): string {
  return diet === 'NonVegetarian' ? 'Non-Vegetarian' : diet
}

export function formatCalories(calories: number): string {
  return `${calories} kcal`
}

export function parseInstructionSteps(instructions: string): string[] {
  const normalized = instructions.replace(/\r\n/g, '\n').trim()

  if (!normalized) {
    return []
  }

  const stepSplit = normalized
    .split(/\n*\s*STEP\s*\d+\s*\n+/i)
    .map((part) => part.trim())
    .filter(Boolean)

  if (stepSplit.length > 1) {
    return stepSplit
  }

  const numbered = normalized
    .split(/\n+/)
    .map((line) => line.replace(/^\d+[\).\]]\s*/, '').trim())
    .filter(Boolean)

  if (numbered.length > 1) {
    return numbered
  }

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((part) => part.replace(/\n/g, ' ').trim())
    .filter(Boolean)

  return paragraphs.length > 0 ? paragraphs : [normalized]
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trimEnd()}…`
}
