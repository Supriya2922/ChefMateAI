import type { RecipeIngredient } from '../../api/types'
import { recipeDetailPage } from '../../content/siteCopy'

type RecipeIngredientsListProps = {
  ingredients: RecipeIngredient[]
}

export function RecipeIngredientsList({ ingredients }: RecipeIngredientsListProps) {
  return (
    <section className="recipe-ingredients" aria-labelledby="recipe-ingredients-heading">
      <h2 id="recipe-ingredients-heading" className="recipe-detail__section-title">
        {recipeDetailPage.ingredients}
      </h2>
      <ol className="recipe-ingredients__list">
        {ingredients.map((ingredient, index) => (
          <li key={`${ingredient.name}-${index}`} className="recipe-ingredients__item">
            <span className="recipe-ingredients__number" aria-hidden="true">
              {index + 1}
            </span>
            <span className="recipe-ingredients__text">
              {ingredient.quantity ? (
                <>
                  <strong>{ingredient.quantity}</strong> {ingredient.name}
                </>
              ) : (
                ingredient.name
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
