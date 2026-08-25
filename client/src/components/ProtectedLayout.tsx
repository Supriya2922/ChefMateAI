import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AppHeader } from './AppHeader'
import { ScreenLoader } from './ScreenLoader'

export function ProtectedLayout() {
  const { token, isReady } = useAuth()

  if (!isReady) {
    return <ScreenLoader />
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <Outlet />
    </div>
  )
}

export function PublicOnly({ children }: { children: ReactNode }) {
  const { token, isReady } = useAuth()

  if (!isReady) {
    return <ScreenLoader />
  }

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
