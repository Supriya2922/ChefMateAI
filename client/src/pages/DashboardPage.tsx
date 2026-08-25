import { useAuth } from '../auth/AuthContext'
import { RecipeCard } from '../components/RecipeCard'
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
        <p className="page__lede">
          A few ideas for tonight. Recipes will follow your taste once we know it.
        </p>
      </header>

      <section className="recipe-grid" aria-label="Suggested recipes">
        {placeholderRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </section>
    </main>
  )
}
