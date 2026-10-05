import { motion } from 'framer-motion'
import { Award, Sparkles, ArrowRight } from 'lucide-react'

export default function Step5CalibratedRoadmap({
  activeRoleConfig,
  baseMatch,
  verifiedBonusScore,
  finalCalibratedScore,
  onNavigateToRoadmap,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div
        className="gradient-border-card"
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
          border: '1px solid var(--border)',
          textAlign: 'center',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 20px var(--primary-glow)',
          }}
        >
          <Award size={32} color="#FFFFFF" />
        </div>

        <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '3px 12px', borderRadius: '99px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          CALIBRATION COMPLETE
        </span>

        <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text)', margin: '12px 0 6px', fontFamily: 'Outfit, sans-serif' }}>
          Placement Readiness Certified: {finalCalibratedScore}%
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Target Track: <strong>{activeRoleConfig.title}</strong>. Your diagnostic answers have verified your core algorithmic and debugging capabilities. 2 critical missing modules remain.
        </p>

        {/* Comparison Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            maxWidth: '680px',
            margin: '0 auto 28px',
            textAlign: 'left',
          }}
        >
          <div style={{ background: 'var(--surface-soft)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Initial Resume Baseline</span>
            <p style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text)', margin: '2px 0 0' }}>{baseMatch}%</p>
          </div>
          <div style={{ background: 'var(--surface-soft)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Diagnostic Verified Boost</span>
            <p style={{ fontSize: '18px', fontWeight: 900, color: '#10B981', margin: '2px 0 0' }}>+{verifiedBonusScore}%</p>
          </div>
          <div style={{ background: 'var(--surface-soft)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Final Calibrated Score</span>
            <p style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)', margin: '2px 0 0' }}>{finalCalibratedScore}%</p>
          </div>
        </div>

        {/* Transition Button to Learning Hub */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onNavigateToRoadmap}
            className="btn btn-primary"
            style={{
              borderRadius: '99px',
              fontSize: '14px',
              fontWeight: 800,
              padding: '14px 32px',
              gap: '8px',
              boxShadow: '0 4px 20px var(--primary-glow)',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={16} />
            <span>Generate My Personalized Learning Roadmap</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
