import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { fadeUp, staggerContainer, staggerItem } from '../../motion/variants'
import { pageTransition, staggerDelay } from '../../motion/transitions'

type PageIntroProps = {
  eyebrow: ReactNode
  title: ReactNode
  lede?: ReactNode
  titleRow?: boolean
}

export function PageIntro({ eyebrow, title, lede, titleRow = false }: PageIntroProps) {
  const reduced = useReducedMotion()
  const container = reduced ? undefined : staggerContainer
  const item = reduced ? undefined : staggerItem
  const transition = reduced ? { duration: 0 } : pageTransition

  return (
    <motion.header
      className="page__intro"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.p className="page__eyebrow" variants={item} transition={transition}>
        {eyebrow}
      </motion.p>
      {titleRow ? (
        <motion.div className="page__title-row" variants={item} transition={transition}>
          {title}
        </motion.div>
      ) : (
        <motion.div variants={item} transition={transition}>
          {title}
        </motion.div>
      )}
      {lede ? (
        <motion.p className="page__lede" variants={item} transition={transition}>
          {lede}
        </motion.p>
      ) : null}
    </motion.header>
  )
}

export function PageIntroTitle({ children }: { children: ReactNode }) {
  return <h1 className="page__title">{children}</h1>
}

export function PageIntroFadeItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  const variants = reduced ? fadeUp : staggerItem
  const transition = reduced ? { duration: 0 } : { ...pageTransition, delay: staggerDelay * 2 }

  return (
    <motion.div className={className} variants={variants} transition={transition}>
      {children}
    </motion.div>
  )
}
