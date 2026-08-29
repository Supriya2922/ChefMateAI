import { AnimatePresence, motion } from 'framer-motion'
import type { PantryItem } from '../../api/types'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { staggerItem } from '../../motion/variants'
import { pageTransition } from '../../motion/transitions'
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
  const reduced = useReducedMotion()
  const itemVariants = reduced ? undefined : staggerItem
  const transition = reduced ? { duration: 0 } : pageTransition

  return (
    <div className="pantry-list">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout={!reduced}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -12 }}
            transition={transition}
          >
            <PantryItemRow
              item={item}
              confirming={confirmingId === item.id}
              quantityBusy={quantityBusyId === item.id}
              onEdit={() => onEdit(item)}
              onAskDelete={() => onAskDelete(item.id)}
              onCancelDelete={onCancelDelete}
              onConfirmDelete={() => onConfirmDelete(item.id)}
              onQuantityChange={(quantity) => onQuantityChange(item, quantity)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
