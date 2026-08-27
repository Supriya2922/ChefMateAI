import { pantryPage } from '../../content/siteCopy'
import type { PantryItem } from '../../api/types'
import { expiryBadgeLabel, formatExpiryDate, formatQuantity } from '../../lib/pantryFormat'
import { QuantityStepper } from './QuantityStepper'

type PantryItemRowProps = {
  item: PantryItem
  confirming: boolean
  quantityBusy: boolean
  onEdit: () => void
  onAskDelete: () => void
  onCancelDelete: () => void
  onConfirmDelete: () => void
  onQuantityChange: (quantity: number) => void
}

export function PantryItemRow({
  item,
  confirming,
  quantityBusy,
  onEdit,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
  onQuantityChange,
}: PantryItemRowProps) {
  const badge = expiryBadgeLabel(item.expiryStatus, item.daysUntilExpiry)
  const badgeClass =
    item.expiryStatus === 'Expired'
      ? 'chip chip--danger'
      : item.expiryStatus === 'ExpiringSoon'
        ? 'chip chip--warning'
        : null

  return (
    <article className="pantry-row">
      <div className="pantry-row__main">
        <h2 className="pantry-row__name">{item.name}</h2>
        <p className="pantry-row__meta">
          <span>{formatQuantity(item.quantity, item.unit)}</span>
          <span>{item.category.name}</span>
          <span>{formatExpiryDate(item.expiryDate)}</span>
        </p>
        {badge && badgeClass ? <span className={badgeClass}>{badge}</span> : null}
      </div>

      {confirming ? (
        <div className="pantry-row__confirm">
          <p>{pantryPage.confirmDelete(item.name)}</p>
          <div className="pantry-row__actions">
            <button type="button" className="btn btn--text" onClick={onCancelDelete}>
              {pantryPage.keep}
            </button>
            <button type="button" className="btn btn--danger btn--inline" onClick={onConfirmDelete}>
              {pantryPage.confirmDeleteAction}
            </button>
          </div>
        </div>
      ) : (
        <div className="pantry-row__controls">
          <QuantityStepper
            quantity={item.quantity}
            disabled={quantityBusy}
            onChange={onQuantityChange}
            increaseLabel={pantryPage.increaseQuantity}
            decreaseLabel={pantryPage.decreaseQuantity}
          />
          <div className="pantry-row__actions">
            <button type="button" className="btn btn--ghost btn--inline" onClick={onEdit}>
              {pantryPage.edit}
            </button>
            <button type="button" className="btn btn--text" onClick={onAskDelete}>
              {pantryPage.delete}
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
