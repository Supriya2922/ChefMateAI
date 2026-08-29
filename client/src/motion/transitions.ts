import type { Transition } from 'framer-motion'

export const easeOut = [0.22, 1, 0.36, 1] as const

export const pageTransition: Transition = {
  duration: 0.35,
  ease: easeOut,
}

export const modalBackdropTransition: Transition = {
  duration: 0.2,
  ease: 'easeOut',
}

export const modalDialogTransition: Transition = {
  duration: 0.25,
  ease: easeOut,
}

export const staggerDelay = 0.06

export const hoverSpring = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 25,
}
