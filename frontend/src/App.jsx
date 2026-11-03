import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'

// Client-side hydration splash
function HydrationFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid var(--border)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  )
}

// Protected route — redirects to /login if unauthenticated
function ProtectedRoute({ children }) {
  const { user, isHydrated } = useAuth()
  if (!isHydrated) return <HydrationFallback />
  return user ? children : <Navigate to="/" replace />
}

// Onboarding guard — if already complete, skip to /dashboard
function OnboardingRoute({ children }) {
  const { user, onboardingComplete, isHydrated } = useAuth()
  const location = useLocation()
  const isEditMode = new URLSearchParams(location.search).get('mode') === 'edit'

  if (!isHydrated) return <HydrationFallback />
  if (!user) return <Navigate to="/login" replace />
  if (onboardingComplete && !isEditMode) return <Navigate to="/dashboard" replace />
  return children
}

// Auth redirect — logged in users shouldn't see login/signup
function AuthRoute({ children }) {
  const { user, onboardingComplete, isHydrated } = useAuth()
  if (!isHydrated) return <HydrationFallback />
  if (!user) return children
  return <Navigate to={onboardingComplete ? '/dashboard' : '/onboarding'} replace />
}

// Landing redirect — logged in users land on dashboard directly without landing flash
function LandingRoute() {
  const { user, onboardingComplete, isHydrated } = useAuth()
  if (!isHydrated) return <HydrationFallback />
  if (user) {
    return <Navigate to={onboardingComplete ? '/dashboard' : '/onboarding'} replace />
  }
  return <LandingPage />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />


      <Route
        path="/login"
        element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <AuthRoute>
            <SignupPage />
          </AuthRoute>
        }
      />

      <Route
        path="/onboarding"
        element={
          <OnboardingRoute>
            <OnboardingPage />
          </OnboardingRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Skill Gap Analysis Route */}
      <Route
        path="/skill-gap"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
