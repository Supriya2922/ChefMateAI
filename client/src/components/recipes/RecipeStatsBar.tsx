import { recipesPage, recipeDetailPage } from '../../content/siteCopy'
import { formatCalories, formatCookTime } from '../../lib/recipeFormat'

type RecipeStatsBarProps = {
  cookTimeMinutes: number
  ingredientCount: number
  calories: number
  difficulty?: string
  mealType?: string
  diet?: string
  variant?: 'card' | 'detail'
}

type StatItem = {
  key: string
  label: string
  value: string
  tone: 'sage' | 'terracotta' | 'ink'
}

export function RecipeStatsBar({
  cookTimeMinutes,
  ingredientCount,
  calories,
  difficulty,
  mealType,
  diet,
  variant = 'card',
}: RecipeStatsBarProps) {
  const items: StatItem[] = [
    {
      key: 'time',
      label: variant === 'detail' ? recipeDetailPage.cookTime : recipesPage.cookTime,
      value: formatCookTime(cookTimeMinutes),
      tone: 'sage',
    },
    {
      key: 'ingredients',
      label:
        variant === 'detail' ? recipeDetailPage.ingredientCount : recipesPage.ingredients,
      value: String(ingredientCount),
      tone: 'terracotta',
    },
    {
      key: 'calories',
      label: variant === 'detail' ? recipeDetailPage.calories : recipesPage.calories,
      value: formatCalories(calories),
      tone: 'ink',
    },
  ]

  if (variant === 'detail') {
    if (difficulty) {
      items.push({
        key: 'difficulty',
        label: recipeDetailPage.difficulty,
        value: difficulty,
        tone: 'sage',
      })
    }
    if (mealType) {
      items.push({
        key: 'meal',
        label: recipeDetailPage.mealType,
        value: mealType,
        tone: 'terracotta',
      })
    }
    if (diet) {
      items.push({
        key: 'diet',
        label: recipeDetailPage.diet,
        value: diet,
        tone: 'ink',
      })
    }
  }

  return (
    <ul className={`recipe-stats recipe-stats--${variant}`} aria-label="Recipe stats">
      {items.map((item) => (
        <li key={item.key} className={`recipe-stats__item recipe-stats__item--${item.tone}`}>
          <span className="recipe-stats__icon" aria-hidden="true" />
          <span className="recipe-stats__copy">
            <span className="recipe-stats__label">{item.label}</span>
            <span className="recipe-stats__value">{item.value}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
