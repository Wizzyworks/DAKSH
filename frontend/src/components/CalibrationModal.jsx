import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrainCircuit, CheckCircle2, Sparkles, Cpu, Target, Zap } from 'lucide-react'

const CALIBRATION_STEPS = [
  {
    id: 1,
    title: 'Ingesting Academic Persona & Target Role',
    subtitle: 'Calibrating college tier, degree & target role parameters...',
    icon: Target,
  },
  {
    id: 2,
    title: 'Configuring Company Hiring Rubrics',
    subtitle: 'Aligning interview difficulty against Tier 1 & MNC standards...',
    icon: Cpu,
  },
  {
    id: 3,
    title: 'Initializing SETU AI & Skill Gap Engine',
    subtitle: 'Setting up neural evaluation models & diagnostic workspace...',
    icon: Zap,
  },
]

export default function CalibrationModal({ isOpen, onComplete, targetRole = 'Software Development Engineer' }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [progress, setProgress] = useState(15)

  useEffect(() => {
    if (!isOpen) return

    // Step 1: 0 - 800ms
    const timer1 = setTimeout(() => {
      setActiveStepIndex(1)
      setProgress(55)
    }, 850)

    // Step 2: 850 - 1700ms
    const timer2 = setTimeout(() => {
      setActiveStepIndex(2)
      setProgress(90)
    }, 1750)

    // Step 3: 1750 - 2600ms
    const timer3 = setTimeout(() => {
      setProgress(100)
    }, 2500)

    // Complete transition: 2800ms
    const timerEnd = setTimeout(() => {
      if (onComplete) onComplete()
    }, 2850)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timerEnd)
    }
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(7, 10, 19, 0.88)',
          backdropFilter: 'blur(28px)',
          padding: '20px',
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: 'absolute',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)',
            filter: 'blur(80px)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="gradient-border-card"
          style={{
            maxWidth: '520px',
            width: '100%',
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(24px) saturate(180%)',
            borderRadius: 'var(--radius-xl)',
            padding: '38px 32px',
            textAlign: 'center',
            boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.25)',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Animated Pulsing Brain Icon with Rings */}
          <div style={{ position: 'relative', width: '84px', height: '84px', margin: '0 auto 20px' }}>
            {/* Outer spinning ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: '-6px',
                borderRadius: '26px',
                border: '2px dashed rgba(99, 102, 241, 0.45)',
              }}
            />

            {/* Glowing Core */}
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '22px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 30px var(--primary-glow)',
              }}
            >
              <BrainCircuit size={42} color="#FFFFFF" strokeWidth={2} />
            </div>
          </div>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '99px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Sparkles size={12} />
              AI CALIBRATION ENGINE
            </span>
          </div>

          <h2
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: '6px',
              letterSpacing: '-0.02em',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            Calibrating Your Persona...
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Setting up your personalized workspace for <strong style={{ color: 'var(--text)' }}>{targetRole}</strong>
          </p>

          {/* Progress Bar */}
          <div
            style={{
              height: '6px',
              background: 'var(--surface-soft)',
              borderRadius: '99px',
              overflow: 'hidden',
              marginBottom: '26px',
              border: '1px solid var(--border)',
            }}
          >
            <motion.div
              initial={{ width: '10%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{
                height: '100%',
                background: 'var(--gradient-primary)',
                borderRadius: '99px',
                boxShadow: '0 0 12px rgba(99, 102, 241, 0.6)',
              }}
            />
          </div>

          {/* Step Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            {CALIBRATION_STEPS.map((step, idx) => {
              const isDone = activeStepIndex > idx || progress === 100
              const isCurrent = activeStepIndex === idx && progress < 100

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isCurrent ? 'rgba(99, 102, 241, 0.08)' : 'var(--surface-soft)',
                    border: isCurrent ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>
                    {isDone ? (
                      <CheckCircle2 size={18} color="#10B981" strokeWidth={2.5} />
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      >
                        <Zap size={18} color="var(--primary)" />
                      </motion.div>
                    ) : (
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: '2px solid var(--border)',
                        }}
                      />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: isCurrent || isDone ? 700 : 500,
                        color: isDone ? '#10B981' : isCurrent ? 'var(--text)' : 'var(--text-muted)',
                        margin: 0,
                      }}
                    >
                      {step.title}
                    </p>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-subtle)', margin: '2px 0 0' }}>
                      {step.subtitle}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <p style={{ fontSize: '11.5px', color: 'var(--text-subtle)', marginTop: '22px', fontStyle: 'italic' }}>
            ⚡ Powered by DAKSH Neural Assessment Pipeline
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
