import { Target, AlertTriangle, TrendingUp, ShieldCheck, Cpu } from 'lucide-react'
import { TOKENS, CornerHUD, HUDTag } from './ui/SkillGapPrimitives'

export default function WhatYouWillGetCard() {
  const outcomes = [
    {
      icon: Target,
      tag: 'ATS Fit',
      title: 'Precision ATS Score',
      desc: 'Benchmarked against industry hiring filters and technical parsers.',
      color: 'var(--accent)',
      bg: 'var(--accent-dim)',
    },
    {
      icon: AlertTriangle,
      tag: 'Skill Gap',
      title: 'Missing Skills Gap Delta',
      desc: 'Ranked by real hiring impact (Critical, High, Medium, Low).',
      color: 'var(--warning)',
      bg: 'var(--warning-dim)',
    },
    {
      icon: TrendingUp,
      tag: 'Readiness',
      title: 'Role Alignment Index',
      desc: 'Semantic match distance from target job requirements.',
      color: 'var(--success)',
      bg: 'var(--success-dim)',
    },
  ]

  return (
    <div className="daksh-glass-card" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span
            className="daksh-glass-pill"
            style={{
              fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--accent)',
              padding: '2px 8px',
              borderRadius: '99px',
            }}
          >
            3 Signals
          </span>
          <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
            Analysis Scope
          </span>
        </div>

        <h3
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--text)',
            margin: '0 0 4px',
            letterSpacing: '-0.015em',
          }}
        >
          Analysis Deliverables
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Your scan produces 3 instant diagnostic signals:
        </p>
      </div>

      {/* Outcome rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {outcomes.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                paddingBottom: idx < outcomes.length - 1 ? '12px' : '0',
                borderBottom: idx < outcomes.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: item.bg,
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                  color: item.color,
                }}
              >
                <Icon size={15} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                    {item.title}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: item.color,
                      background: item.bg,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 500,
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.45,
                    display: 'block',
                    marginTop: '2px',
                  }}
                >
                  {item.desc}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Privacy guarantee badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border)',
          color: 'var(--text-muted)',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        <ShieldCheck size={14} color="var(--success)" />
        <span>Encrypted &amp; confidential evaluation</span>
      </div>
    </div>
  )
}
