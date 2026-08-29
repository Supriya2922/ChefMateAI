import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { getRecipeFilters, getRecipes } from '../api/recipes'
import { ApiError } from '../api/http'
import type { RecipeDiet, RecipeDifficulty, RecipeSummary } from '../api/types'
import { FormError } from '../components/AuthLayout'
import { RecipeCard } from '../components/RecipeCard'
import { PageIntro, PageIntroTitle } from '../components/motion/PageIntro'
import { StaggerGrid } from '../components/motion/StaggerGrid'
import { RecipeToolbar } from '../components/recipes/RecipeToolbar'
import { recipesPage, recipesSection } from '../content/siteCopy'
import { useMotionVariants } from '../hooks/useReducedMotion'
import { fadeIn } from '../motion/variants'
import { pageTransition } from '../motion/transitions'

export function RecipesPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [diet, setDiet] = useState<RecipeDiet | ''>('')
  const [difficulty, setDifficulty] = useState<RecipeDifficulty | ''>('')
  const [cuisines, setCuisines] = useState<string[]>([])
  const [items, setItems] = useState<RecipeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])

  const contentVariants = useMotionVariants(fadeIn)
  const filtersActive = Boolean(search || cuisine || diet || difficulty)

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(searchInput.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [searchInput])

  const load = useCallback(async () => {
    setErrors([])
    try {
      const [recipes, filters] = await Promise.all([
        getRecipes({
          search: search || undefined,
          cuisine: cuisine || undefined,
          diet: diet || undefined,
          difficulty: difficulty || undefined,
        }),
        getRecipeFilters(),
      ])
      setItems(recipes.items)
      setCuisines(filters.cuisines)
    } catch (error) {
      setErrors(error instanceof ApiError ? error.errors : [recipesPage.loadError])
    } finally {
      setLoading(false)
    }
  }, [search, cuisine, diet, difficulty])

  useEffect(() => {
    void load()
  }, [load])

  function clearFilters() {
    setSearchInput('')
    setSearch('')
    setCuisine('')
    setDiet('')
    setDifficulty('')
  }

  const contentKey = loading
    ? 'loading'
    : errors.length > 0 && items.length === 0
      ? 'error'
      : items.length === 0
        ? 'empty'
        : 'list'

  return (
    <main className="page">
      <PageIntro
        eyebrow={recipesSection.eyebrow}
        title={<PageIntroTitle>{recipesSection.title}</PageIntroTitle>}
        lede={recipesSection.lede}
      />

      <div className="panel recipe-panel">
        <RecipeToolbar
          search={searchInput}
          cuisine={cuisine}
          diet={diet}
          difficulty={difficulty}
          cuisines={cuisines}
          onSearchChange={setSearchInput}
          onCuisineChange={setCuisine}
          onDietChange={setDiet}
          onDifficultyChange={setDifficulty}
        />

        <FormError messages={errors} />

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
              <p className="recipe-status">{recipesPage.loading}</p>
            ) : errors.length > 0 && items.length === 0 ? (
              <button
                type="button"
                className="btn btn--ghost btn--inline"
                onClick={() => void load()}
              >
                {recipesPage.retry}
              </button>
            ) : items.length === 0 ? (
              <div className="recipe-empty">
                <h2 className="recipe-empty__title">{recipesPage.emptyTitle}</h2>
                <p className="recipe-empty__lede">{recipesPage.emptyLede}</p>
                {filtersActive ? (
                  <button
                    type="button"
                    className="btn btn--ghost btn--inline"
                    onClick={clearFilters}
                  >
                    {recipesPage.clearFilters}
                  </button>
                ) : null}
              </div>
            ) : (
              <StaggerGrid className="recipe-grid" aria-label={recipesSection.title}>
                {items.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </StaggerGrid>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
