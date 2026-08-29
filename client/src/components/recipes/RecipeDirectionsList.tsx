import { recipeDetailPage } from '../../content/siteCopy'

type RecipeDirectionsListProps = {
  steps: string[]
}

export function RecipeDirectionsList({ steps }: RecipeDirectionsListProps) {
  return (
    <section className="recipe-directions" aria-labelledby="recipe-directions-heading">
      <h2 id="recipe-directions-heading" className="recipe-detail__section-title recipe-detail__section-title--accent">
        {recipeDetailPage.directions}
      </h2>
      <ol className="recipe-directions__list">
        {steps.map((step, index) => (
          <li
            key={`step-${index}`}
            className={
              index === 0
                ? 'recipe-directions__item recipe-directions__item--active'
                : 'recipe-directions__item'
            }
          >
            <span className="recipe-directions__marker" aria-hidden="true">
              {index === 0 ? '✓' : index + 1}
            </span>
            <p className="recipe-directions__text">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
