import { motion } from 'framer-motion'
import { Children, isValidElement, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { staggerContainer, staggerItem } from '../../motion/variants'
import { pageTransition } from '../../motion/transitions'

type StaggerGridProps = {
  className: string
  'aria-label'?: string
  children: ReactNode
}

export function StaggerGrid({ className, 'aria-label': ariaLabel, children }: StaggerGridProps) {
  const reduced = useReducedMotion()
  const container = reduced ? undefined : staggerContainer
  const item = reduced ? undefined : staggerItem
  const transition = reduced ? { duration: 0 } : pageTransition

  return (
    <motion.section
      className={className}
      aria-label={ariaLabel}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) {
          return child
        }

        return (
          <motion.div key={child.key ?? undefined} variants={item} transition={transition}>
            {child}
          </motion.div>
        )
      })}
    </motion.section>
  )
}

export function StaggerGridItem({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const item = reduced ? undefined : staggerItem
  const transition = reduced ? { duration: 0 } : pageTransition

  return (
    <motion.div variants={item} transition={transition}>
      {children}
    </motion.div>
  )
}
