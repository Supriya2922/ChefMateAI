import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { useMotionVariants } from '../../hooks/useReducedMotion'
import { fadeIn, scaleIn } from '../../motion/variants'
import { modalBackdropTransition, modalDialogTransition } from '../../motion/transitions'

type AnimatedModalProps = {
  open: boolean
  onClose: () => void
  overlayClassName?: string
  dialogClassName: string
  dialogLabel?: string
  children: ReactNode
}

export function AnimatedModal({
  open,
  onClose,
  overlayClassName = 'pantry-overlay',
  dialogClassName,
  dialogLabel,
  children,
}: AnimatedModalProps) {
  const backdropVariants = useMotionVariants(fadeIn)
  const dialogVariants = useMotionVariants(scaleIn)

  useEffect(() => {
    if (!open) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={overlayClassName}
          role="presentation"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          transition={modalBackdropTransition}
          onClick={onClose}
        >
          <motion.div
            className={dialogClassName}
            role="dialog"
            aria-modal="true"
            aria-label={dialogLabel}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dialogVariants}
            transition={modalDialogTransition}
            onClick={(event) => event.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
