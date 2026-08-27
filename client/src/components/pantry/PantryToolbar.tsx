import { pantryPage } from '../../content/siteCopy'
import type { ExpiryStatus, PantryCategory } from '../../api/types'

type PantryToolbarProps = {
  search: string
  categoryId: number | ''
  expiryStatus: ExpiryStatus | ''
  categories: PantryCategory[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: number | '') => void
  onExpiryChange: (value: ExpiryStatus | '') => void
}

const EXPIRY_FILTERS: { value: ExpiryStatus | ''; label: string }[] = [
  { value: '', label: pantryPage.filters.all },
  { value: 'ExpiringSoon', label: pantryPage.filters.expiring },
  { value: 'Expired', label: pantryPage.filters.expired },
]

export function PantryToolbar({
  search,
  categoryId,
  expiryStatus,
  categories,
  onSearchChange,
  onCategoryChange,
  onExpiryChange,
}: PantryToolbarProps) {
  return (
    <div className="pantry-toolbar">
      <label className="field pantry-toolbar__search">
        <span className="field__label">{pantryPage.searchLabel}</span>
        <input
          className="field__input"
          type="search"
          value={search}
          placeholder={pantryPage.searchPlaceholder}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label className="field pantry-toolbar__category">
        <span className="field__label">{pantryPage.categoryLabel}</span>
        <select
          className="field__input"
          value={categoryId}
          onChange={(event) => {
            const next = event.target.value
            onCategoryChange(next === '' ? '' : Number(next))
          }}
        >
          <option value="">{pantryPage.allCategories}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="pantry-toolbar__expiry">
        <legend className="field__label">{pantryPage.expiryFilterLabel}</legend>
        <div className="chip-row">
          {EXPIRY_FILTERS.map((filter) => (
            <button
              key={filter.label}
              type="button"
              className={
                expiryStatus === filter.value
                  ? 'chip chip--selected'
                  : 'chip chip--outline'
              }
              onClick={() => onExpiryChange(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
