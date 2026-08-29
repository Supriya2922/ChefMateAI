import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { BroccoliSvg, CarrotSvg, LeafSvg, PepperSvg, TomatoSvg } from './VegSprites'

type VegConfig = {
  Component: typeof TomatoSvg
  style: CSSProperties
  float: { y: number[]; rotate: number[] }
  duration: number
}

const VEG_ITEMS: VegConfig[] = [
  {
    Component: TomatoSvg,
    style: { top: '18%', left: '12%' },
    float: { y: [0, -14, 0], rotate: [-4, 4, -4] },
    duration: 7,
  },
  {
    Component: CarrotSvg,
    style: { top: '55%', left: '8%' },
    float: { y: [0, -10, 0], rotate: [6, -6, 6] },
    duration: 8.5,
  },
  {
    Component: LeafSvg,
    style: { top: '12%', right: '18%' },
    float: { y: [0, -12, 0], rotate: [-8, 8, -8] },
    duration: 6.5,
  },
  {
    Component: PepperSvg,
    style: { bottom: '22%', right: '14%' },
    float: { y: [0, -16, 0], rotate: [3, -5, 3] },
    duration: 9,
  },
  {
    Component: BroccoliSvg,
    style: { bottom: '18%', left: '28%' },
    float: { y: [0, -11, 0], rotate: [-3, 3, -3] },
    duration: 7.5,
  },
]

export function FloatingVegScene() {
  const reduced = useReducedMotion()

  if (reduced) {
    return null
  }

  return (
    <div className="veg-scene" aria-hidden="true">
      {VEG_ITEMS.map(({ Component, style, float, duration }, index) => (
        <motion.div
          key={index}
          className="veg-scene__sprite"
          style={style}
          animate={float}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Component />
        </motion.div>
      ))}
    </div>
  )
}
