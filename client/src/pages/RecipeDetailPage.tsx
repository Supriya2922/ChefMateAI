import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRecipe } from '../api/recipes'
import { ApiError } from '../api/http'
import type { RecipeDetail } from '../api/types'
import { FormError } from '../components/AuthLayout'
import { PageIntro, PageIntroTitle } from '../components/motion/PageIntro'
import { RecipeDirectionsList } from '../components/recipes/RecipeDirectionsList'
import { RecipeIngredientsList } from '../components/recipes/RecipeIngredientsList'
import { RecipeStatsBar } from '../components/recipes/RecipeStatsBar'
import { recipeDetailPage } from '../content/siteCopy'
import { useMotionVariants } from '../hooks/useReducedMotion'
import { formatDietLabel, parseInstructionSteps } from '../lib/recipeFormat'
import { fadeIn } from '../motion/variants'
import { pageTransition } from '../motion/transitions'

export function RecipeDetailPage() {
  const { id } = useParams()
  const recipeId = Number(id)
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])
  const contentVariants = useMotionVariants(fadeIn)

  const load = useCallback(async () => {
    if (!Number.isFinite(recipeId) || recipeId <= 0) {
      setErrors([recipeDetailPage.notFound])
      setRecipe(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setErrors([])
    try {
      const next = await getRecipe(recipeId)
      setRecipe(next)
    } catch (error) {
      setRecipe(null)
      if (error instanceof ApiError && error.status === 404) {
        setErrors([recipeDetailPage.notFound])
      } else {
        setErrors(error instanceof ApiError ? error.errors : [recipeDetailPage.loadError])
      }
    } finally {
      setLoading(false)
    }
  }, [recipeId])

  useEffect(() => {
    void load()
  }, [load])

  const steps = useMemo(
    () => (recipe ? parseInstructionSteps(recipe.instructions) : []),
    [recipe],
  )

  const contentKey = loading ? 'loading' : recipe ? 'recipe' : 'error'

  return (
    <main className="page">
      <p className="page-back">
        <Link to="/recipes">{recipeDetailPage.backLabel}</Link>
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={contentKey}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={pageTransition}
        >
          {loading ? (
            <p className="recipe-status">{recipeDetailPage.loading}</p>
          ) : recipe ? (
            <article className="recipe-detail">
              <div className="recipe-detail__hero">
                <img src={recipe.imageUrl} alt="" className="recipe-detail__image" />
              </div>

              <PageIntro
                eyebrow={recipe.categoryName}
                title={<PageIntroTitle>{recipe.title}</PageIntroTitle>}
                lede={recipe.description}
              />

              <div className="panel recipe-detail__panel">
                <RecipeStatsBar
                  variant="detail"
                  cookTimeMinutes={recipe.cookTimeMinutes}
                  ingredientCount={recipe.ingredients.length}
                  calories={recipe.calories}
                  difficulty={recipe.difficulty}
                  mealType={recipe.mealType}
                  diet={formatDietLabel(recipe.diet)}
                />

                {recipe.tags.length > 0 ? (
                  <div className="chip-row recipe-detail__tags" aria-label="Recipe tags">
                    {recipe.tags.map((tag) => (
                      <span key={tag} className="chip chip--outline">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                {recipe.youtubeUrl ? (
                  <a
                    className="btn btn--primary btn--inline recipe-detail__video"
                    href={recipe.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {recipeDetailPage.watchVideo}
                  </a>
                ) : null}

                <div className="recipe-detail__columns">
                  <RecipeIngredientsList ingredients={recipe.ingredients} />
                  <RecipeDirectionsList steps={steps} />
                </div>
              </div>
            </article>
          ) : (
            <div className="recipe-empty">
              <FormError messages={errors} />
              <button
                type="button"
                className="btn btn--ghost btn--inline"
                onClick={() => void load()}
              >
                {recipeDetailPage.retry}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
