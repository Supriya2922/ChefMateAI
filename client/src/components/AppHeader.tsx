import { Link } from 'react-router-dom'
import { brand } from '../content/siteCopy'
import { AppNav } from './AppNav'
import { UserMenu } from './UserMenu'

export function AppHeader() {
  return (
    <header className="app-header">
      <Link to="/dashboard" className="app-header__brand">
        <span className="app-header__brand-full">{brand.name}</span>
        <span className="app-header__brand-short">{brand.shortName}</span>
      </Link>
      <AppNav />
      <UserMenu />
    </header>
  )
}
