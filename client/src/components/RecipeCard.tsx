import type { PlaceholderRecipe } from '../data/placeholderRecipes'

type RecipeCardProps = {
  recipe: PlaceholderRecipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <div className="recipe-card__media">
        <img src={recipe.imageUrl} alt={recipe.imageAlt} />
      </div>
      <div className="recipe-card__body">
        <span className="chip">{recipe.cuisine}</span>
        <h3 className="recipe-card__title">{recipe.title}</h3>
        <p className="recipe-card__meta">{recipe.cookTime}</p>
      </div>
    </article>
  )
}
