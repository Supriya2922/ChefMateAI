import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatedPage } from './AnimatedPage'

export function AnimatedOutlet() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <AnimatedPage key={location.pathname}>
        <Outlet />
      </AnimatedPage>
    </AnimatePresence>
  )
}
