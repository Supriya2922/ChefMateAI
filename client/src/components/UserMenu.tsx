import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { formatDietary, initialsFromName } from '../lib/format'

export function UserMenu() {
  const { profile, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const name = profile?.displayName ?? 'Guest'
  const hasPrefs = Boolean(
    profile?.dietaryPreference ||
      profile?.cookingSkill ||
      profile?.householdSize ||
      (profile?.allergies.length ?? 0) > 0 ||
      (profile?.cuisines.length ?? 0) > 0,
  )

  return (
    <div className="user-menu" ref={rootRef}>
      <button
        type="button"
        className="user-menu__avatar"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">Open profile</span>
        {initialsFromName(name)}
      </button>

      {open ? (
        <div className="user-menu__panel" role="dialog" aria-label="Your details">
          <p className="user-menu__name">{name}</p>
          <p className="user-menu__email">{profile?.email}</p>
          {profile?.phoneNumber ? (
            <p className="user-menu__meta">{profile.phoneNumber}</p>
          ) : null}

          <div className="user-menu__divider" />

          {hasPrefs ? (
            <dl className="user-menu__facts">
              <div>
                <dt>Diet</dt>
                <dd>{formatDietary(profile?.dietaryPreference ?? null)}</dd>
              </div>
              <div>
                <dt>Skill</dt>
                <dd>{profile?.cookingSkill ?? 'Not set'}</dd>
              </div>
              <div>
                <dt>Household</dt>
                <dd>
                  {profile?.householdSize
                    ? `${profile.householdSize} ${profile.householdSize === 1 ? 'person' : 'people'}`
                    : 'Not set'}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="user-menu__empty">Preferences not set yet.</p>
          )}

          {profile && profile.allergies.length > 0 ? (
            <div className="user-menu__chips">
              {profile.allergies.map((item) => (
                <span key={item} className="chip chip--muted">
                  {item}
                </span>
              ))}
            </div>
          ) : null}

          {profile && profile.cuisines.length > 0 ? (
            <div className="user-menu__chips">
              {profile.cuisines.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          ) : null}

          <div className="user-menu__actions">
            <Link
              to="/profile"
              className="btn btn--ghost"
              onClick={() => setOpen(false)}
            >
              Edit preferences
            </Link>
            <button type="button" className="btn btn--text" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
