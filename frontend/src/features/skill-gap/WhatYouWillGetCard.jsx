import { Sparkles, Target, Zap, ShieldCheck, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react'

export default function WhatYouWillGetCard() {
  const deliverables = [
    {
      icon: Target,
      title: 'Precision ATS Score',
      desc: 'ATS parse score calibrated for Tier-1 applicant tracking filters.',
      color: '#3B82F6',
    },
    {
      icon: AlertTriangle,
      title: 'Missing Skills Gap Delta',
      desc: 'Categorized into High, Medium, and Low placement impact.',
      color: '#F59E0B',
    },
    {
      icon: TrendingUp,
      title: 'Role Match Alignment %',
      desc: 'Semantic match against real hiring rubrics and optional JD.',
      color: '#10B981',
    },
    {
      icon: Zap,
      title: '5-Minute Diagnostic Arena',
      desc: 'Verify hands-on skills to boost your readiness certificate score.',
      color: '#8B5CF6',
    },
  ]

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient Top Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Card Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={16} color="var(--primary)" />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Intelligence Report Preview
          </span>
        </div>
        <h3
          style={{
            margin: '0 0 6px',
            fontSize: '18px',
            fontWeight: 900,
            fontFamily: 'Outfit, sans-serif',
            color: 'var(--text)',
            letterSpacing: '-0.01em',
          }}
        >
          What You&apos;ll Get
        </h3>
        <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Your scan instantly unpacks your profile into actionable placement insights:
        </p>
      </div>

      {/* Deliverable Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {deliverables.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'var(--surface-soft)',
                border: '1px solid var(--border)',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Icon size={18} color={item.color} />
              </div>

              <div>
                <strong style={{ fontSize: '13.5px', color: 'var(--text)', display: 'block', marginBottom: '2px' }}>
                  {item.title}
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4, display: 'block' }}>
                  {item.desc}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Trust & Privacy Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          fontSize: '12px',
          color: '#10B981',
          fontWeight: 600,
        }}
      >
        <ShieldCheck size={16} />
        <span>Private & Confidential • Never shared with third parties</span>
      </div>
    </div>
  )
}
