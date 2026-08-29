import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { RecipeSummary } from '../api/types'
import { recipesPage } from '../content/siteCopy'
import { useReducedMotion } from '../hooks/useReducedMotion'
import {
  formatDietLabel,
  formatCookTime,
  truncateText,
} from '../lib/recipeFormat'
import { hoverSpring } from '../motion/transitions'
import { RecipeStatsBar } from './recipes/RecipeStatsBar'

type RecipeCardProps = {
  recipe: RecipeSummary
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const reduced = useReducedMotion()
  const visibleTags = recipe.tags.slice(0, 3)
  const extraTagCount = Math.max(0, recipe.tags.length - visibleTags.length)

  return (
    <motion.article
      className="recipe-card"
      whileHover={reduced ? undefined : { y: -4 }}
      transition={hoverSpring}
    >
      <Link to={`/recipes/${recipe.id}`} className="recipe-card__link">
        <div className="recipe-card__media">
          <motion.img
            src={recipe.imageUrl}
            alt=""
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <div className="recipe-card__body">
          <div className="chip-row">
            <span className="chip">{recipe.categoryName}</span>
            <span className="chip chip--outline">{recipe.cuisineName}</span>
          </div>
          <h3 className="recipe-card__title">{recipe.title}</h3>
          <p className="recipe-card__description">
            {truncateText(recipe.description, 110)}
          </p>
          <RecipeStatsBar
            cookTimeMinutes={recipe.cookTimeMinutes}
            ingredientCount={recipe.ingredientCount}
            calories={recipe.calories}
          />
          <p className="recipe-card__meta">
            {formatDietLabel(recipe.diet)} · {recipe.difficulty} ·{' '}
            {formatCookTime(recipe.cookTimeMinutes)}
          </p>
          {visibleTags.length > 0 ? (
            <div className="chip-row recipe-card__tags">
              {visibleTags.map((tag) => (
                <span key={tag} className="chip chip--muted">
                  {tag}
                </span>
              ))}
              {extraTagCount > 0 ? (
                <span className="chip chip--muted">{recipesPage.moreTags(extraTagCount)}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </Link>
    </motion.article>
  )
}
