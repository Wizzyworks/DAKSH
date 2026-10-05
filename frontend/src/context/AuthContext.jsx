import { createContext, useContext, useState, useEffect } from 'react'

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
      return localStorage.getItem(`daksh-onboarding-${parsed.id}`) === 'true'
    } catch {
      return false
    }
  })

  const login = async (email, password) => {
    await new Promise((r) => setTimeout(r, 800))
    if (!email || !password) throw new Error('Invalid credentials')

    // Consistent user ID generated from email
    const userId = 'u_' + btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)
    const activeUser = { id: userId, email, name: email.split('@')[0] }

    setUser(activeUser)
    localStorage.setItem('daksh-user', JSON.stringify(activeUser))

    const isComplete = localStorage.getItem(`daksh-onboarding-${userId}`) === 'true'
    setOnboardingComplete(isComplete)
    return activeUser
  }

  const signup = async (email, password) => {
    await new Promise((r) => setTimeout(r, 800))
    if (!email || !password) throw new Error('Please fill all fields')

    const userId = 'u_' + btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)
    const newUser = { id: userId, email, name: email.split('@')[0] }

    // Explicitly reset onboarding complete state for every newly created account
    localStorage.removeItem(`daksh-onboarding-${userId}`)
    localStorage.removeItem('daksh-onboarding-complete') // clear legacy key
    setOnboardingComplete(false)

    setUser(newUser)
    localStorage.setItem('daksh-user', JSON.stringify(newUser))
    return newUser
  }

  const logout = () => {
    setUser(null)
    setOnboardingComplete(false)
    localStorage.removeItem('daksh-user')
  }

  const completeOnboarding = () => {
    if (user?.id) {
      localStorage.setItem(`daksh-onboarding-${user.id}`, 'true')
    }
    localStorage.setItem('daksh-onboarding-complete', 'true')
    setOnboardingComplete(true)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        onboardingComplete,
        login,
        signup,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
