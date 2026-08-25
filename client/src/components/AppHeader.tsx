import { Link } from 'react-router-dom'
import { UserMenu } from './UserMenu'

export function AppHeader() {
  return (
    <header className="app-header">
      <Link to="/dashboard" className="app-header__brand">
        ChefMate
      </Link>
      <UserMenu />
    </header>
  )
}
