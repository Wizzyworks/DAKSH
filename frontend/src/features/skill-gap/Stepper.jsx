import { Check, Lock } from 'lucide-react'

export default function Stepper({ currentStep, onSelectStep }) {
  const steps = [
    { num: 1, title: '1. Your Resume', outcome: 'Resume Verified' },
    { num: 2, title: '2. Match & Skills', outcome: 'ATS score + gaps' },
    { num: 3, title: '3. Quick Check', outcome: '5-min assessment' },
    { num: 4, title: '4. Action Plan', outcome: 'Your roadmap' },
  ]

  return (
    <div
      style={{
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '14px 18px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Top Header Row with Step Counter */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--primary)',
            background: 'var(--primary-dim)',
            padding: '3px 10px',
            borderRadius: '99px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Workflow Progress
        </span>

        <span
          style={{
            fontSize: '12.5px',
            fontWeight: 800,
            color: 'var(--text)',
            fontFamily: 'Outfit, sans-serif',
          }}
        >
          <span className="hidden sm:inline">Step </span>{currentStep} of 4
        </span>
      </div>

      {/* Stepper Ribbon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
        }}
      >
        {steps.map((step) => {
          const isActive = currentStep === step.num
          const isCompleted = currentStep > step.num
          const isUpcoming = currentStep < step.num

          return (
            <div
              key={step.num}
              onClick={() => {
                if (currentStep >= step.num) onSelectStep(step.num)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: currentStep >= step.num ? 'pointer' : 'not-allowed',
                padding: '10px 12px',
                borderRadius: '12px',
                background: isActive
                  ? 'var(--primary-dim)'
                  : isCompleted
                  ? 'rgba(16, 185, 129, 0.05)'
                  : 'var(--surface-soft)',
                border: isActive
                  ? '1.5px solid var(--primary)'
                  : isCompleted
                  ? '1px solid rgba(16, 185, 129, 0.25)'
                  : '1px solid var(--border)',
                transition: 'all 0.2s ease',
                opacity: isUpcoming ? 0.78 : 1,
              }}
            >
              {/* Step Status Badge */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCompleted
                    ? '#10B981'
                    : isActive
                    ? 'var(--gradient-primary)'
                    : 'var(--surface)',
                  border: isCompleted || isActive ? 'none' : '1px solid var(--border)',
                  color: isCompleted || isActive ? '#FFFFFF' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                  flexShrink: 0,
                  boxShadow: isActive ? '0 0 14px var(--primary-glow)' : 'none',
                }}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={3} />
                ) : isUpcoming ? (
                  <Lock size={13} color="var(--text-subtle)" />
                ) : (
                  step.num
                )}
              </div>

              {/* Title & Outcome Line */}
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? 'var(--text)' : isCompleted ? 'var(--text)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {step.title}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isActive
                      ? 'var(--primary)'
                      : isCompleted
                      ? '#10B981'
                      : 'var(--text-subtle)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {step.outcome}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
