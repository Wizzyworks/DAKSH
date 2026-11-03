import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Sparkles, ArrowRight, Bell, Check, Terminal, Cpu } from 'lucide-react'

export default function ComingSoonView({
  title,
  category,
  icon: Icon,
  description,
  features = [],
  onNavigateToActive,
  onNavigateToHome,
}) {
  const [accessRequested, setAccessRequested] = useState(false)

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', padding: '16px 0 40px' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="gradient-border-card"
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glowing Icon Header */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'var(--surface-soft)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            boxShadow: '0 4px 20px var(--primary-glow)',
          }}
        >
          {Icon && <Icon size={30} color="var(--accent)" strokeWidth={2.2} />}
        </div>

        {/* Status Pill Badge */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '99px',
            background: 'var(--accent-dim)',
            color: 'var(--accent)',
            border: '1px solid rgba(107, 124, 245, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '14px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <Layers size={12} />
          {category} • LABS PREVIEW
        </span>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px', fontFamily: 'var(--font-serif)' }}>
          {title}
        </h2>

        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          {description}
        </p>

        {/* Interactive Architecture Roadmap Preview */}
        {features.length > 0 && (
          <div
            style={{
              background: 'var(--surface-soft)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '20px 22px',
              textAlign: 'left',
              marginBottom: '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Engine Specification &amp; Pipeline
              </span>
              <span style={{ fontSize: '11px', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 8px', borderRadius: '4px' }}>
                Stage: In Development
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {features.map((feat, fIdx) => (
                <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text)' }}>
                  <Sparkles size={14} color="var(--accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls: Early Access Notification + Switch View */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {onNavigateToHome && (
            <button
              type="button"
              onClick={onNavigateToHome}
              className="btn btn-outline"
              style={{
                borderRadius: '99px',
                fontSize: '13px',
                fontWeight: 650,
                padding: '10px 22px',
                cursor: 'pointer',
              }}
            >
              <span>Back to Dashboard Home</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setAccessRequested((r) => !r)}
            className="btn btn-outline"
            style={{
              borderRadius: '99px',
              fontSize: '13px',
              fontWeight: 650,
              padding: '10px 22px',
              gap: '6px',
              cursor: 'pointer',
              borderColor: accessRequested ? 'var(--success)' : 'var(--border)',
              color: accessRequested ? 'var(--success)' : 'var(--text)',
              background: accessRequested ? 'var(--success-dim)' : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {accessRequested ? <Check size={14} /> : <Bell size={14} />}
            <span>{accessRequested ? 'Priority Access Confirmed' : 'Notify When Live'}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToActive}
            className="btn btn-primary"
            style={{
              borderRadius: '99px',
              fontSize: '13px',
              fontWeight: 700,
              padding: '10px 24px',
              gap: '7px',
              boxShadow: '0 4px 16px var(--primary-glow)',
              cursor: 'pointer',
            }}
          >
            <span>Switch to Skill Gap Engine</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
