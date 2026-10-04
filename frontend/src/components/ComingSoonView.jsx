import { motion } from 'framer-motion'
import { Lock, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'

export default function ComingSoonView({
  title,
  category,
  icon: Icon,
  description,
  features = [],
  onNavigateToActive,
}) {
  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', padding: '20px 0' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gradient-border-card"
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-xl)',
          padding: '44px 36px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Glowing Icon */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            background: 'var(--surface-soft)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 4px 20px var(--primary-glow)',
          }}
        >
          {Icon && <Icon size={32} color="var(--primary)" strokeWidth={2.2} />}
        </div>

        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            padding: '4px 12px',
            borderRadius: '99px',
            background: 'rgba(148, 163, 184, 0.12)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            marginBottom: '14px',
          }}
        >
          <Lock size={11} />
          {category} • COMING SOON
        </span>

        <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text)', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>
          {title}
        </h2>

        <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto 28px', lineHeight: 1.6 }}>
          {description}
        </p>

        {/* Planned Architecture Features Checklist */}
        {features.length > 0 && (
          <div
            style={{
              background: 'var(--surface-soft)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '20px 24px',
              textAlign: 'left',
              marginBottom: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <p style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Planned Module Architecture
            </p>
            {features.map((feat, fIdx) => (
              <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text)' }}>
                <CheckCircle2 size={16} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button: Jump to Active Skill Gap Module */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onNavigateToActive}
            className="btn btn-primary"
            style={{
              borderRadius: '99px',
              fontSize: '13.5px',
              fontWeight: 800,
              padding: '12px 28px',
              gap: '8px',
              boxShadow: '0 4px 16px var(--primary-glow)',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={16} />
            <span>Go to Active Engine: Skill Gap Analysis</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
