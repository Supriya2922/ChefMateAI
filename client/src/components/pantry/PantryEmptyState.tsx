import { motion } from 'framer-motion'
import { pantryPage } from '../../content/siteCopy'
import { useMotionVariants } from '../../hooks/useReducedMotion'
import { scaleIn } from '../../motion/variants'
import { pageTransition } from '../../motion/transitions'

type PantryEmptyStateProps = {
  filtered: boolean
  onAdd: () => void
  onClearFilters: () => void
}

export function PantryEmptyState({ filtered, onAdd, onClearFilters }: PantryEmptyStateProps) {
  const variants = useMotionVariants(scaleIn)

  if (filtered) {
    return (
      <motion.div
        className="pantry-empty"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={pageTransition}
      >
        <p className="pantry-empty__title">{pantryPage.noMatches}</p>
        <button type="button" className="btn btn--ghost btn--inline" onClick={onClearFilters}>
          {pantryPage.clearFilters}
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="pantry-empty"
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={pageTransition}
    >
      <p className="pantry-empty__title">{pantryPage.emptyTitle}</p>
      <p className="pantry-empty__lede">{pantryPage.emptyLede}</p>
      <button type="button" className="btn btn--primary btn--inline" onClick={onAdd}>
        {pantryPage.add}
      </button>
    </motion.div>
  )
}
