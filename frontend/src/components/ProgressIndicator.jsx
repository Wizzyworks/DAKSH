import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProgressIndicator({ steps, currentStep }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Steps bubbles row */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.map((step, i) => {
          const status = i < currentStep ? 'done' : i === currentStep ? 'active' : 'upcoming'
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: i < steps.length - 1 ? 1 : undefined,
              }}
            >
              <div className={`step-indicator-bubble ${status}`}>
                {status === 'done' ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className={`step-connector-line ${i < currentStep ? 'done' : ''}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step label header */}
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--primary-bright)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            STEP {currentStep + 1} OF {steps.length}
          </span>
          <motion.h3
            key={currentStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginTop: '2px' }}
          >
            {steps[currentStep]?.label}
          </motion.h3>
        </div>

        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-subtle)' }}>
          {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
        </span>
      </div>
    </div>
  )
}
