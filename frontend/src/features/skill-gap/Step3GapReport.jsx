import { motion } from 'framer-motion'
import { AlertTriangle, Layers, CheckCircle2, Check, ArrowLeft, ArrowRight } from 'lucide-react'

export default function Step3GapReport({
  baseMatch,
  activeRoleConfig,
  onBack,
  onNext,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {/* Overview Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px',
          marginBottom: '24px',
        }}
      >
        {/* Match Score Card */}
        <div
          className="gradient-border-card"
          style={{
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(24px)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: `conic-gradient(var(--primary) 0%, var(--primary) ${baseMatch}%, var(--border) ${baseMatch}% 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>
                {baseMatch}%
              </span>
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginTop: '2px' }}>
                MATCH
              </span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#F59E0B', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
              PLACEMENT READINESS: MODERATE
            </span>
            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '6px 0 2px', fontFamily: 'Outfit, sans-serif' }}>
              Target: {activeRoleConfig.title}
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Baseline calibrated against campus hiring bars. Take the Diagnostic Arena below to verify claimed skills and boost your verified score.
            </p>
          </div>
        </div>

        {/* Competency Metric Stats */}
        <div
          style={{
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(24px)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)' }}>Severity Classification</span>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>8 Core Competencies</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '12px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#10B981', display: 'block' }}>4</span>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#10B981' }}>Verified Strengths</span>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#EF4444', display: 'block' }}>2</span>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#EF4444' }}>Critical Gaps</span>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#F59E0B', display: 'block' }}>2</span>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#F59E0B' }}>Needs Polish</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Severity Matrix */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>
          Detailed Competency Breakdown & Gap Matrix
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '16px' }}>
          {/* Critical Gaps */}
          <div style={{ background: 'var(--surface-glass)', borderRadius: 'var(--radius-lg)', padding: '18px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertTriangle size={16} color="#EF4444" />
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#EF4444' }}>
                CRITICAL MISSING GAPS (High Impact)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Redis & Caching Architecture', reason: 'Mandatory for backend session management & API speed optimization.' },
                { name: 'Docker & Containerization', reason: 'Required for modern cloud deployments and CI/CD development environments.' },
              ].map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text)' }}>{item.name}</span>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#EF4444', background: 'rgba(239, 68, 68, 0.15)', padding: '1px 5px', borderRadius: '3px' }}>
                      HIGH GAP
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Polish */}
          <div style={{ background: 'var(--surface-glass)', borderRadius: 'var(--radius-lg)', padding: '18px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Layers size={16} color="#F59E0B" />
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#F59E0B' }}>
                NEEDS POLISH & PRACTICE (Medium Impact)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'PostgreSQL Indexing & B-Trees', reason: 'Basic SQL present in CV, but query optimization and execution plans need practice.' },
                { name: 'System Design Patterns', reason: 'Foundations of Rate Limiters, Load Balancing, and Microservice boundaries.' },
              ].map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text)' }}>{item.name}</span>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#F59E0B', background: 'rgba(245, 158, 11, 0.15)', padding: '1px 5px', borderRadius: '3px' }}>
                      MED GAP
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div style={{ background: 'var(--surface-glass)', borderRadius: 'var(--radius-lg)', padding: '18px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#10B981' }}>
                VERIFIED STRENGTHS (Matched)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'React.js & State Lifecycle Hooks',
                'JavaScript (ES6+) & Async / Await',
                'RESTful API Conventions & Middleware',
                'Git Branching & GitHub Collaboration',
              ].map((name, idx) => (
                <div key={idx} style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-md)', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>{name}</span>
                  <Check size={14} color="#10B981" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer: Launch Diagnostic Arena */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onBack}
          className="btn btn-outline"
          style={{ padding: '10px 20px', borderRadius: '99px', fontSize: '13px', cursor: 'pointer', gap: '6px' }}
        >
          <ArrowLeft size={15} />
          <span>Back to Benchmark</span>
        </button>

        <button
          onClick={onNext}
          className="btn btn-primary"
          style={{
            padding: '12px 28px',
            borderRadius: '99px',
            fontSize: '14px',
            fontWeight: 800,
            gap: '8px',
            boxShadow: '0 4px 16px var(--primary-glow)',
            cursor: 'pointer',
          }}
        >
          <span>Launch Adaptive Diagnostic Arena (Step 4)</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  )
}
