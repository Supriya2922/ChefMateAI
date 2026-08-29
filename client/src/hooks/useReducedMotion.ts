import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { fadeUp, instant, withReducedMotion } from '../motion/variants'

export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false
}

export function useMotionVariants(variants: Variants): Variants {
  const reduced = useReducedMotion()
  return withReducedMotion(variants, reduced)
}

export function useInstantIfReduced(): Variants {
  const reduced = useReducedMotion()
  return reduced ? instant : fadeUp
}
