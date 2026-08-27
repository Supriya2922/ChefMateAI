import { NavLink } from 'react-router-dom'
import { navItems } from '../content/siteCopy'

export function AppNav() {
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
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
