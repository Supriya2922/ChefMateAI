import { useAuth } from '../auth/AuthContext'
import { FeatureCard } from '../components/FeatureCard'
import { RecipeCard } from '../components/RecipeCard'
import { dashboard } from '../content/siteCopy'
import { placeholderRecipes } from '../data/placeholderRecipes'
import { greetingForNow } from '../lib/format'

export function DashboardPage() {
  const { profile } = useAuth()
  const firstName = profile?.displayName.trim().split(/\s+/)[0] ?? 'there'

  return (
    <main className="page">
      <header className="page__intro">
        <p className="page__eyebrow">{greetingForNow()}</p>
        <h1 className="page__title">{firstName}</h1>
        <p className="page__lede">{dashboard.lede}</p>
      </header>

      <section className="feature-grid" aria-label="Kitchen shortcuts">
        {dashboard.quickActions.map((action) => (
          <FeatureCard
            key={action.to}
            title={action.title}
            description={action.description}
            to={action.to}
          />
        ))}
      </section>

      <section className="recipe-grid-section" aria-label={dashboard.recipesHeading}>
        <h2 className="section-heading">{dashboard.recipesHeading}</h2>
        <div className="recipe-grid">
          {placeholderRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </main>
  )
}
