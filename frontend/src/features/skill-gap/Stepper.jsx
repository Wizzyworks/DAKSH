import { Check, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { TOKENS } from './ui/SkillGapPrimitives'

export default function Stepper({ currentStep, maxUnlockedStep = 1, onSelectStep }) {
  const steps = [
    { num: 1, code: '01', title: 'Resume & Scan', short: 'Upload' },
    { num: 2, code: '02', title: 'Gap Report', short: 'Analysis' },
    { num: 3, code: '03', title: 'Assessment', short: 'Test' },
    { num: 4, code: '04', title: 'Action Plan', short: 'Roadmap' },
  ]

  const progressPct = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* ── Mobile Compact ── */}
      <div
        className="sm:hidden"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 0',
          gap: '10px',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--accent)',
              letterSpacing: '0.04em',
            }}
          >
            Step {String(currentStep).padStart(2, '0')} / 04
          </span>
          <strong style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {steps[currentStep - 1]?.title}
          </strong>
        </div>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {steps.map((s) => {
            const isClickable = s.num <= maxUnlockedStep;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => isClickable && onSelectStep && onSelectStep(s.num)}
                aria-label={`Step ${s.num}: ${s.title}`}
                style={{
                  width: currentStep === s.num ? '22px' : '10px',
                  height: '10px',
                  padding: 0,
                  border: 'none',
                  borderRadius: '99px',
                  background: currentStep === s.num ? 'var(--accent)' : currentStep > s.num ? 'var(--success)' : 'var(--glass-border)',
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: 'all 0.25s ease',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── Desktop: Floating Rail Stepper ── */}
      <div className="hidden sm:block">
        {/* Slim progress bar */}
        <div
          style={{
            height: '2px',
            background: 'var(--border)',
            borderRadius: '99px',
            marginBottom: '14px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'var(--gradient-primary)',
              borderRadius: '99px',
            }}
          />
        </div>

        {/* Steps rail */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '8px',
            position: 'relative',
          }}
        >
          {steps.map((step) => {
            const isActive = currentStep === step.num
            const isCompleted = currentStep > step.num
            const isUnlocked = step.num <= maxUnlockedStep
            const isClickable = isUnlocked && !isActive

            return (
              <motion.div
                key={step.num}
                onClick={() => { if (isClickable) onSelectStep(step.num) }}
                whileHover={isClickable ? { y: -1 } : {}}
                transition={{ duration: 0.15 }}
                className="daksh-glass-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 13px',
                  borderRadius: '10px',
                  background: isActive ? 'var(--glass)' : 'var(--bg-elevated)',
                  border: isActive ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  cursor: isClickable ? 'pointer' : isActive ? 'default' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.65,
                  transition: 'all 0.18s ease',
                  position: 'relative',
                }}
              >
                {/* Step indicator */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                    fontFamily: 'JetBrains Mono, monospace',
                    transition: 'all 0.2s ease',
                    ...(isCompleted
                      ? {
                          background: 'var(--success-dim)',
                          border: '1px solid rgba(95, 176, 143, 0.25)',
                          color: 'var(--success)',
                        }
                      : isActive
                      ? {
                          background: 'var(--gradient-primary)',
                          border: '1px solid transparent',
                          color: '#F8F9FC',
                          boxShadow: '0 2px 10px rgba(107, 124, 245, 0.3)',
                        }
                      : {
                          background: 'var(--glass)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-muted)',
                        }),
                  }}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={2.5} />
                  ) : !isUnlocked ? (
                    <Lock size={11} strokeWidth={2.2} />
                  ) : (
                    step.code
                  )}
                </div>

                {/* Text */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--text)' : 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {step.title}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: isCompleted ? 'var(--success)' : isActive ? 'var(--accent)' : 'var(--text-muted)',
                    }}
                  >
                    {isCompleted ? 'Complete' : isActive ? 'Active' : `Step ${step.code}`}
                  </span>
                </div>

                {/* Active soft dot */}
                {isActive && (
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      flexShrink: 0,
                    }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
