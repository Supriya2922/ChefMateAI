import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRecipes } from '../api/recipes'
import { useAuth } from '../auth/AuthContext'
import type { RecipeSummary } from '../api/types'
import { FeatureCard } from '../components/FeatureCard'
import { PageIntro, PageIntroTitle } from '../components/motion/PageIntro'
import { StaggerGrid } from '../components/motion/StaggerGrid'
import { RecipeCard } from '../components/RecipeCard'
import { dashboard } from '../content/siteCopy'
import { greetingForNow } from '../lib/format'

export function DashboardPage() {
  const { profile } = useAuth()
  const firstName = profile?.displayName.trim().split(/\s+/)[0] ?? 'there'
  const [recipes, setRecipes] = useState<RecipeSummary[]>([])

  useEffect(() => {
    let cancelled = false

    void getRecipes()
      .then((response) => {
        if (!cancelled) {
          setRecipes(response.items.slice(0, 6))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRecipes([])
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="page">
      <PageIntro
        eyebrow={greetingForNow()}
        title={<PageIntroTitle>{firstName}</PageIntroTitle>}
        lede={dashboard.lede}
      />

      <StaggerGrid className="feature-grid" aria-label="Kitchen shortcuts">
        {dashboard.quickActions.map((action) => (
          <FeatureCard
            key={action.to}
            title={action.title}
            description={action.description}
            to={action.to}
          />
        ))}
      </StaggerGrid>

      {recipes.length > 0 ? (
        <section className="recipe-grid-section" aria-label={dashboard.recipesHeading}>
          <div className="section-heading-row">
            <h2 className="section-heading">{dashboard.recipesHeading}</h2>
            <Link to="/recipes" className="section-heading-link">
              View all
            </Link>
          </div>
          <StaggerGrid className="recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </StaggerGrid>
        </section>
      ) : null}
    </main>
  )
}
