import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, ShieldCheck, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/Input'
import PasswordInput from '../components/PasswordInput'
import Button from '../components/Button'

function validate(email, password, confirm) {
  const errors = {}
  if (!email) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address'
  if (!password) errors.password = 'Password is required'
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters'
  if (!confirm) errors.confirm = 'Please confirm your password'
  else if (confirm !== password) errors.confirm = 'Passwords do not match'
  return errors
}

const requirements = [
  { label: 'Min 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number (0-9)', test: (p) => /\d/.test(p) },
]

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pwFocused, setPwFocused] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    const v = validate(email, password, confirm)
    setErrors(v)
    if (Object.keys(v).length) return

    setLoading(true)
    try {
      await signup(email, password)
      navigate('/onboarding', { replace: true })
    } catch (err) {
      setFormError(err.message || 'Could not create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoFill = () => {
    const demoEmail = `candidate_${Math.floor(1000 + Math.random() * 9000)}@college.edu`
    setEmail(demoEmail)
    setPassword('PlacementReady@2026')
    setConfirm('PlacementReady@2026')
    setErrors({})
    setFormError('')
  }

  const strengthCount = requirements.filter((r) => r.test(password)).length

  return (
    <AuthLayout
      title="Create Your  Account"
      subtitle="Start AI-guided campus placement prep — 100% Free"
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
            <UserPlus size={13} />
            <span>Generate Quick Test Account (1-Click)</span>
          </button>
        </div>

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
            id="signup-email"
            label="College / Personal Email"
            type="email"
            placeholder="e.g. rahul@college.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors((er) => ({ ...er, email: '' }))
            }}
            error={errors.email}
            autoComplete="email"
            autoFocus
          />

          <div>
            <PasswordInput
              id="signup-password"
              label="Password"
              placeholder="Create your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((er) => ({ ...er, password: '' }))
              }}
              error={errors.password}
              autoComplete="new-password"
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
            />

            {/* Password strength progress bar */}
            {password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ height: '4px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(strengthCount / requirements.length) * 100}%`,
                      background: strengthCount === 3 ? '#10B981' : strengthCount === 2 ? 'var(--accent-amber-bright)' : '#EF4444',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Password strength hints */}
            {(pwFocused || password) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                {requirements.map((req) => {
                  const met = req.test(password)
                  return (
                    <div key={req.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2
                        size={13}
                        color={met ? '#10B981' : 'var(--text-subtle)'}
                        strokeWidth={met ? 2.5 : 1.5}
                      />
                      <span
                        style={{
                          fontSize: '12px',
                          color: met ? 'var(--text)' : 'var(--text-muted)',
                          fontWeight: met ? 700 : 400,
                        }}
                      >
                        {req.label}
                      </span>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </div>

          <PasswordInput
            id="signup-confirm"
            label="Confirm Password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value)
              setErrors((er) => ({ ...er, confirm: '' }))
            }}
            error={errors.confirm}
            autoComplete="new-password"
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
          {loading ? 'Creating Account...' : 'Create Account & Continue'}
        </Button>

        <div className="divider" />

        <p style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
