import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, AlertCircle, GraduationCap, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ProgressIndicator from '../components/ProgressIndicator'
import OnboardingStep from '../components/OnboardingStep'
import Button from '../components/Button'
import ONBOARDING_SCHEMA from '../data/onboardingSchema'
import ThemeToggle from '../components/ThemeToggle'
import CalibrationModal from '../components/CalibrationModal'

const STORAGE_KEY = 'daksh-onboarding-data-v4'

function validateStep(step, values) {
  const errors = {}
  for (const field of step.fields) {
    if (!field.required) continue
    const val = values[field.id]
    if (field.type === 'multiselect') {
      if (!Array.isArray(val) || val.length === 0) {
        errors[field.id] = 'Select at least one option'
      }
    } else if (field.type === 'file') {
      if (!val?.name) errors[field.id] = 'Please upload your resume (PDF)'
    } else {
      if (!val || String(val).trim() === '') {
        errors[field.id] = `${field.label} is required`
      }
    }
  }
  return errors
}

export default function OnboardingPage() {
  const { user, completeOnboarding } = useAuth()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [showCalibration, setShowCalibration] = useState(false)
  const [values, setValues] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const steps = ONBOARDING_SCHEMA
  const isLast = currentStep === steps.length - 1

  // Persist to localStorage
  useEffect(() => {
    try {
      const safe = {}
      for (const [k, v] of Object.entries(values)) {
        if (v && typeof v === 'object' && v.file) {
          safe[k] = { name: v.name, size: v.size, type: v.type }
        } else {
          safe[k] = v
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
    } catch {}
  }, [values])

  const handleChange = (fieldId, value) => {
    setValues((v) => ({ ...v, [fieldId]: value }))
    setErrors((e) => ({ ...e, [fieldId]: '' }))
  }

  const handleNext = () => {
    const step = steps[currentStep]
    const errs = validateStep(step, values)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setDirection(1)
    setCurrentStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setErrors({})
    setDirection(-1)
    setCurrentStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSkip = () => {
    setErrors({})
    if (isLast) {
      // Last step skip: show calibration modal then go to dashboard
      setShowCalibration(true)
    } else {
      // Skip current step and go to next step without validation
      setDirection(1)
      setCurrentStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    const step = steps[currentStep]
    const errs = validateStep(step, values)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      // Show high-end calibration animation before going to dashboard
      setShowCalibration(true)
    } catch (err) {
      setSubmitError('Could not save your profile. Please try again.')
      setSubmitting(false)
    }
  }

  const handleCalibrationComplete = () => {
    completeOnboarding()
    navigate('/dashboard', { replace: true })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'var(--bg-gradient)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '25%',
          width: '500px',
          height: '500px',
          background: 'var(--gradient-glow)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          opacity: 0.35,
        }}
      />

      {/* Top Header Bar */}
      <header
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="page-container" style={{ maxWidth: '880px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 10px var(--primary-glow)',
                  }}
                >
                  <GraduationCap size={18} color="#FFFFFF" strokeWidth={2.2} />
                </div>
                <div>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
                    DAKSH
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-subtle)', fontWeight: 600, display: 'block', marginTop: '-3px' }}>
                    Placement Calibration
                  </span>
                </div>
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {user && (
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {user.email}
                </span>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px 24px 80px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          
          {/* Header Title */}
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <span className="glow-pill" style={{ marginBottom: '12px' }}>
              PROFILE CALIBRATION
            </span>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', marginBottom: '8px' }}>
              Build Your Placement Persona
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Takes just 2 minutes. DAKSH uses your inputs to construct company-calibrated question sets.
            </p>
          </div>

          {/* Step Progress Bubble Bar */}
          <ProgressIndicator steps={steps} currentStep={currentStep} />

          {/* Form Step Card */}
          <div
            className="gradient-border-card"
            style={{
              background: 'var(--surface-glass)',
              backdropFilter: 'blur(24px) saturate(180%)',
              padding: '34px 30px',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Step Description Banner */}
            <div style={{ marginBottom: '22px', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {steps[currentStep].description}
              </p>
            </div>

            {/* Dynamic Step Fields */}
            <OnboardingStep
              step={steps[currentStep]}
              direction={direction}
              values={values}
              onChange={handleChange}
              errors={errors}
            />

            {/* Error Banner */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  marginTop: '20px',
                }}
              >
                <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: '#EF4444', fontWeight: 600 }}>{submitError}</p>
              </motion.div>
            )}

            {/* Card Footer Navigation Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '32px',
                paddingTop: '22px',
                borderTop: '1px solid var(--border)',
                gap: '12px',
              }}
            >
              {/* LEFT SIDE: Back Button + Skip For Now Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {currentStep > 0 && (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    style={{ gap: '6px' }}
                  >
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleSkip}
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <span>Skip for now</span>
                </Button>
              </div>

              {/* RIGHT SIDE: Save & Continue / Save & Launch Dashboard */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isLast ? (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={submitting}
                    style={{ gap: '8px', borderRadius: '99px', padding: '11px 26px' }}
                  >
                    <Check size={16} strokeWidth={2.5} />
                    <span>{submitting ? 'Saving Profile...' : 'Save & Launch Dashboard'}</span>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    style={{ gap: '8px', borderRadius: '99px', padding: '11px 26px' }}
                  >
                    <span>Save & Continue</span>
                    <ChevronRight size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 2.8s Futuristic AI Persona Calibration Modal */}
      <CalibrationModal
        isOpen={showCalibration}
        onComplete={handleCalibrationComplete}
        targetRole={values.targeted_role || 'Software Development Engineer (SDE-1)'}
      />
    </div>
  )
}
