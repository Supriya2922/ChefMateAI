import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { navItems } from '../content/siteCopy'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function AppNav() {
  const reduced = useReducedMotion()

  return (
    <nav className="app-nav" aria-label="Primary">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard'}
          className={({ isActive }) =>
            isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
          }
        >
          {({ isActive }) => (
            <>
              {isActive && !reduced ? (
                <motion.span
                  className="app-nav__pill"
                  layoutId="nav-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              ) : null}
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
