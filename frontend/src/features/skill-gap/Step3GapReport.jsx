import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Zap,
  Check,
  ChevronDown,
  Clock,
  TrendingUp,
  FileText,
  SlidersHorizontal,
} from 'lucide-react'

// Comprehensive mock competency data
// // TODO: wire to API - replace with real backend semantic distance extraction
const MOCK_COMPETENCY_DATA = [
  // Missing (Critical / High / Medium / Low)
  {
    id: 'redis',
    name: 'Redis & In-Memory Caching',
    domain: 'Backend Architecture',
    column: 'missing',
    priority: 'High',
    priorityColor: '#EF4444',
    reason: 'Essential for high-throughput APIs, distributed token caching, and session management.',
    fix: 'Implement Redis caching with TTL for heavy SQL queries in your backend API.',
  },
  {
    id: 'docker',
    name: 'Docker & Multi-Stage Builds',
    domain: 'DevOps & Deployment',
    column: 'missing',
    priority: 'High',
    priorityColor: '#EF4444',
    reason: 'Industry baseline for containerizing microservices and reproducible dev environments.',
    fix: 'Add a Dockerfile and docker-compose.yml to your flagship full-stack project.',
  },
  {
    id: 'kafka',
    name: 'Message Queues (Kafka / RabbitMQ)',
    domain: 'Distributed Systems',
    column: 'missing',
    priority: 'Medium',
    priorityColor: '#F59E0B',
    reason: 'Required for asynchronous background job workers and decoupled messaging.',
    fix: 'Explore producer-consumer pub/sub patterns for asynchronous event processing.',
  },

  // Partial (Needs Practice)
  {
    id: 'postgres',
    name: 'PostgreSQL Indexing & Optimization',
    domain: 'Database Engineering',
    column: 'partial',
    reason: 'Basic SQL CRUD found, but EXPLAIN query planner and B-tree composite indexing need review.',
    fix: 'Practice analyzing execution plans and adding composite indexes on foreign keys.',
  },
  {
    id: 'sysdesign',
    name: 'System Design Patterns',
    domain: 'Software Architecture',
    column: 'partial',
    reason: 'Load balancing, rate limiters, and cache-aside patterns are expected in technical interviews.',
    fix: 'Review horizontal scaling principles and API rate limiter token bucket algorithms.',
  },
  {
    id: 'testing',
    name: 'Automated Unit & Integration Testing',
    domain: 'Quality & Assurance',
    column: 'partial',
    reason: 'Testing libraries mentioned without evidence of CI test coverage in repositories.',
    fix: 'Write Jest or Vitest test suites covering core business logic routes.',
  },

  // Matched (Verified Strengths)
  {
    id: 'react',
    name: 'React.js & State Lifecycle Hooks',
    domain: 'Frontend Engineering',
    column: 'matched',
    reason: 'Strong projects with clean custom hooks, memoization, and modular component architecture.',
    fix: 'Keep building! Focus on React 19 Actions and Server Components.',
  },
  {
    id: 'js',
    name: 'JavaScript (ES6+) & Asynchronous Event Loop',
    domain: 'Core Programming',
    column: 'matched',
    reason: 'Proven mastery of Promises, async/await microtask queues, and closures in projects.',
    fix: 'Solid foundation verified.',
  },
  {
    id: 'rest',
    name: 'RESTful API Protocol & Middleware',
    domain: 'Backend Engineering',
    column: 'matched',
    reason: 'Demonstrated proficiency in route handlers, status codes, and JWT authentication.',
    fix: 'Solid foundation verified.',
  },
  {
    id: 'git',
    name: 'Git Branching & GitHub Collaboration',
    domain: 'Workflow & Version Control',
    column: 'matched',
    reason: 'Clean commit histories, semantic branching, and repository structure.',
    fix: 'Solid foundation verified.',
  },
]

// // TODO: wire to API - Section-wise score breakdown from ATS engine
const MOCK_SECTION_SCORES = [
  { section: 'Technical Skills Alignment', score: 84, color: '#3B82F6' },
  { section: 'Projects & Practical Architecture', score: 76, color: '#10B981' },
  { section: 'Experience & Practical Evidence', score: 68, color: '#F59E0B' },
  { section: 'ATS Formatting & Keyword Density', score: 92, color: '#8B5CF6' },
]

