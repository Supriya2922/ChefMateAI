import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { login as loginRequest, register as registerRequest } from '../api/auth'
import { clearToken, getToken, setToken } from '../api/http'
import { getProfile } from '../api/profile'
import type { Profile, RegisterPayload } from '../api/types'

type AuthContextValue = {
  token: string | null
  profile: Profile | null
  isReady: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isReady, setIsReady] = useState(false)

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
    setProfile(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    const current = getToken()
    if (!current) {
      setProfile(null)
      return
    }

    const next = await getProfile()
    setProfile(next)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      const stored = getToken()
      if (!stored) {
        if (!cancelled) {
          setIsReady(true)
        }
        return
      }

      try {
        const next = await getProfile()
        if (!cancelled) {
          setProfile(next)
        }
      } catch {
        if (!cancelled) {
          clearToken()
          setTokenState(null)
          setProfile(null)
        }
      } finally {
        if (!cancelled) {
          setIsReady(true)
        }
      }
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password)
    setToken(response.token)
    setTokenState(response.token)
    const next = await getProfile()
    setProfile(next)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await registerRequest(payload)
    setToken(response.token)
    setTokenState(response.token)
    const next = await getProfile()
    setProfile(next)
  }, [])

  const value = useMemo(
    () => ({
      token,
      profile,
      isReady,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [token, profile, isReady, login, register, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
