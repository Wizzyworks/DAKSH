import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/Input'
import PasswordInput from '../components/PasswordInput'
import Button from '../components/Button'

function validate(email, password) {
  const errors = {}
  if (!email) errors.email = 'Email address is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email'
  if (!password) errors.password = 'Password is required'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
  return errors
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    const v = validate(email, password)
    setErrors(v)
    if (Object.keys(v).length) return

    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setFormError(err.message || 'Login failed. Please verify credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoFill = () => {
    setEmail('candidate.demo@daksh.ai')
    setPassword('PlacementReady@2026')
    setErrors({})
    setFormError('')
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your campus placement preparation"
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Quick Demo Fill Pill */}
        <div style={{ marginBottom: '18px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleDemoFill}
            style={{
              background: 'var(--surface-soft)',
              border: '1px solid var(--border)',
              borderRadius: '99px',
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: 700,
              color: 'var(--primary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <UserCheck size={13} />
            <span>Fill Demo Credentials (1-Click)</span>
          </button>
        </div>

        {/* Form-level error */}
        {formError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '12px 14px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={15} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '13px', color: '#EF4444', fontWeight: 600 }}>{formError}</p>
          </motion.div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            id="login-email"
            label="College / Personal Email"
            type="email"
            placeholder="e.g. rahul.sharma@college.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors((er) => ({ ...er, email: '' }))
            }}
            error={errors.email}
            autoComplete="email"
            autoFocus
          />

          <PasswordInput
            id="login-password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors((er) => ({ ...er, password: '' }))
            }}
            error={errors.password}
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={loading}
          style={{ width: '100%', marginTop: '22px', borderRadius: 'var(--radius-md)' }}
        >
          {loading ? 'Authenticating...' : 'Sign In to DAKSH'}
        </Button>

        <div className="divider" />

        <p style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link
            to="/signup"
            style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}
          >
            Create free account
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
