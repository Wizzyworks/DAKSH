import { createContext, useContext, useState, useEffect } from 'react'
import { authApi, authStorage } from '../services/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('daksh-user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    try {
      const stored = localStorage.getItem('daksh-user')
      if (!stored) return false
      const parsed = JSON.parse(stored)
      return localStorage.getItem(`daksh-onboarding-${parsed.id}`) === 'true'
    } catch {
      return false
    }
  })

  const [loading, setLoading] = useState(true)

  // Verify and hydrate session on initial load
  useEffect(() => {
    async function initSession() {
      const { access } = authStorage.getTokens()
      if (access) {
        try {
          const userData = await authApi.getMe()
          setUser(userData)
          setOnboardingComplete(Boolean(userData?.profile?.is_onboarded))
          localStorage.setItem('daksh-user', JSON.stringify(userData))
        } catch (err) {
          authStorage.clearTokens()
          setUser(null)
          setOnboardingComplete(false)
        }
      }
      setLoading(false)
    }
    initSession()
  }, [])

  const login = async (email, password) => {
    const res = await authApi.login(email, password)
    const userData = res.user
    setUser(userData)

    setOnboardingComplete(Boolean(userData?.profile?.is_onboarded))
    localStorage.setItem('daksh-user', JSON.stringify(userData))
    return userData
  }

  const signup = async (data) => {
    const res = await authApi.register(data)
    const userData = res.user
    setUser(userData)
    setOnboardingComplete(false)
    localStorage.setItem('daksh-user', JSON.stringify(userData))
    return userData
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
      setOnboardingComplete(false)
    }
  }

  const completeOnboarding = (updatedUser) => {
    if (updatedUser) {
      setUser(updatedUser)

      setOnboardingComplete(Boolean(updatedUser?.profile?.is_onboarded))
      localStorage.setItem('daksh-user', JSON.stringify(updatedUser))
    } else {
      setOnboardingComplete(true)
    }
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        onboardingComplete,
        login,
        signup,
        logout,
        completeOnboarding,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
