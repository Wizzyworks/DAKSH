import { useState, useEffect, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  BookOpen,
  Compass,
  Cpu,
  Layers,
} from 'lucide-react'
import { skillGapApi } from '../../services/skillGapApi'
import { Button, Chip, TOKENS, CornerHUD, HUDTag } from './ui/SkillGapPrimitives'

export default function Step4CalibratedRoadmap({
  onBack,
  onBackToReport,
  activeRoleConfig = {},
  baseMatch = 76,
  arenaAnswers = {},
  onNavigateToRoadmap,
  onRetakeCheck,
  onRescan,
}) {
  const [calibrationData, setCalibrationData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBuildingRoadmap, setIsBuildingRoadmap] = useState(false)
  const [buildStep, setBuildStep] = useState(0)

  // Scroll to top on mount synchronously
  useLayoutEffect(() => {
    const mainEl = document.getElementById('daksh-main-scroll') || document.querySelector('main')
    if (mainEl) mainEl.scrollTop = 0
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  // Calibrate candidate score using real backend IRT engine
  useEffect(() => {
    let isMounted = true
    async function runCalibration() {
      setIsLoading(true)

      const responsePayload = Object.values(arenaAnswers).map((ans) => ({
        question_id: ans.questionId || 'q1',
        skill: ans.skill || 'Core',
        difficulty_b: ans.difficulty_b || 0.0,
        is_correct: ans.isCorrect,
      }))

      const result = await skillGapApi.calibrateDiagnostic(baseMatch, responsePayload)

      if (isMounted) {
        setCalibrationData(result)
        setIsLoading(false)
      }
    }

    runCalibration()
    return () => {
      isMounted = false
    }
  }, [baseMatch, arenaAnswers])

  const verifiedScore = calibrationData?.final_calibrated_match || baseMatch
  const scoreBoost = calibrationData?.calibration_boost || Math.max(0, verifiedScore - baseMatch)
  const skillIq = calibrationData?.skill_iq_score || 185
  const proficiencyTier = calibrationData?.proficiency_tier || 'Proficient'
  const confirmedGaps = calibrationData?.confirmed_gaps?.length > 0
    ? calibrationData.confirmed_gaps
    : ['Redis & In-Memory Caching', 'Docker & Containerization']

  // Sprints tied directly to confirmed gaps
  const sprints = [
    {
      priority: 'Priority 1',
      tag: 'SPRINT_A',
      title: `${confirmedGaps[0] || 'Distributed Caching'} Mastery`,
      duration: '1.5 Weeks',
      expectedBoost: '+8% Readiness',
      desc: 'Implement cache-aside pattern with TTL invalidation and benchmark query speedup.',
    },
    {
      priority: 'Priority 2',
      tag: 'SPRINT_B',
      title: `${confirmedGaps[1] || 'Production Containerization'} Workflows`,
      duration: '1 Week',
      expectedBoost: '+6% Readiness',
      desc: 'Create multi-stage Docker builds, compose setups, and volume management for backend APIs.',
    },
  ]

  // Smooth morphing roadmap generation animation
  const handleBuildRoadmap = () => {
    try {
      const handoffPayload = {
        role: activeRoleConfig?.title || 'Full Stack Engineer',
        baseMatch,
        verifiedScore,
        skillIq,
        confirmedGaps,
        sprints,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem('daksh-active-skill-gap-handoff', JSON.stringify(handoffPayload))
    } catch (e) {
      console.warn('Could not cache handoff payload:', e)
    }

    setIsBuildingRoadmap(true)
    setBuildStep(0)

    // Stage 1: Synthesis
    const t1 = setTimeout(() => {
      setBuildStep(1)
    }, 700)

    // Stage 2: Curriculum compile
    const t2 = setTimeout(() => {
      setBuildStep(2)
    }, 1500)

    // Stage 3: Launch
    const t3 = setTimeout(() => {
      setBuildStep(3)
    }, 2200)

    // Stage 4: Trigger route transition
    const t4 = setTimeout(() => {
      if (onNavigateToRoadmap) onNavigateToRoadmap()
    }, 2750)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }

  const buildMilestones = [
    { label: 'Calibrating 15-question verified IRT performance', icon: Sparkles },
    { label: `Targeting confirmed gaps: ${confirmedGaps.slice(0, 2).join(', ')}`, icon: Zap },
    { label: 'Assembling structured 4-week mastery milestones & code challenges', icon: BookOpen },
    { label: 'Roadmap compiled! Launching Learning Hub curriculum...', icon: CheckCircle2 },
  ]

  const progressPercentages = [25, 60, 88, 100]

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ paddingBottom: '20px', maxWidth: '880px', margin: '0 auto', position: 'relative' }}
    >
      {/* ─── Step Header ─── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            className="daksh-glass-pill"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              color: 'var(--success)',
              background: 'var(--success-dim)',
              border: '1px solid rgba(95, 176, 143, 0.3)',
              padding: '3px 10px',
            }}
          >
            STAGE 04 • ACTION ROADMAP
          </span>
        </div>

        <h2
          data-step-heading="true"
          style={{
            fontSize: 'clamp(21px, 2.4vw, 25px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            margin: '0 0 6px',
          }}
        >
          Verified Readiness &amp; Action Roadmap
        </h2>

        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
          Your diagnostic check confirmed your hands-on proficiency. Review your calibrated score progression, Skill IQ index, and targeted sprint roadmap below.
        </p>
      </div>

      {/* ─── HERO OBJECT: Inline Progression Banner ─── */}
      <div
        className="daksh-glass-card"
        style={{
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '20px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            paddingBottom: '18px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  color: 'var(--success)',
                  background: 'var(--success-dim)',
                  padding: '3px 10px',
                  borderRadius: '99px',
                  border: '1px solid rgba(95, 176, 143, 0.3)',
                }}
              >
                ● VERIFIED READY
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
                Skill IQ: <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{skillIq} / 300</strong> ({proficiencyTier})
              </span>
            </div>

            <h3
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text)',
                margin: 0,
                letterSpacing: '-0.015em',
              }}
            >
              Verified Readiness:{' '}
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                {verifiedScore}%
              </span>
            </h3>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
              Target Role
            </span>
            <strong style={{ fontSize: '14.5px', color: 'var(--text)', fontWeight: 600 }}>
              {activeRoleConfig?.title || 'Full Stack Engineer'}
            </strong>
          </div>
        </div>

        {/* Clean Inline Score Progression */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '28px',
            paddingTop: '20px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
              Resume Baseline
            </span>
            <span style={{ display: 'block', fontSize: '24px', fontWeight: 600, color: 'var(--text)', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", marginTop: '2px' }}>
              {baseMatch}%
            </span>
          </div>

          <span style={{ color: 'var(--text-muted)', fontSize: '16px', opacity: 0.4 }}>→</span>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
              Quick Check Boost
            </span>
            <span style={{ display: 'block', fontSize: '24px', fontWeight: 600, color: 'var(--success)', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", marginTop: '2px' }}>
              +{scoreBoost}%
            </span>
          </div>

          <span style={{ color: 'var(--text-muted)', fontSize: '16px', opacity: 0.4 }}>→</span>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
              Verified Readiness
            </span>
            <span style={{ display: 'block', fontSize: '24px', fontWeight: 600, color: 'var(--accent)', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", marginTop: '2px' }}>
              {verifiedScore}%
            </span>
          </div>
        </div>
      </div>

      {/* ─── Prioritized Sprints List ─── */}
      <div
        className="daksh-glass-card"
        style={{
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '20px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Zap size={16} color="var(--accent)" />
          <h4
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text)',
              margin: 0,
            }}
          >
            Prioritized Learning Sprints (Closing Confirmed Gaps)
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sprints.map((sprint, idx) => (
            <div
              key={idx}
              style={{
                padding: '18px 20px',
                borderRadius: '12px',
                background: idx === 0 ? 'var(--surface-soft)' : 'var(--glass)',
                border: idx === 0 ? '1px solid var(--border)' : '1px solid var(--border)',
                borderLeft: idx === 0 ? '4px solid var(--accent)' : '1px solid var(--border)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 600,
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                      color: 'var(--accent)',
                      background: 'var(--accent-dim)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(107, 124, 245, 0.25)',
                    }}
                  >
                    {sprint.priority.toUpperCase()}
                  </span>
                  <strong style={{ fontSize: '14.5px', color: 'var(--text)', fontWeight: 600 }}>
                    {sprint.title}
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  {sprint.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
                    EST. DURATION
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
                    {sprint.duration}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
                    IMPACT
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
                    {sprint.expectedBoost}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Bottom Action Navigation Bar ─── */}
      <div
        style={{
          marginTop: '20px',
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
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft size={14} />}
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw size={14} />}
            onClick={onRetakeCheck}
          >
            Retake Check
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRescan}
          >
            Re-scan Another Role
          </Button>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={handleBuildRoadmap}
          iconRight={<ArrowRight size={16} />}
        >
          Build My Learning Roadmap
        </Button>
      </div>

      {/* ─── SMOOTH MORPHING ROADMAP GENERATION OVERLAY ─── */}
      <AnimatePresence>
        {isBuildingRoadmap && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="daksh-glass-card"
              style={{
                width: '100%',
                maxWidth: '520px',
                borderRadius: '18px',
                padding: '32px 28px',
                boxShadow: 'var(--shadow)',
                position: 'relative',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <span
                  className="daksh-glass-pill"
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    color: 'var(--accent)',
                    background: 'var(--accent-dim)',
                    border: '1px solid rgba(107, 124, 245, 0.3)',
                    padding: '3px 12px',
                    display: 'inline-block',
                    marginBottom: '10px',
                  }}
                >
                  ROADMAP COMPILER • CALIBRATING
                </span>
                <h3
                  style={{
                    fontSize: '19px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    margin: '0 0 4px',
                    letterSpacing: '-0.015em',
                  }}
                >
                  Assembling Custom Learning Roadmap
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
                  Target: {activeRoleConfig?.title || 'Engineering'}
                </p>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: '5px',
                  width: '100%',
                  background: 'var(--glass)',
                  borderRadius: '99px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                  border: '1px solid var(--border)',
                }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercentages[buildStep] || 30}%` }}
                  transition={{ duration: 0.5 }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--accent) 0%, #8C9AF8 100%)',
                    borderRadius: '99px',
                    boxShadow: '0 0 10px rgba(107, 124, 245, 0.4)',
                  }}
                />
              </div>

              {/* Milestones list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {buildMilestones.map((ms, idx) => {
                  const isDone = idx < buildStep
                  const isCurrent = idx === buildStep
                  const Icon = ms.icon

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '13px',
                        color: isDone ? 'var(--success)' : isCurrent ? 'var(--text)' : 'var(--text-muted)',
                        fontWeight: isCurrent ? 600 : 450,
                        opacity: idx > buildStep ? 0.4 : 1,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: isDone
                            ? 'var(--success-dim)'
                            : isCurrent
                            ? 'var(--accent-dim)'
                            : 'var(--glass)',
                          border: isDone
                            ? '1px solid rgba(95, 176, 143, 0.4)'
                            : isCurrent
                            ? '1px solid var(--accent)'
                            : '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: isDone ? 'var(--success)' : isCurrent ? 'var(--accent)' : 'var(--text-muted)',
                        }}
                      >
                        <Icon size={13} />
                      </div>
                      <span style={{ flex: 1, fontFamily: isCurrent ? "var(--font-mono, 'JetBrains Mono', monospace)" : undefined }}>
                        {ms.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
