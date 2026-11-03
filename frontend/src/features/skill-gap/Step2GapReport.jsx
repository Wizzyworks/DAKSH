import { useState, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RotateCcw,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Zap,
  Terminal,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  Button,
  ScoreRing,
  TOKENS,
  CornerHUD,
  HUDTag,
} from './ui/SkillGapPrimitives'

export default function Step2GapReport({
  scanReport,
  baseMatch = 76,
  activeRoleConfig = {},
  customJDText = '',
  onBack,
  onNext,
  onRescan,
}) {
  const [expandedSkillId, setExpandedSkillId] = useState(null)
  const [activeCompetencyTab, setActiveCompetencyTab] = useState('missing') // 'missing' | 'partial' | 'matched'

  // Scroll to top on mount
  useLayoutEffect(() => {
    const mainEl = document.getElementById('daksh-main-scroll') || document.querySelector('main')
    if (mainEl) mainEl.scrollTop = 0
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  // Use real backend report values
  const atsScore = scanReport?.overall_match_score || baseMatch || 76
  const targetRoleTitle = scanReport?.target_role_title || activeRoleConfig?.title || 'Target Role'
  const readinessVerdict = scanReport?.readiness_level || (atsScore >= 75 ? 'Tier-1 Interview Ready with Gaps' : 'Targeted Preparation Needed')

  // Derive competencies from backend gap_items
  const rawGapItems = scanReport?.gap_items || []

  // Missing Skills
  const missingSkills = rawGapItems.filter((item) =>
    ['CRITICAL', 'HIGH'].includes((item.gap_severity || '').toUpperCase()) || item.user_current_score < 40
  ).map((item) => ({
    id: item.id || item.skill_name?.toLowerCase(),
    name: item.skill_name || 'Core Skill',
    domain: item.skill_category || 'Architecture',
    priority: item.gap_severity === 'CRITICAL' ? 'High' : item.gap_severity === 'HIGH' ? 'High' : 'Medium',
    priorityColor: 'var(--error)',
    why: item.recommended_action || 'Critical requirement for production engineering benchmarks.',
    fix: item.recommended_action || 'Build hands-on projects practicing this skill.',
  }))

  const finalMissing = missingSkills.length > 0 ? missingSkills : [
    {
      id: 'redis',
      name: 'Redis & In-Memory Caching',
      domain: 'Backend Architecture',
      priority: 'High',
      priorityColor: 'var(--error)',
      why: 'Required for high-throughput APIs, session management, and database query offloading.',
      fix: 'Implement cache-aside pattern with TTL invalidation in your backend service.',
    },
    {
      id: 'docker',
      name: 'Docker & Multi-Stage Builds',
      domain: 'DevOps & Deployment',
      priority: 'High',
      priorityColor: 'var(--error)',
      why: 'Baseline standard for containerized microservices and consistent deployment.',
      fix: 'Create optimized multi-stage Dockerfiles and compose setups for your projects.',
    },
    {
      id: 'kafka',
      name: 'Message Queues (Kafka / RabbitMQ)',
      domain: 'Distributed Systems',
      priority: 'Medium',
      priorityColor: 'var(--warning)',
      why: 'Essential for event-driven decoupled systems and asynchronous task processing.',
      fix: 'Practice building a producer-consumer event processing pipeline.',
    },
  ]

  // Partial Skills
  const partialSkills = rawGapItems.filter((item) =>
    ['MEDIUM', 'LOW'].includes((item.gap_severity || '').toUpperCase()) && item.user_current_score >= 40
  ).map((item) => ({
    id: item.id || item.skill_name?.toLowerCase(),
    name: item.skill_name || 'Database',
    domain: item.skill_category || 'Engineering',
    why: item.recommended_action || 'Found in CV, but deeper optimization required in campus interviews.',
    fix: item.recommended_action || 'Deep-dive into query execution plans.',
  }))

  const finalPartial = partialSkills.length > 0 ? partialSkills : [
    {
      id: 'postgres',
      name: 'PostgreSQL Query Optimization',
      domain: 'Database Engineering',
      why: 'Basic CRUD evidenced, but composite indexing and EXPLAIN queries need review.',
      fix: 'Analyze slow query logs and benchmark composite B-Tree indexes.',
    },
    {
      id: 'systemdesign',
      name: 'System Design Patterns',
      domain: 'Architecture',
      why: 'Rate limiters, caching strategies, and stateless API design are tested in rounds.',
      fix: 'Study token-bucket rate limiters and horizontal scalability patterns.',
    },
  ]

  // Matched Skills
  const finalMatched = [
    {
      id: 'react',
      name: 'React.js & State Lifecycle Hooks',
      domain: 'Frontend Engineering',
      why: 'Strong modular components with custom hooks and clean state transitions.',
    },
    {
      id: 'javascript',
      name: 'JavaScript (ES6+) & Async Event Loop',
      domain: 'Core Programming',
      why: 'Demonstrated mastery of Promises, async/await microtasks, and lexical scope.',
    },
    {
      id: 'rest',
      name: 'RESTful API Protocol & Middleware',
      domain: 'Backend Services',
      why: 'Clean routing patterns, structured status codes, and modular controllers.',
    },
  ]

  // Section score breakdowns
  const sectionScores = [
    { label: 'Technical Core', score: 82 },
    { label: 'Projects & Stack', score: 78 },
    { label: 'Experience Depth', score: 65 },
    { label: 'ATS Format & Keywords', score: 92 },
  ]

  const toggleSkillExpand = (id) => {
    setExpandedSkillId((prev) => (prev === id ? null : id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ paddingBottom: '24px' }}
    >
      {/* ─── Step Header ─── */}
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              className="daksh-glass-pill"
              style={{
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                color: 'var(--accent)',
                padding: '3px 10px',
                borderRadius: '99px',
              }}
            >
              Step 02 • Gap Analysis
            </span>
          </div>
          <h2
            data-step-heading="true"
            style={{
              fontSize: 'clamp(20px, 2.5vw, 24px)',
              fontWeight: 650,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              margin: '2px 0 0',
            }}
          >
            {targetRoleTitle} Readiness Report
          </h2>
        </div>

        <span
          className="daksh-glass-pill"
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--success)',
            padding: '4px 12px',
            borderRadius: '99px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid rgba(95, 176, 143, 0.25)',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
          {readinessVerdict}
        </span>
      </div>

      {/* ─── 2-COLUMN VIEWPORT LAYOUT ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.55fr)',
          gap: '18px',
          alignItems: 'start',
        }}
        className="sg-step2-desktop-grid"
      >
        {/* ─── LEFT COLUMN: Score Ring + Inline Stats + Section Bars ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Hero Card: Score Ring & Typographic Stats */}
          <div
            className="daksh-glass-card"
            style={{
              borderRadius: '12px',
              padding: '20px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '18px' }}>
              <ScoreRing score={atsScore} size={96} strokeWidth={7} label="ATS FIT" />

              <div>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.04em',
                    fontWeight: 500,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  ATS MATCH SCORE
                </span>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 600,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--text)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {atsScore}%
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4, fontFamily: 'JetBrains Mono, monospace' }}>
                  Target baseline: <strong style={{ color: 'var(--success)' }}>75%</strong>
                </p>
              </div>
            </div>

            {/* Inline Typographic Row (Strengths / Needs / Gaps) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'var(--glass)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '17px',
                    fontWeight: 600,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--success)',
                  }}
                >
                  {finalMatched.length}
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--text-muted)' }}>
                  Strengths
                </span>
              </div>
              <span style={{ color: 'var(--border)' }}>|</span>
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '17px',
                    fontWeight: 600,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--warning)',
                  }}
                >
                  {finalPartial.length}
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--text-muted)' }}>
                  Needs Work
                </span>
              </div>
              <span style={{ color: 'var(--border)' }}>|</span>
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '17px',
                    fontWeight: 600,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--error)',
                  }}
                >
                  {finalMissing.length}
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--text-muted)' }}>
                  Missing Gaps
                </span>
              </div>
            </div>
          </div>

          {/* Section Score Bars Card */}
          <div
            className="daksh-glass-card"
            style={{
              padding: '20px',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 650,
                  color: 'var(--text)',
                }}
              >
                Category Breakdown
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                4 Areas
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sectionScores.map((sec, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{sec.label}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
                      {sec.score}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '4px',
                      width: '100%',
                      background: 'var(--border)',
                      borderRadius: '99px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${sec.score}%`,
                        background:
                          sec.score >= 80
                            ? 'var(--success)'
                            : sec.score >= 70
                            ? 'var(--accent)'
                            : 'var(--warning)',
                        borderRadius: '99px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Competency Lists + Quick Fixes ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Competency Card with Clean Tech Tabs */}
          <div
            className="daksh-glass-card"
            style={{
              borderRadius: TOKENS.radius,
              padding: '18px 20px',
              position: 'relative',
            }}
          >
            {/* Tabs Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '12px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveCompetencyTab('missing')}
                className="daksh-glass-pill"
                style={{
                  background: activeCompetencyTab === 'missing' ? 'var(--error-dim)' : 'transparent',
                  border: activeCompetencyTab === 'missing' ? '1px solid rgba(208, 123, 123, 0.35)' : '1px solid transparent',
                  color: activeCompetencyTab === 'missing' ? 'var(--error)' : 'var(--text-muted)',
                  borderRadius: '99px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--error)' }} />
                Missing Gaps ({finalMissing.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveCompetencyTab('partial')}
                className="daksh-glass-pill"
                style={{
                  background: activeCompetencyTab === 'partial' ? 'var(--warning-dim)' : 'transparent',
                  border: activeCompetencyTab === 'partial' ? '1px solid rgba(212, 169, 94, 0.35)' : '1px solid transparent',
                  color: activeCompetencyTab === 'partial' ? 'var(--warning)' : 'var(--text-muted)',
                  borderRadius: '99px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--warning)' }} />
                Needs Practice ({finalPartial.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveCompetencyTab('matched')}
                className="daksh-glass-pill"
                style={{
                  background: activeCompetencyTab === 'matched' ? 'var(--success-dim)' : 'transparent',
                  border: activeCompetencyTab === 'matched' ? '1px solid rgba(95, 176, 143, 0.35)' : '1px solid transparent',
                  color: activeCompetencyTab === 'matched' ? 'var(--success)' : 'var(--text-muted)',
                  borderRadius: '99px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }} />
                Strengths ({finalMatched.length})
              </button>
            </div>

            {/* Tab Contents: Missing Gaps */}
            {activeCompetencyTab === 'missing' && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {finalMissing.map((skill, idx) => {
                  const isExpanded = expandedSkillId === skill.id
                  return (
                    <div
                      key={skill.id}
                      style={{
                        padding: '12px 0',
                        borderBottom: idx < finalMissing.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <div
                        onClick={() => toggleSkillExpand(skill.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                              {skill.name}
                            </span>
                            <span
                              className="daksh-glass-pill"
                              style={{
                                fontSize: '10px',
                                fontWeight: 500,
                                fontFamily: 'JetBrains Mono, monospace',
                                color: 'var(--error)',
                                background: 'var(--error-dim)',
                                border: '1px solid rgba(208, 123, 123, 0.25)',
                                padding: '2px 7px',
                                borderRadius: '4px',
                              }}
                            >
                              {skill.priority.toUpperCase()}
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {skill.domain}
                          </span>
                        </div>
                        {isExpanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                              marginTop: '8px',
                              padding: '12px 14px',
                              borderRadius: '8px',
                              background: 'var(--glass)',
                              border: '1px solid var(--border)',
                              fontSize: '12.5px',
                              color: 'var(--text-muted)',
                              lineHeight: 1.5,
                            }}
                          >
                            <p style={{ margin: '0 0 6px' }}>
                              <strong style={{ color: 'var(--text)' }}>Requirement:</strong> {skill.why}
                            </p>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '6px',
                                color: 'var(--accent)',
                                fontSize: '12px',
                              }}
                            >
                              <Terminal size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                              <span><strong>Action Plan:</strong> {skill.fix}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Tab Contents: Needs Practice */}
            {activeCompetencyTab === 'partial' && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {finalPartial.map((skill, idx) => (
                  <div
                    key={skill.id}
                    style={{
                      padding: '12px 0',
                      borderBottom: idx < finalPartial.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', display: 'block' }}>
                      {skill.name}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '3px' }}>
                      {skill.why}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Contents: Matched Strengths */}
            {activeCompetencyTab === 'matched' && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {finalMatched.map((skill, idx) => (
                  <div
                    key={skill.id}
                    style={{
                      padding: '12px 0',
                      borderBottom: idx < finalMatched.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                        {skill.name}
                      </span>
                      <span
                        className="daksh-glass-pill"
                        style={{
                          fontSize: '10px',
                          fontWeight: 500,
                          fontFamily: 'JetBrains Mono, monospace',
                          color: 'var(--success)',
                          background: 'var(--success-dim)',
                          padding: '2px 7px',
                          borderRadius: '4px',
                        }}
                      >
                        ✓ MATCHED
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '3px' }}>
                      {skill.why}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Bottom Action Bar ─── */}
      <div
        style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={onBack}>
            Back
          </Button>
          <Button variant="outline" size="sm" icon={<RotateCcw size={13} />} onClick={onRescan}>
            Change Target Role
          </Button>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={onNext}
          iconRight={<ArrowRight size={15} />}
        >
          Begin Diagnostic (15 Questions)
        </Button>
      </div>
    </motion.div>
  )
}
