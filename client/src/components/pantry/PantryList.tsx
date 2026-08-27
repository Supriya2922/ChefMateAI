import type { PantryItem } from '../../api/types'
import { PantryItemRow } from './PantryItemRow'

type PantryListProps = {
  items: PantryItem[]
  confirmingId: number | null
  quantityBusyId: number | null
  onEdit: (item: PantryItem) => void
  onAskDelete: (id: number) => void
  onCancelDelete: () => void
  onConfirmDelete: (id: number) => void
  onQuantityChange: (item: PantryItem, quantity: number) => void
}

export function PantryList({
  items,
  confirmingId,
  quantityBusyId,
  onEdit,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
  onQuantityChange,
}: PantryListProps) {
  return (
    <div className="pantry-list">
      {items.map((item) => (
        <PantryItemRow
          key={item.id}
          item={item}
          confirming={confirmingId === item.id}
          quantityBusy={quantityBusyId === item.id}
          onEdit={() => onEdit(item)}
          onAskDelete={() => onAskDelete(item.id)}
          onCancelDelete={onCancelDelete}
          onConfirmDelete={() => onConfirmDelete(item.id)}
          onQuantityChange={(quantity) => onQuantityChange(item, quantity)}
        />
      ))}
    </div>
  )
}
