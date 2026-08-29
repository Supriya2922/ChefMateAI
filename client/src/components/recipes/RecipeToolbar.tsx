import { recipesPage } from '../../content/siteCopy'
import type { RecipeDiet, RecipeDifficulty } from '../../api/types'

type RecipeToolbarProps = {
  search: string
  cuisine: string
  diet: RecipeDiet | ''
  difficulty: RecipeDifficulty | ''
  cuisines: string[]
  onSearchChange: (value: string) => void
  onCuisineChange: (value: string) => void
  onDietChange: (value: RecipeDiet | '') => void
  onDifficultyChange: (value: RecipeDifficulty | '') => void
}

const DIET_OPTIONS: { value: RecipeDiet | ''; label: string }[] = [
  { value: '', label: recipesPage.allDiets },
  { value: 'Vegetarian', label: recipesPage.diets.Vegetarian },
  { value: 'NonVegetarian', label: recipesPage.diets.NonVegetarian },
]

const DIFFICULTY_OPTIONS: { value: RecipeDifficulty | ''; label: string }[] = [
  { value: '', label: recipesPage.allDifficulties },
  { value: 'Easy', label: recipesPage.difficulties.Easy },
  { value: 'Medium', label: recipesPage.difficulties.Medium },
  { value: 'Hard', label: recipesPage.difficulties.Hard },
]

export function RecipeToolbar({
  search,
  cuisine,
  diet,
  difficulty,
  cuisines,
  onSearchChange,
  onCuisineChange,
  onDietChange,
  onDifficultyChange,
}: RecipeToolbarProps) {
  return (
    <div className="recipe-toolbar">
      <label className="field recipe-toolbar__search">
        <span className="field__label">{recipesPage.searchLabel}</span>
        <input
          className="field__input"
          type="search"
          value={search}
          placeholder={recipesPage.searchPlaceholder}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label className="field recipe-toolbar__cuisine">
        <span className="field__label">{recipesPage.cuisineLabel}</span>
        <select
          className="field__input"
          value={cuisine}
          onChange={(event) => onCuisineChange(event.target.value)}
        >
          <option value="">{recipesPage.allCuisines}</option>
          {cuisines.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label className="field recipe-toolbar__diet">
        <span className="field__label">{recipesPage.dietLabel}</span>
        <select
          className="field__input"
          value={diet}
          onChange={(event) => onDietChange(event.target.value as RecipeDiet | '')}
        >
          {DIET_OPTIONS.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field recipe-toolbar__difficulty">
        <span className="field__label">{recipesPage.difficultyLabel}</span>
        <select
          className="field__input"
          value={difficulty}
          onChange={(event) =>
            onDifficultyChange(event.target.value as RecipeDifficulty | '')
          }
        >
          {DIFFICULTY_OPTIONS.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
