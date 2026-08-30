import type { PantryUnit } from '../../api/types'
import { pantryPage, pantryScanPage } from '../../content/siteCopy'
import { PANTRY_UNITS } from '../../lib/pantryFormat'

export type ReviewIngredient = {
  key: string
  scanItemId: number
  ingredientId: number
  name: string
  quantity: string
  unit: PantryUnit
  confidence: number | null
  needsQuantityConfirmation: boolean
  included: boolean
}

type DetectedIngredientCardProps = {
  item: ReviewIngredient
  onChange: (key: string, patch: Partial<ReviewIngredient>) => void
}

export function DetectedIngredientCard({ item, onChange }: DetectedIngredientCardProps) {
  return (
    <article className="pantry-scan-item">
      <div className="pantry-scan-item__header">
        <label className="pantry-scan-item__include">
          <input
            type="checkbox"
            checked={item.included}
            onChange={(event) => onChange(item.key, { included: event.target.checked })}
          />
          <span className="pantry-scan-item__name">{item.name}</span>
        </label>
        {item.confidence != null ? (
          <span className="pantry-scan-item__confidence">
            {pantryScanPage.confidence(item.confidence)}
          </span>
        ) : null}
      </div>

      <div className="pantry-scan-item__fields">
        <label className="field">
          <span className="field__label">{pantryPage.quantityLabel}</span>
          <input
            className="field__input"
            type="number"
            min="0"
            step="0.01"
            value={item.quantity}
            disabled={!item.included}
            placeholder={item.needsQuantityConfirmation ? pantryScanPage.needsQuantity : undefined}
            onChange={(event) => onChange(item.key, { quantity: event.target.value })}
          />
        </label>

        <label className="field">
          <span className="field__label">{pantryPage.unitLabel}</span>
          <select
            className="field__input"
            value={item.unit}
            disabled={!item.included}
            onChange={(event) =>
              onChange(item.key, { unit: event.target.value as PantryUnit })
            }
          >
            {PANTRY_UNITS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </article>
  )
}
