import { motion } from 'framer-motion'
import { AlertTriangle, Layers, CheckCircle2, Check, ArrowLeft, ArrowRight, TrendingDown, TrendingUp } from 'lucide-react'

export default function Step3GapReport({
  baseMatch = 72,
  activeRoleConfig = {},
  gapReport = null,
  onBack,
  onNext,
}) {
  // 1. Dynamic Match & Readiness Metrics
  const matchScore =
    gapReport?.overall_match_score !== undefined && gapReport?.overall_match_score !== null
      ? Math.round(Number(gapReport.overall_match_score))
      : baseMatch

  const readiness =
    gapReport?.readiness_level ||
    (matchScore >= 80 ? 'Ready' : matchScore >= 65 ? 'Minor Gaps' : 'Needs Upskilling')

  const readinessColor =
    matchScore >= 80 ? '#10B981' : matchScore >= 60 ? '#F59E0B' : '#EF4444'
  const readinessBg =
    matchScore >= 80
      ? 'rgba(16, 185, 129, 0.12)'
      : matchScore >= 60
      ? 'rgba(245, 158, 11, 0.12)'
      : 'rgba(239, 68, 68, 0.12)'
  const readinessBorder =
    matchScore >= 80
      ? 'rgba(16, 185, 129, 0.25)'
      : matchScore >= 60
      ? 'rgba(245, 158, 11, 0.25)'
      : 'rgba(239, 68, 68, 0.25)'

  // 2. Parse Granular Gap Items from Backend
  const allGaps = gapReport?.gap_items || []

  const criticalGaps = allGaps.filter((item) => {
    const sev = (item.gap_severity || item.severity || '').toLowerCase()
    return sev === 'critical' || sev === 'high'
  })

  const moderateGaps = allGaps.filter((item) => {
    const sev = (item.gap_severity || item.severity || '').toLowerCase()
    return sev === 'medium' || sev === 'low' || sev === 'moderate'
  })

  // 3. Derive Verified Strengths (Matched competencies)
  const matchedSkills = (() => {
    if (gapReport?.matched_skills && gapReport.matched_skills.length > 0) {
      return gapReport.matched_skills
    }
    const gapNames = new Set(allGaps.map((g) => (g.skill_name || g.name || '').toLowerCase()))
    const roleSkills = activeRoleConfig?.coreSkills || [
      'React.js',
      'JavaScript',
      'REST APIs',
      'Git',
    ]
    return roleSkills
      .filter((s) => !gapNames.has(s.toLowerCase()))
      .map((s) => ({
        skill_name: s,
        user_current_score: 85,
        required_score: 75,
        point_delta: 10,
      }))
  })()

  // 4. Counts
  const verifiedCount =
    gapReport?.skills_matched_count !== undefined
      ? Number(gapReport.skills_matched_count)
      : matchedSkills.length
  const criticalCount = criticalGaps.length
  const moderateCount = moderateGaps.length
  const totalCount =
    gapReport?.total_required_skills ||
    verifiedCount + criticalCount + moderateCount ||
    activeRoleConfig?.coreSkills?.length ||
    8

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
              background: `conic-gradient(var(--primary) 0%, var(--primary) ${matchScore}%, var(--border) ${matchScore}% 100%)`,
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
                {matchScore}%
              </span>
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginTop: '2px' }}>
                MATCH
              </span>
            </div>
          </div>

          <div>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: readinessColor,
                background: readinessBg,
                padding: '2px 8px',
                borderRadius: '4px',
                border: `1px solid ${readinessBorder}`,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              PLACEMENT READINESS: {readiness}
            </span>
            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '6px 0 2px', fontFamily: 'Outfit, sans-serif' }}>
              Target: {gapReport?.target_role_title || activeRoleConfig?.title || 'Selected Domain'}
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
              {gapReport?.analysis_summary ||
                'Baseline calibrated against campus hiring bars. Take the Diagnostic Arena below to verify claimed skills and boost your verified score.'}
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
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)' }}>
              Severity Classification
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
              {totalCount} Core Competencies
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '12px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#10B981', display: 'block' }}>
                {verifiedCount}
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#10B981' }}>Verified Strengths</span>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#EF4444', display: 'block' }}>
                {criticalCount}
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#EF4444' }}>Critical Gaps</span>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#F59E0B', display: 'block' }}>
                {moderateCount}
              </span>
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
          {/* COLUMN 1: Critical Gaps */}
          <div style={{ background: 'var(--surface-glass)', borderRadius: 'var(--radius-lg)', padding: '18px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertTriangle size={16} color="#EF4444" />
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#EF4444' }}>
                CRITICAL MISSING GAPS ({criticalGaps.length})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {criticalGaps.length > 0 ? (
                criticalGaps.map((item, idx) => {
                  const currentScore = Math.round(Number(item.user_current_score || 0))
                  const targetScore = Math.round(Number(item.required_score || 75))
                  const delta = item.point_delta !== undefined
                    ? Math.round(Number(item.point_delta))
                    : currentScore - targetScore

                  return (
                    <div
                      key={item.id || idx}
                      style={{
                        background: 'rgba(239, 68, 68, 0.05)',
                        border: '1px solid rgba(239, 68, 68, 0.15)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text)' }}>
                          {item.skill_name || item.name}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#EF4444', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <TrendingDown size={11} />
                            {delta <= 0 ? `${delta} pts` : `-${delta} pts`}
                          </span>
                        </div>
                      </div>

                      {/* Score Telemetry */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-subtle)', marginBottom: '4px' }}>
                        <span>Current: {currentScore}%</span>
                        <span>Target: {targetScore}%</span>
                      </div>

                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                        {item.recommended_action || item.recommendation || item.reason || 'Master core fundamentals and complete hands-on project milestone.'}
                      </p>
                    </div>
                  )
                })
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '12px' }}>
                  No critical gaps identified for this role! Excellent foundational alignment.
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: Needs Polish & Practice */}
          <div style={{ background: 'var(--surface-glass)', borderRadius: 'var(--radius-lg)', padding: '18px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Layers size={16} color="#F59E0B" />
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#F59E0B' }}>
                NEEDS POLISH & PRACTICE ({moderateGaps.length})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {moderateGaps.length > 0 ? (
                moderateGaps.map((item, idx) => {
                  const currentScore = Math.round(Number(item.user_current_score || 40))
                  const targetScore = Math.round(Number(item.required_score || 75))
                  const delta = item.point_delta !== undefined
                    ? Math.round(Number(item.point_delta))
                    : currentScore - targetScore

                  return (
                    <div
                      key={item.id || idx}
                      style={{
                        background: 'rgba(245, 158, 11, 0.05)',
                        border: '1px solid rgba(245, 158, 11, 0.15)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text)' }}>
                          {item.skill_name || item.name}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#F59E0B', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <TrendingDown size={11} />
                            {delta <= 0 ? `${delta} pts` : `-${delta} pts`}
                          </span>
                        </div>
                      </div>

                      {/* Score Telemetry */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-subtle)', marginBottom: '4px' }}>
                        <span>Current: {currentScore}%</span>
                        <span>Target: {targetScore}%</span>
                      </div>

                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                        {item.recommended_action || item.recommendation || item.reason || 'Practice query optimization and real-world system architecture.'}
                      </p>
                    </div>
                  )
                })
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '12px' }}>
                  No moderate gaps detected.
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: Verified Strengths (Matched) */}
          <div style={{ background: 'var(--surface-glass)', borderRadius: 'var(--radius-lg)', padding: '18px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#10B981' }}>
                VERIFIED STRENGTHS ({matchedSkills.length})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {matchedSkills.length > 0 ? (
                matchedSkills.map((item, idx) => {
                  const score = Math.round(Number(item.user_current_score || 85))
                  return (
                    <div
                      key={item.id || idx}
                      style={{
                        background: 'rgba(16, 185, 129, 0.05)',
                        border: '1px solid rgba(16, 185, 129, 0.15)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block' }}>
                          {item.skill_name || item.name}
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#10B981', fontWeight: 600 }}>
                          Proficiency Met: {score}%
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <TrendingUp size={11} />
                          +{score >= 75 ? score : 80} pts
                        </span>
                        <Check size={14} color="#10B981" />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '12px' }}>
                  Add verified skills in Step 1 to demonstrate matched competencies.
                </div>
              )}
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
          <span>Enter Adaptive Diagnostic Arena</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  )
}
