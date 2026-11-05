import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/authApi'

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
      const storedUser = localStorage.getItem('daksh-user')
      if (!storedUser) return false
      const parsed = JSON.parse(storedUser)
      if (parsed.profile?.is_onboarded) return true
      return localStorage.getItem(`daksh-onboarding-${parsed.id}`) === 'true'
    } catch {
      return false
    }
  })

  // Hydrate user profile from backend on app load if token exists
  useEffect(() => {
    const token = localStorage.getItem('daksh_access_token')
    if (token) {
      authApi.getCurrentUser()
        .then((userData) => {
          if (userData && userData.email) {
            setUser(userData)
            localStorage.setItem('daksh-user', JSON.stringify(userData))
            if (userData.profile?.is_onboarded) {
              setOnboardingComplete(true)
            }
          }
        })
        .catch((err) => {
          console.warn('Backend user profile hydration note:', err.message)
        })
    }
  }, [])

  const login = async (email, password) => {
    if (!email || !password) throw new Error('Invalid credentials')

    try {
      const res = await authApi.login(email, password)
      const activeUser = res.user || {
        id: 'u_' + btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
        email,
        name: email.split('@')[0],
      }
      setUser(activeUser)
      const isComplete = Boolean(
        activeUser.profile?.is_onboarded ||
        localStorage.getItem(`daksh-onboarding-${activeUser.id}`) === 'true'
      )
      setOnboardingComplete(isComplete)
      return activeUser
    } catch (err) {
      if (err.isNetworkError) {
        console.warn('Backend unavailable, falling back to local demo session:', err.message)
        const userId = 'u_' + btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)
        const activeUser = { id: userId, email, name: email.split('@')[0] }
        setUser(activeUser)
        localStorage.setItem('daksh-user', JSON.stringify(activeUser))
        const isComplete = localStorage.getItem(`daksh-onboarding-${userId}`) === 'true'
        setOnboardingComplete(isComplete)
        return activeUser
      }
      throw err
    }
  }

  const signup = async (email, password, extraData = {}) => {
    if (!email || !password) throw new Error('Please fill all fields')

    const firstName = extraData.firstName || email.split('@')[0] || 'Candidate'
    const lastName = extraData.lastName || 'User'

    try {
      const res = await authApi.register({
        email,
        password,
        confirm_password: password,
        first_name: firstName,
        last_name: lastName,
      })
      const newUser = res.user || {
        id: 'u_' + btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
        email,
        name: firstName,
      }
      localStorage.removeItem(`daksh-onboarding-${newUser.id}`)
      localStorage.removeItem('daksh-onboarding-complete')
      setOnboardingComplete(false)
      setUser(newUser)
      return newUser
    } catch (err) {
      if (err.isNetworkError) {
        console.warn('Backend unavailable, falling back to local demo session:', err.message)
        const userId = 'u_' + btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)
        const newUser = { id: userId, email, name: firstName }
        localStorage.removeItem(`daksh-onboarding-${userId}`)
        localStorage.removeItem('daksh-onboarding-complete')
        setOnboardingComplete(false)
        setUser(newUser)
        localStorage.setItem('daksh-user', JSON.stringify(newUser))
        return newUser
      }
      throw err
    }
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
    setOnboardingComplete(false)
    localStorage.removeItem('daksh-user')
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
