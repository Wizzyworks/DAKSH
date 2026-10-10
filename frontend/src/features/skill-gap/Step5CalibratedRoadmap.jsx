import { motion } from 'framer-motion'
import { Award, Sparkles, ArrowRight, Zap, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function Step5CalibratedRoadmap({
  activeRoleConfig,
  baseMatch,
  verifiedBonusScore,
  finalCalibratedScore,
  onNavigateToRoadmap,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
    >
      {/* Grand Victory & Action Container (Theme-Aware & Responsive) */}
      <div
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'clamp(24px, 4vw, 36px) clamp(16px, 3vw, 32px)',
          border: '1px solid var(--border)',
          textAlign: 'center',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Floating Glowing Seal */}
        <motion.div
          animate={{ y: [-3, 4, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 28px var(--primary-glow)',
          }}
        >
          <Award size={34} color="#FFFFFF" />
        </motion.div>

        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#10B981',
            background: 'rgba(16, 185, 129, 0.12)',
            padding: '4px 14px',
            borderRadius: '99px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            letterSpacing: '0.04em',
          }}
        >
          STEP 4: ACTION PLAN READY
        </span>

        <h2
          style={{
            fontSize: 'clamp(22px, 3.2vw, 28px)',
            fontWeight: 900,
            color: 'var(--text)',
            margin: '14px 0 8px',
            fontFamily: 'Outfit, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          Placement Readiness Certified: {finalCalibratedScore}%
        </h2>
        <p
          style={{
            fontSize: '14.5px',
            color: 'var(--text-muted)',
            maxWidth: '620px',
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}
        >
          Target Track: <strong>{activeRoleConfig.title}</strong>. Your practical answers have verified your core algorithmic and debugging capabilities. 2 targeted sprint modules remain to reach 100% readiness.
        </p>

        {/* Delta Comparison Horizontal Ribbon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            maxWidth: '720px',
            margin: '0 auto 32px',
            padding: '16px 20px',
            background: 'var(--surface-soft)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ textAlign: 'center', padding: '0 12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Resume Baseline
            </span>
            <p style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text)', margin: '2px 0 0' }}>{baseMatch}%</p>
          </div>

          <span style={{ fontSize: '18px', color: 'var(--text-subtle)', opacity: 0.6 }}>➔</span>

          <div style={{ textAlign: 'center', padding: '0 12px' }}>
            <span style={{ fontSize: '11px', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Skill Check Boost
            </span>
            <p style={{ fontSize: '20px', fontWeight: 900, color: '#10B981', margin: '2px 0 0' }}>+{verifiedBonusScore}%</p>
          </div>

          <span style={{ fontSize: '18px', color: 'var(--text-subtle)', opacity: 0.6 }}>➔</span>

          <div style={{ textAlign: 'center', padding: '0 12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Certified Final
            </span>
            <p style={{ fontSize: '20px', fontWeight: 900, color: 'var(--primary)', margin: '2px 0 0' }}>{finalCalibratedScore}%</p>
          </div>
        </div>

        {/* Actionable Learning Sprints Preview Deck */}
        <div style={{ maxWidth: '780px', margin: '0 auto 32px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Zap size={16} color="var(--primary)" />
            <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Immediate Sprints to Close Your Gaps
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '14px' }}>
            {/* Sprint 1 */}
            <div
              style={{
                background: 'var(--surface-soft)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text)' }}>
                  Sprint 1: Redis & Distributed Caching
                </span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#E11D48', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '2px 8px', borderRadius: '4px' }}>
                  PRIORITY 1
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 10px', lineHeight: 1.45 }}>
                Master key-value storage, LRU cache eviction, and API rate-limiting patterns.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'var(--text-subtle)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> ~4 Hours Sprint
                </span>
                <span style={{ color: '#059669', fontWeight: 700 }}>+12% Readiness Boost</span>
              </div>
            </div>

            {/* Sprint 2 */}
            <div
              style={{
                background: 'var(--surface-soft)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text)' }}>
                  Sprint 2: Docker & Containerization
                </span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#D97706', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '2px 8px', borderRadius: '4px' }}>
                  PRIORITY 2
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 10px', lineHeight: 1.45 }}>
                Build multi-stage Dockerfiles, Docker Compose environments, and deployment pipelines.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'var(--text-subtle)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> ~6 Hours Sprint
                </span>
                <span style={{ color: '#059669', fontWeight: 700 }}>+10% Readiness Boost</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grand Radiant Call-To-Action */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onNavigateToRoadmap}
            className="btn btn-primary"
            style={{
              borderRadius: '99px',
              fontSize: '14.5px',
              fontWeight: 800,
              padding: '14px clamp(20px, 4vw, 36px)',
              gap: '10px',
              boxShadow: '0 4px 24px var(--primary-glow)',
              cursor: 'pointer',
              letterSpacing: '0.01em',
              maxWidth: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              textAlign: 'center',
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
