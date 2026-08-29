import { motion } from 'framer-motion'
import { brand, loader } from '../content/siteCopy'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function ScreenLoader() {
  const reduced = useReducedMotion()

  return (
    <div className="screen-loader">
      <motion.p
        className="screen-loader__mark"
        animate={reduced ? undefined : { opacity: [0.6, 1, 0.6], scale: [0.98, 1, 0.98] }}
        transition={reduced ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {brand.name}
      </motion.p>
      <p className="screen-loader__hint">{loader.hint}</p>
      {!reduced ? (
        <div className="screen-loader__dots" aria-hidden="true">
          <span className="screen-loader__dot" />
          <span className="screen-loader__dot" />
          <span className="screen-loader__dot" />
        </div>
      ) : null}
    </div>
  )
}