export default function Step3GapReport({
  baseMatch = 76,
  activeRoleConfig = {},
  customJDText = '',
  onBack,
  onNext,
  onRescan,
}) {
  // Animated count-up score
  const [animatedScore, setAnimatedScore] = useState(0)
  const targetScore = baseMatch || 76

  useEffect(() => {
    let start = 0
    const duration = 1200
    const intervalTime = 20
    const increment = targetScore / (duration / intervalTime)

    const timer = setInterval(() => {
      start += increment
      if (start >= targetScore) {
        setAnimatedScore(targetScore)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.round(start))
      }
    }, intervalTime)

    return () => clearInterval(timer)
  }, [targetScore])

  // Score color grading
  const scoreColor =
    animatedScore >= 75 ? '#10B981' : animatedScore >= 50 ? '#F59E0B' : '#EF4444'
  const scoreBgGlow =
    animatedScore >= 75
      ? 'rgba(16, 185, 129, 0.2)'
      : animatedScore >= 50
      ? 'rgba(245, 158, 11, 0.2)'
      : 'rgba(239, 68, 68, 0.2)'
  const scoreVerdict =
    animatedScore >= 75
      ? 'Competitive Match'
      : animatedScore >= 50
      ? 'Moderate Alignment'
      : 'Core Gaps Identified'

  // Categorize competencies into 3 columns
  const matchedSkills = MOCK_COMPETENCY_DATA.filter((c) => c.column === 'matched')
  const partialSkills = MOCK_COMPETENCY_DATA.filter((c) => c.column === 'partial')
  const missingSkills = MOCK_COMPETENCY_DATA.filter((c) => c.column === 'missing')

  // Top 3 quick fixes
  const topQuickFixes = [
    {
      action: 'Add In-Memory Caching (Redis)',
      impact: '+12% ATS Bump',
      desc: 'Tier-1 backend rubrics mandate Redis for session tokens and high-concurrency API performance.',
    },
    {
      action: 'Containerize Core Projects with Docker',
      impact: '+9% ATS Bump',
      desc: 'Add a multi-stage Dockerfile and docker-compose.yml to showcase cloud-native readiness.',
    },
    {
      action: 'Include Database Indexing in Project Readmes',
      impact: '+6% ATS Bump',
      desc: 'Specify database query optimization (B-Trees, foreign key indexes) in your bullet points.',
    },
  ]

  const roleTitle = activeRoleConfig?.title || 'Target Role'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
      style={{ position: 'relative' }}
    >
      {/* ─── Header & Re-scan Action ─── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '26px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 'clamp(20px, 2.6vw, 26px)',
              fontWeight: 900,
              fontFamily: 'Outfit, sans-serif',
              color: 'var(--text)',
              margin: '0 0 6px',
              letterSpacing: '-0.015em',
            }}
          >
            Step 2: ATS Score &amp; Skill Gap Breakdown
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
            Semantic gap delta benchmarked against hiring standards for{' '}
            <strong style={{ color: 'var(--text)' }}>{roleTitle}</strong>
            {customJDText?.trim() ? ' and your custom campus drive JD' : ''}.
          </p>
        </div>

        <button
          type="button"
          onClick={onRescan}
          className="btn btn-outline"
          style={{
            borderRadius: '99px',
            padding: '9px 18px',
            fontSize: '12.5px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={14} />
          <span>Re-scan with Different Role / JD</span>
        </button>
      </div>

      {/* ─── Hero Overview Deck (Big Score Ring + Role Fit Summary) ─── */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        {/* Left: Big Animated Score Ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '108px', height: '108px', flexShrink: 0 }}>
            <svg width="108" height="108" viewBox="0 0 108 108">
              <circle
                cx="54"
                cy="54"
                r="46"
                stroke="var(--surface-soft)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="54"
                cy="54"
                r="46"
                stroke={scoreColor}
                strokeWidth="8"
                strokeDasharray={289}
                strokeDashoffset={289 - (289 * animatedScore) / 100}
                strokeLinecap="round"
                fill="none"
                style={{
                  transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease',
                  filter: `drop-shadow(0 0 10px ${scoreBgGlow})`,
                }}
              />
            </svg>

            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>
                {animatedScore}%
              </span>
              <span style={{ fontSize: '9px', fontWeight: 800, color: scoreColor, marginTop: '2px' }}>
                ATS FIT
              </span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: scoreColor,
                  background: scoreBgGlow,
                  padding: '3px 10px',
                  borderRadius: '99px',
                  border: `1px solid ${scoreColor}40`,
                }}
              >
                {scoreVerdict}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                {roleTitle} Track
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', maxWidth: '520px', lineHeight: 1.5 }}>
              Your profile demonstrates reliable foundational competencies. Addressing <strong>2 critical missing technologies</strong> will elevate your score into the top placement percentile.
            </p>
          </div>
        </div>

        {/* Right: Quick Breakdown Metric Chips */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ padding: '10px 18px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', display: 'block' }}>Verified Strengths</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#10B981' }}>{matchedSkills.length} Skills</span>
          </div>

          <div style={{ padding: '10px 18px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', display: 'block' }}>Needs Practice</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#F59E0B' }}>{partialSkills.length} Skills</span>
          </div>

          <div style={{ padding: '10px 18px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444', display: 'block' }}>Missing Gaps</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#EF4444' }}>{missingSkills.length} Skills</span>
          </div>
        </div>
      </div>

      {/* ─── 3-Column Skills Breakdown (Matched, Partial, Missing) ─── */}
      <div style={{ marginBottom: '32px' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 900,
            fontFamily: 'Outfit, sans-serif',
            color: 'var(--text)',
            margin: '0 0 16px',
            letterSpacing: '-0.01em',
          }}
        >
          Competency Gap Matrix
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '18px',
            alignItems: 'start',
          }}
        >
          {/* Column 1: Missing Gaps (High / Medium / Low priority tags) */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                <strong style={{ fontSize: '14px', color: '#EF4444' }}>Missing Gaps</strong>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-subtle)' }}>
                {missingSkills.length} Detected
              </span>
            </div>

            {missingSkills.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--text)' }}>{item.name}</strong>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: item.priorityColor,
                      background: `${item.priorityColor}15`,
                      border: `1px solid ${item.priorityColor}30`,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      flexShrink: 0,
                    }}
                  >
                    {item.priority} Priority
                  </span>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {item.reason}
                </p>
                <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                  Fix: {item.fix}
                </div>
              </div>
            ))}
          </div>

          {/* Column 2: Partial Skills (Needs Polish) */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
                <strong style={{ fontSize: '14px', color: '#D97706' }}>Needs Practice</strong>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-subtle)' }}>
                {partialSkills.length} Detected
              </span>
            </div>

            {partialSkills.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                }}
              >
                <strong style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  {item.name}
                </strong>
                <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {item.reason}
                </p>
                <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                  Practice: {item.fix}
                </div>
              </div>
            ))}
          </div>

          {/* Column 3: Matched Competencies (Verified Strengths) */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                <strong style={{ fontSize: '14px', color: '#10B981' }}>Verified Strengths</strong>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-subtle)' }}>
                {matchedSkills.length} Detected
              </span>
            </div>

            {matchedSkills.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <CheckCircle2 size={15} color="#10B981" />
                  <strong style={{ fontSize: '13px', color: 'var(--text)' }}>{item.name}</strong>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Section-Wise Score Bars & Top 3 Quick Fixes ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {/* Section-Wise ATS Breakdown */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '22px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text)', fontFamily: 'Outfit, sans-serif' }}>
              Section-Wise Rubric Performance
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>ATS Calibrated</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {MOCK_SECTION_SCORES.map((sec, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{sec.section}</span>
                  <span style={{ fontWeight: 800, color: sec.color }}>{sec.score}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--surface-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sec.score}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    style={{ height: '100%', background: sec.color, borderRadius: '99px' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 Quick Fixes Card */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '22px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={16} color="var(--primary)" />
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text)', fontFamily: 'Outfit, sans-serif' }}>
              Top 3 Placement Quick Fixes
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topQuickFixes.map((fix, fIdx) => (
              <div
                key={fIdx}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--text)' }}>{fix.action}</strong>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: '#10B981',
                      background: 'rgba(16, 185, 129, 0.12)',
                      padding: '2px 8px',
                      borderRadius: '99px',
                    }}
                  >
                    {fix.impact}
                  </span>
                </div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4, display: 'block' }}>
                  {fix.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Footer Action Bar ─── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          paddingTop: '8px',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="btn btn-outline"
          style={{
            padding: '11px 22px',
            borderRadius: '99px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ArrowLeft size={15} />
          <span>Back to Resume &amp; Track Setup</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="btn-rgb-glow"
          style={{
            padding: '13px 30px',
            borderRadius: '99px',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Verify these skills with a Quick Check (Step 3)</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  )
}
