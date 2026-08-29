import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMotionVariants } from '../../hooks/useReducedMotion'
import { fadeUp } from '../../motion/variants'
import { pageTransition } from '../../motion/transitions'

type AnimatedPageProps = {
  children: ReactNode
}

export function AnimatedPage({ children }: AnimatedPageProps) {
  const variants = useMotionVariants(fadeUp)

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}
