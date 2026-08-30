import { DetectedIngredientCard, type ReviewIngredient } from './DetectedIngredientCard'
import { pantryScanPage } from '../../content/siteCopy'

type DetectedIngredientsProps = {
  items: ReviewIngredient[]
  submitting: boolean
  onChange: (key: string, patch: Partial<ReviewIngredient>) => void
  onConfirm: () => void
}

export function DetectedIngredients({
  items,
  submitting,
  onChange,
  onConfirm,
}: DetectedIngredientsProps) {
  return (
    <section className="pantry-scan-review">
      <header className="pantry-scan-review__header">
        <h2 className="pantry-scan-review__title">{pantryScanPage.reviewTitle}</h2>
        <p className="pantry-scan-review__lede">{pantryScanPage.reviewLede}</p>
      </header>

      <div className="pantry-scan-review__list">
        {items.map((item) => (
          <DetectedIngredientCard key={item.key} item={item} onChange={onChange} />
        ))}
      </div>

      <button
        type="button"
        className="btn btn--primary"
        disabled={submitting}
        onClick={onConfirm}
      >
        {submitting ? pantryScanPage.confirming : pantryScanPage.addToPantry}
      </button>
    </section>
  )
}
