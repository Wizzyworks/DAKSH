import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Compass,
  Sparkles,
  Plus,
  Zap,
  RotateCcw,
  Bot,
} from 'lucide-react'

export default function LearningHubEmptyState({ onCreatePath, onNavigateToHome }) {
  const highlights = [
    { icon: Zap, label: 'Adaptive', desc: 'Custom pace' },
    { icon: RotateCcw, label: 'Spaced Recall', desc: '7-14-21-30d' },
    { icon: Bot, label: 'SETU AI', desc: 'Smart bundling' },
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        padding: '8px 16px 40px',
        fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
      }}
    >
      {/* Top-Corner Back Button */}
      {onNavigateToHome && (
        <div style={{ position: 'absolute', top: '8px', left: '16px', zIndex: 10 }}>
          <button
            type="button"
            onClick={onNavigateToHome}
            className="btn btn-outline btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '99px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              background: 'var(--surface-card)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <ArrowLeft size={13} />
            <span>Back to Dashboard Home</span>
          </button>
        </div>
      )}

      <div
        style={{
          maxWidth: '620px',
          margin: '0 auto',
          paddingTop: '20px',
        }}
      >
      {/* 1. Header Section */}
      <div style={{ marginBottom: '22px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            background: 'var(--primary-dim)',
            border: '1px solid var(--border-accent)',
            marginBottom: '10px',
          }}
        >
          <Sparkles size={12} style={{ color: 'var(--accent)' }} />
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: 'var(--accent)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ADAPTIVE LEARNING ECOSYSTEM
          </span>
        </div>

        <h1
          style={{
            fontSize: '26px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            margin: '0 0 6px 0',
            lineHeight: 1.2,
          }}
        >
          My Learning Hub
        </h1>

        <p
          style={{
            fontSize: '13.5px',
            color: 'var(--text-muted)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Personalized competency tracks calibrated to your civil service or technical goals.
        </p>
      </div>

      {/* 2. Soft Floating Card (Compact, Organic Curves, Non-boxy) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'var(--surface-card)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: '26px',
          padding: '28px 26px 24px',
          boxShadow: 'var(--shadow-glass), 0 10px 30px -8px rgba(15, 23, 42, 0.07)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soft ambient background glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Organic Concentric Rings (Compact motif, No Flowchart) */}
          <div
            style={{
              position: 'relative',
              width: '72px',
              height: '72px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer dashed ring */}
            <div
              style={{
                position: 'absolute',
                inset: '-6px',
                borderRadius: '50%',
                border: '1px dashed var(--border-accent)',
                opacity: 0.6,
                animation: 'spin 24s linear infinite',
              }}
            />
            {/* Middle halo ring */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'var(--primary-dim)',
                border: '1px solid var(--border-strong)',
              }}
            />
            {/* Inner core circle with icon */}
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                color: 'var(--on-acc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px -3px rgba(91, 108, 240, 0.4)',
              }}
            >
              <Compass size={22} />
            </div>
          </div>

          {/* Card Title */}
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.015em',
              color: 'var(--text)',
              margin: '0 0 8px 0',
              lineHeight: 1.3,
            }}
          >
            Ready to start your learning journey?
          </h2>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: '13.5px',
              color: 'var(--text-muted)',
              lineHeight: 1.55,
              maxWidth: '460px',
              margin: '0 0 22px 0',
            }}
          >
            Create your custom roadmap with curated video lectures, or let SETU AI proactively recommend high-yield scenario quizzes and spaced repetition reviews.
          </p>

          {/* Action Button: + Create Your Learning Path */}
          <motion.button
            onClick={onCreatePath}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 26px',
              borderRadius: '9999px',
              background: 'var(--gradient-primary)',
              color: 'var(--on-acc)',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              boxShadow: '0 6px 20px -3px rgba(91, 108, 240, 0.45), var(--shadow-sm)',
              marginBottom: '22px',
              transition: 'box-shadow var(--transition)',
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span> Create Your Learning Path</span>
          </motion.button>

          {/* Micro Pill Highlights */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)',
            }}
          >
            {highlights.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    background: 'var(--surface-soft)',
                    border: '1px solid var(--border)',
                    fontSize: '11.5px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'var(--primary-dim)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={11} />
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.label}:</span>{' '}
                    <span>{item.desc}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
</div>
  )
}
