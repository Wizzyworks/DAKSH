import React, { useState } from 'react'
import { ArrowRight, BookOpen, Sparkles, Target, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react'
import SpiderwebRadarChart from '../skill-gap/ui/SpiderwebRadarChart'

export default function HomeView({ onNavigateToActive, onNavigateToLearning }) {
  // Preset default roles if user has multiple targets tracked
  const [trackedRoles, setTrackedRoles] = useState([
    {
      id: 'fullstack',
      title: 'Full Stack Developer',
      readiness: 78,
      isPrimary: true,
      competencies: [
        { name: 'Core JS & Async', benchmark: 85, candidateScore: 92, status: 'strong' },
        { name: 'Problem Solving', benchmark: 85, candidateScore: 90, status: 'strong' },
        { name: 'State Management', benchmark: 85, candidateScore: 81, status: 'strong' },
        { name: 'Backend APIs', benchmark: 85, candidateScore: 76, status: 'gap' },
        { name: 'System Design', benchmark: 80, candidateScore: 68, status: 'gap' },
        { name: 'DevOps & CI/CD', benchmark: 75, candidateScore: 62, status: 'gap' },
      ],
      lowestGap: 'DevOps & CI/CD (62%)',
    },
    {
      id: 'backend',
      title: 'Backend Engineer',
      readiness: 64,
      isPrimary: false,
      competencies: [
        { name: 'Node.js & Python', benchmark: 85, candidateScore: 85, status: 'strong' },
        { name: 'SQL & Indexing', benchmark: 85, candidateScore: 78, status: 'gap' },
        { name: 'Redis Caching', benchmark: 80, candidateScore: 50, status: 'gap' },
        { name: 'Kafka Queues', benchmark: 75, candidateScore: 40, status: 'gap' },
        { name: 'System Architecture', benchmark: 85, candidateScore: 65, status: 'gap' },
      ],
      lowestGap: 'Kafka Queues (40%)',
    },
  ])

  const [activeRoleId, setActiveRoleId] = useState('fullstack')
  const currentRole = trackedRoles.find((r) => r.id === activeRoleId) || trackedRoles[0]

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(12px, 2vw, 24px)' }}>
      {/* 1. Header Banner */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: '9999px',
            background: 'var(--primary-dim)',
            color: 'var(--accent)',
            fontSize: '11.5px',
            fontWeight: 600,
            marginBottom: '8px',
            border: '1px solid var(--border)',
          }}
        >
          <Sparkles size={12} />
          <span>Competency Command Center</span>
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 2.4vw, 28px)', fontWeight: 600, color: 'var(--text)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Career Readiness &amp; Competency Hub
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, maxWidth: '640px', lineHeight: 1.55 }}>
          Your real-time skill telemetry synced across resume scans, diagnostic arena benchmarks, and learning hub sprints.
        </p>
      </div>

      {/* 2. Target Role Switcher Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginRight: '4px' }}>
          Target Track:
        </span>
        {trackedRoles.map((role) => {
          const isActive = role.id === activeRoleId
          return (
            <button
              key={role.id}
              onClick={() => setActiveRoleId(role.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '6px 13px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: isActive ? 'var(--primary-dim)' : 'var(--glass)',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 180ms ease-out',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <Target size={13} />
              <span>{role.title}</span>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11.5px', opacity: 0.9 }}>
                ({role.readiness}%)
              </span>
              {role.isPrimary && (
                <span style={{ fontSize: '10.5px', color: 'var(--warning)', fontWeight: 600 }}>★ Primary</span>
              )}
            </button>
          )
        })}

        <button
          onClick={onNavigateToActive}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            border: '1px dashed var(--border)',
            background: 'transparent',
            color: 'var(--text-subtle)',
            transition: 'color 180ms ease',
          }}
        >
          + Analyze New Role
        </button>
      </div>

      {/* 3. Hero Spiderweb Radar & Readiness Overview */}
      <div
        className="daksh-glass-card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          padding: 'clamp(20px, 3vw, 32px)',
          marginBottom: '28px',
        }}
      >
        {/* Left: The Dynamic Spiderweb Chart */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
              Competency Spiderweb
            </span>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
              Live 6-Axis Evaluation
            </span>
          </div>
          <SpiderwebRadarChart
            size={360}
            competencies={currentRole.competencies}
            targetLabel={`${currentRole.title} Target`}
            candidateLabel="Your Verified Level"
          />
        </div>

        {/* Right: Readiness Score & Action Sprint */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '18px' }}>
              <div
                style={{
                  fontSize: '44px',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  lineHeight: 1,
                  fontFamily: 'var(--font-mono, monospace)',
                  letterSpacing: '-0.03em',
                }}
              >
                {currentRole.readiness}%
              </div>
              <div>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', display: 'block' }}>
                  Readiness Score
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Benchmark for {currentRole.title}
                </span>
              </div>
            </div>

            {/* Quick Strengths and Gaps list */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Verified Strengths
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {currentRole.competencies.filter((c) => c.candidateScore >= c.benchmark).map((c) => (
                  <span
                    key={c.name}
                    style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'var(--success-dim)',
                      color: 'var(--success)',
                      fontWeight: 500,
                      border: '1px solid rgba(95, 176, 143, 0.22)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>✓</span>
                    <span>{c.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', opacity: 0.85 }}>
                      ({c.candidateScore}%)
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Target Gaps to Address
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {currentRole.competencies.filter((c) => c.candidateScore < c.benchmark).map((c) => (
                  <span
                    key={c.name}
                    style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'var(--error-dim)',
                      color: 'var(--error)',
                      fontWeight: 500,
                      border: '1px solid rgba(208, 123, 123, 0.22)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>⚠</span>
                    <span>{c.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', opacity: 0.85 }}>
                      ({c.candidateScore}%)
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Bridge: Connect to Learning Hub */}
          <div
            style={{
              padding: '16px 18px',
              borderRadius: '10px',
              background: 'var(--glass)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                Recommended: Boost {currentRole.lowestGap}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Complete targeted sprint modules to calibrate and expand your competency score.
              </div>
            </div>

            <button
              onClick={onNavigateToLearning || onNavigateToActive}
              className="btn btn-primary"
              style={{ fontSize: '12.5px', padding: '8px 14px' }}
            >
              Start Sprint
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
