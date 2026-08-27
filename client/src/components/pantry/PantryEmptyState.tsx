import { pantryPage } from '../../content/siteCopy'

type PantryEmptyStateProps = {
  filtered: boolean
  onAdd: () => void
  onClearFilters: () => void
}

export function PantryEmptyState({ filtered, onAdd, onClearFilters }: PantryEmptyStateProps) {
  if (filtered) {
    return (
      <div className="pantry-empty">
        <p className="pantry-empty__title">{pantryPage.noMatches}</p>
        <button type="button" className="btn btn--ghost btn--inline" onClick={onClearFilters}>
          {pantryPage.clearFilters}
        </button>
      </div>
    )
  }

  return (
    <div className="pantry-empty">
      <p className="pantry-empty__title">{pantryPage.emptyTitle}</p>
      <p className="pantry-empty__lede">{pantryPage.emptyLede}</p>
      <button type="button" className="btn btn--primary btn--inline" onClick={onAdd}>
        {pantryPage.add}
      </button>
    </div>
  )
}
