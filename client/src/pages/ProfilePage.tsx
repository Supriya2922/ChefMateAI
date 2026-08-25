import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ProfileForm } from '../components/ProfileForm'
import { ScreenLoader } from '../components/ScreenLoader'

export function ProfilePage() {
  const { profile, refreshProfile } = useAuth()

  if (!profile) {
    return <ScreenLoader />
  }

  return (
    <main className="page page--narrow">
      <header className="page__intro">
        <p className="page__eyebrow">
          <Link to="/dashboard">← Kitchen</Link>
        </p>
        <h1 className="page__title">Your tastes</h1>
        <p className="page__lede">
          Tell us how you cook. We’ll keep this close when recipes arrive.
        </p>
      </header>

      <div className="panel">
        <ProfileForm profile={profile} onSaved={() => refreshProfile()} />
      </div>
    </main>
  )
}
