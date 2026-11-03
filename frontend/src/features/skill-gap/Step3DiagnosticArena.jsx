import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  BookOpen,
  TrendingUp,
} from 'lucide-react'
import { skillGapApi } from '../../services/skillGapApi'
import { ADAPTIVE_QUESTION_POOL } from './skillGapData'
import { Button, Chip, TOKENS, CornerHUD } from './ui/SkillGapPrimitives'
import SpiderwebRadarChart from './ui/SpiderwebRadarChart'


// ─── Sequential Question Progression Logic ─────────────────────────────────
// Ensures question order is strictly sequential: 1 -> 2 -> 3 -> ... -> 15
// If user finishes Q15, wraps around to any previously skipped question.
function getNextSequentialIndex(questions, currentIdx, answers) {
  // Always advance sequentially to the next question if available
  if (currentIdx + 1 < questions.length) {
    return currentIdx + 1
  }

  // If at the end of the 15 questions, check if any earlier questions were skipped
  const answered = new Set(Object.keys(answers).map(String))
  const firstUnanswered = questions.findIndex(q => !answered.has(String(q.id)))
  return firstUnanswered >= 0 ? firstUnanswered : null
}

export default function Step3DiagnosticArena({
  gapSkills = ['Redis', 'Docker', 'PostgreSQL', 'JavaScript', 'REST APIs'],
  arenaAnswers = {},
  setArenaAnswers,
  onBack,
  onCompleteCalibration,
}) {
  // Phase: 'intro' | 'active' | 'review_skipped' | 'review'
  const [phase, setPhase] = useState(() => {
    return sessionStorage.getItem('daksh-arena-phase') || 'intro'
  })

  const [questions, setQuestions] = useState(() => {
    try {
      const saved = sessionStorage.getItem('daksh-arena-questions')
      return saved ? JSON.parse(saved) : ADAPTIVE_QUESTION_POOL
    } catch {
      return ADAPTIVE_QUESTION_POOL
    }
  })

  const [currentQIndex, setCurrentQIndex] = useState(() => {
    try {
      const saved = sessionStorage.getItem('daksh-arena-q-index')
      return saved ? parseInt(saved, 10) : 0
    } catch {
      return 0
    }
  })

  const [selectedOptionId, setSelectedOptionId] = useState(null)
  const [isCurrentEvaluated, setIsCurrentEvaluated] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false)
  const [feedbackVisible, setFeedbackVisible] = useState(false)

  const continueBtnRef = useRef(null)

  // Scroll reset on phase/question change
  useLayoutEffect(() => {
    const mainEl = document.getElementById('daksh-main-scroll') || document.querySelector('main')
    if (mainEl) mainEl.scrollTop = 0
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [currentQIndex, phase])

  // Ensure a full 15-question adaptive pool
  useEffect(() => {
    let isMounted = true
    async function loadQuestions() {
      let combined = ADAPTIVE_QUESTION_POOL.slice(0, 15)
      if (gapSkills?.length > 0) {
        try {
          const dynamicList = await skillGapApi.generateDiagnosticQuestions(gapSkills, 'intermediate', 15)
          if (dynamicList?.length > 0) {
            const dynamicIds = new Set(dynamicList.map((q) => q.id))
            const filler = ADAPTIVE_QUESTION_POOL.filter((q) => !dynamicIds.has(q.id))
            combined = [...dynamicList, ...filler].slice(0, 15)
          }
        } catch {
          combined = ADAPTIVE_QUESTION_POOL.slice(0, 15)
        }
      }
      if (isMounted) {
        setQuestions(combined)
        sessionStorage.setItem('daksh-arena-questions', JSON.stringify(combined))
      }
    }
    loadQuestions()
    return () => { isMounted = false }
  }, [gapSkills])

  // Soft timer
  useEffect(() => {
    if (phase !== 'active') return
    const timer = setInterval(() => setSecondsElapsed(prev => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [phase])

  // Sync session storage
  useEffect(() => {
    sessionStorage.setItem('daksh-arena-phase', phase)
    sessionStorage.setItem('daksh-arena-q-index', currentQIndex.toString())
  }, [phase, currentQIndex])

  const totalQuestions = questions.length
  const currentQuestion = questions[currentQIndex] || questions[0]
  const answeredCount = Object.keys(arenaAnswers).length
  const isLastQuestion = answeredCount >= totalQuestions - 1 && currentQIndex >= totalQuestions - 1

  // Keyboard navigation
  useEffect(() => {
    if (phase !== 'active' || showExitConfirm) return

    function handleKeyDown(e) {
      if (['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) return

      if (e.key >= '1' && e.key <= '4' && !isCurrentEvaluated) {
        const optId = ['a', 'b', 'c', 'd'][parseInt(e.key, 10) - 1]
        if (optId) setSelectedOptionId(optId)
      } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase()) && !isCurrentEvaluated) {
        setSelectedOptionId(e.key.toLowerCase())
      } else if ((e.key === 's' || e.key === 'S') && !isCurrentEvaluated) {
        handleSkipQuestion()
      } else if (e.key === 'Enter') {
        if (!isCurrentEvaluated && selectedOptionId) {
          handleSubmitAnswer()
        } else if (isCurrentEvaluated) {
          handleNextQuestion()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, isCurrentEvaluated, selectedOptionId, showExitConfirm, currentQIndex])

  const handleSubmitAnswer = useCallback(() => {
    if (!selectedOptionId || isCurrentEvaluated) return
    const isCorrect = selectedOptionId === currentQuestion.correct
    const updatedAnswers = {
      ...arenaAnswers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        skill: currentQuestion.skillTarget || 'Engineering',
        difficulty_b: currentQuestion.difficulty_b || 0.0,
        selected: selectedOptionId,
        isCorrect,
        status: 'answered',
      },
    }
    setArenaAnswers(updatedAnswers)
    setIsCurrentEvaluated(true)
    setFeedbackVisible(true)
    setTimeout(() => continueBtnRef.current?.focus(), 120)
  }, [selectedOptionId, isCurrentEvaluated, currentQuestion, arenaAnswers, setArenaAnswers])

  const handleSkipQuestion = useCallback(() => {
    const updatedAnswers = {
      ...arenaAnswers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        skill: currentQuestion.skillTarget || 'Engineering',
        difficulty_b: currentQuestion.difficulty_b || 0.0,
        selected: null,
        isCorrect: false,
        status: 'skipped',
      },
    }
    setArenaAnswers(updatedAnswers)
    handleNextQuestion(updatedAnswers, false)
  }, [currentQuestion, arenaAnswers, setArenaAnswers])

  const handleNextQuestion = useCallback((activeAnswers = arenaAnswers) => {
    const nextIdx = getNextSequentialIndex(questions, currentQIndex, activeAnswers)
    const totalAnswered = Object.keys(activeAnswers).length

    // Advance if there are more unanswered questions
    if (nextIdx !== null && totalAnswered < totalQuestions) {
      setCurrentQIndex(nextIdx)
      setIsCurrentEvaluated(false)
      setSelectedOptionId(null)
      setIsExplanationExpanded(false)
      setFeedbackVisible(false)
    } else {
      // End: check skipped
      const skippedItems = questions.filter(q => activeAnswers[q.id]?.status === 'skipped')
      if (skippedItems.length > 0) {
        setPhase('review_skipped')
      } else {
        setPhase('review')
      }
    }
  }, [questions, currentQIndex, arenaAnswers, totalQuestions])

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const skillSummary = {}
  Object.values(arenaAnswers).forEach((ans) => {
    const skill = ans.skill || 'Core Skill'
    if (!skillSummary[skill]) skillSummary[skill] = { attempts: 0, correct: 0, skipped: 0 }
    skillSummary[skill].attempts += 1
    if (ans.status === 'skipped') skillSummary[skill].skipped += 1
    else if (ans.isCorrect) skillSummary[skill].correct += 1
  })

  // ─────────────────────────────────────────────────────────────────────────
  // INTRO SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        style={{ maxWidth: '680px', margin: '0 auto', position: 'relative' }}
      >
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              className="daksh-glass-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 10px',
                borderRadius: '99px',
                color: 'var(--accent)',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              Step 03 • Diagnostic Assessment
            </span>
          </div>
          <h2
            data-step-heading="true"
            style={{
              fontSize: 'clamp(22px, 2.8vw, 28px)',
              fontWeight: 650,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 8px',
            }}
          >
            Adaptive Skill Diagnostic
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            {totalQuestions} targeted questions calibrated directly against your identified skill gaps. Questions dynamically adjust to your proficiency level.
          </p>
        </div>

        {/* Stats row with glass styling */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          {[
            { icon: <BookOpen size={16} />, label: 'Questions', value: totalQuestions, color: 'var(--accent)' },
            { icon: <Clock size={16} />, label: 'Est. Time', value: `${Math.ceil(totalQuestions * 2.0)} min`, color: 'var(--warning)' },
            { icon: <TrendingUp size={16} />, label: 'Adaptive IRT', value: 'Live 1-PL', color: 'var(--success)' },
          ].map((stat, i) => (
            <div
              key={i}
              className="daksh-glass-card"
              style={{
                padding: '16px 18px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                position: 'relative',
              }}
            >
              <span style={{ color: stat.color }}>{stat.icon}</span>
              <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>
                {stat.value}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Skills being tested */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 10px' }}>
            Targeted Competencies
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {gapSkills.slice(0, 8).map((s, i) => (
              <span
                key={i}
                className="daksh-glass-pill"
                style={{
                  fontSize: '11.5px',
                  padding: '3px 10px',
                  borderRadius: '99px',
                  color: 'var(--text)',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div
          className="daksh-glass-card"
          style={{
            borderRadius: '10px',
            padding: '18px 20px',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            position: 'relative',
          }}
        >
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', margin: 0, letterSpacing: '0.02em' }}>
            Assessment Guidelines &amp; Shortcuts
          </p>
          {[
            'Select an option with a click or press keys 1–4 on your keyboard',
            'Press Enter to submit and confirm, or press S to skip for later',
            'Instant item evaluation and conceptual explanation',
            'Skipped questions can be answered before calibration',
          ].map((rule, i) => (
            <div key={i} style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: '11.5px' }}>0{i + 1}</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft size={14} />}>
            Back to Report
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => setPhase('active')}
            iconRight={<Play size={14} />}
          >
            Launch Assessment
          </Button>
        </div>
      </motion.div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REVIEW SKIPPED SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === 'review_skipped') {
    const skippedQuestions = questions.filter(q => arenaAnswers[q.id]?.status === 'skipped')

    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        <span
          className="daksh-glass-pill"
          style={{
            fontSize: '11px',
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--warning)',
            display: 'inline-block',
            marginBottom: '8px',
            padding: '2px 8px',
            borderRadius: '99px',
          }}
        >
          Skipped Questions
        </span>
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 650,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            margin: '0 0 6px',
          }}
        >
          You skipped {skippedQuestions.length} question{skippedQuestions.length > 1 ? 's' : ''}
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 20px' }}>
          Answering them now calibrates your readiness score more accurately, or you can proceed to the results.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {skippedQuestions.map((q) => (
            <div
              key={q.id}
              className="daksh-glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '10px',
              }}
            >
              <div>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', display: 'block' }}>
                  {q.skillTarget}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {q.title || q.question?.slice(0, 60)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const qIdx = questions.findIndex(item => item.id === q.id)
                  setCurrentQIndex(qIdx >= 0 ? qIdx : 0)
                  setPhase('active')
                  setIsCurrentEvaluated(false)
                  setSelectedOptionId(null)
                  setFeedbackVisible(false)
                }}
                className="daksh-glass-pill"
                style={{
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--border-accent)',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                Answer →
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const firstSkipped = questions.findIndex(q => arenaAnswers[q.id]?.status === 'skipped')
              setCurrentQIndex(firstSkipped >= 0 ? firstSkipped : 0)
              setPhase('active')
              setIsCurrentEvaluated(false)
              setSelectedOptionId(null)
              setFeedbackVisible(false)
            }}
          >
            Answer All Skipped
          </Button>
          <Button size="md" variant="primary" onClick={() => setPhase('review')} iconRight={<ArrowRight size={15} />}>
            View Results
          </Button>
        </div>
      </motion.div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RESULTS SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === 'review') {
    const totalAttempted = Object.keys(arenaAnswers).length
    const totalCorrect = Object.values(arenaAnswers).filter(a => a.isCorrect).length
    const scorePercent = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0
    const tier = scorePercent >= 80 ? 'Strong' : scorePercent >= 55 ? 'Developing' : 'Needs Focus'
    const tierColor = scorePercent >= 80 ? 'var(--success)' : scorePercent >= 55 ? 'var(--warning)' : 'var(--error)'

    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ maxWidth: '680px', margin: '0 auto' }}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <span
            className="daksh-glass-pill"
            style={{
              fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--success)',
              display: 'inline-block',
              marginBottom: '8px',
              padding: '2px 8px',
              borderRadius: '99px',
            }}
          >
            Diagnostic Complete
          </span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h2
                data-step-heading="true"
                style={{
                  fontSize: '24px',
                  fontWeight: 650,
                  letterSpacing: '-0.025em',
                  color: 'var(--text)',
                  margin: '0 0 4px',
                }}
              >
                Your Skill Assessment Results
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
                {totalCorrect} of {totalAttempted} questions answered correctly
              </p>
            </div>
            {/* Score pill */}
            <div
              className="daksh-glass-card"
              style={{
                borderRadius: '12px',
                padding: '10px 20px',
                textAlign: 'center',
                marginLeft: 'auto',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div style={{ fontSize: '26px', fontWeight: 600, color: tierColor, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{scorePercent}%</div>
              <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginTop: '4px' }}>{tier}</div>
            </div>
          </div>
        </div>

        {/* Spiderweb Competency Map & Detailed Breakdown */}
        <div
          className="daksh-glass-card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 340px) 1fr',
            gap: '24px',
            alignItems: 'center',
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Left: The Spiderweb Radar */}
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', textAlign: 'center' }}>
              Target Competency Spiderweb
            </div>
            <SpiderwebRadarChart
              size={320}
              competencies={Object.entries(skillSummary).map(([skill, stats]) => {
                const totalAtt = stats.attempts || 1
                const userPct = stats.attempts > 0 ? Math.round((stats.correct / totalAtt) * 100) : 50
                return {
                  name: skill,
                  benchmark: 80,
                  candidateScore: userPct,
                  status: userPct >= 80 ? 'strong' : 'gap',
                }
              })}
            />
          </div>

          {/* Right: Strong vs Gap Breakdown Chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
              Competency Verification Status
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(skillSummary).map(([skill, stats], idx) => {
                const isVerified = stats.correct === stats.attempts && stats.attempts > 0
                const isPartial = stats.correct > 0 && stats.correct < stats.attempts
                const isSkipped = stats.skipped === stats.attempts
                const statusColor = isVerified ? 'var(--success)' : isPartial ? 'var(--warning)' : isSkipped ? 'var(--text-muted)' : 'var(--error)'
                const statusBg = isVerified ? 'var(--success-dim)' : isPartial ? 'var(--warning-dim)' : isSkipped ? 'var(--glass)' : 'var(--error-dim)'
                const statusLabel = isVerified ? '✓ Verified' : isPartial ? 'Needs Focus' : isSkipped ? 'Not Tested' : 'Critical Gap'

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'var(--glass)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{skill}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: statusColor,
                        background: statusBg,
                        padding: '2px 8px',
                        borderRadius: '99px',
                      }}
                    >
                      {statusLabel}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPhase('active')
              setCurrentQIndex(0)
              setIsCurrentEvaluated(false)
              setSelectedOptionId(null)
              setFeedbackVisible(false)
            }}
            icon={<RotateCcw size={13} />}
          >
            Retake Check
          </Button>
          <Button size="md" variant="primary" onClick={onCompleteCalibration} iconRight={<ArrowRight size={15} />}>
            View Calibrated Plan
          </Button>
        </div>
      </motion.div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACTIVE TEST SCREEN — Full Single Viewport
  // ─────────────────────────────────────────────────────────────────────────
  const isCorrectAnswer = selectedOptionId === currentQuestion?.correct

  // Count answered (including skipped)
  const answeredSoFar = Object.keys(arenaAnswers).length

  return (
    <div style={{
      maxWidth: '880px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '520px',
      paddingBottom: '24px',
    }}>
      {/* ─── TOP: Spacious Progress Header & 15-Question Numbered Palette ─── */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
        {/* Meta Bar: Skill Target + Question Counter + Timer + Exit */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Chip label={currentQuestion.skillTarget || 'Engineering'} variant="primary" />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Question <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{currentQIndex + 1}</strong> of {totalQuestions}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              className="daksh-glass-pill"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--text)',
                padding: '5px 12px',
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontWeight: 500,
              }}
            >
              <Clock size={13} color="var(--accent)" /> {formatTimer(secondsElapsed)}
            </span>
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 500,
                padding: '5px 12px',
                borderRadius: '8px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text)'
                e.currentTarget.style.borderColor = 'var(--border-strong)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              Exit Arena
            </button>
          </div>
        </div>

        {/* ─── Numbered 1-15 Question Palette Strip ─── */}
        <div
          className="daksh-glass-card"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${totalQuestions}, minmax(0, 1fr))`,
            gap: '6px',
            padding: '8px 10px',
            borderRadius: '12px',
          }}
        >
          {questions.map((q, idx) => {
            const answer = arenaAnswers[q.id]
            const isCurr = idx === currentQIndex
            const isSkipped = answer?.status === 'skipped'
            const isAnswered = answer && answer.status === 'answered'
            const isCorrect = isAnswered && answer.isCorrect === true
            const isWrong = isAnswered && answer.isCorrect === false

            let bg = 'var(--glass)'
            let border = '1px solid var(--border)'
            let color = 'var(--text-muted)'
            let shadow = 'none'

            if (isCurr) {
              bg = 'var(--accent-dim)'
              border = '1px solid var(--accent)'
              color = 'var(--accent)'
              shadow = '0 0 12px rgba(107, 124, 245, 0.25)'
            } else if (isCorrect) {
              bg = 'var(--success-dim)'
              border = '1px solid rgba(95, 176, 143, 0.35)'
              color = 'var(--success)'
            } else if (isWrong) {
              bg = 'var(--error-dim)'
              border = '1px solid rgba(208, 123, 123, 0.35)'
              color = 'var(--error)'
            } else if (isSkipped) {
              bg = 'var(--warning-dim)'
              border = '1px solid rgba(212, 169, 94, 0.35)'
              color = 'var(--warning)'
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (idx <= currentQIndex || answer) {
                    setCurrentQIndex(idx)
                    setIsCurrentEvaluated(!!answer && answer.status === 'answered')
                    setSelectedOptionId(answer?.selected || null)
                    setFeedbackVisible(!!answer && answer.status === 'answered')
                  }
                }}
                title={`Question ${idx + 1}: ${q.skillTarget || ''} ${isCorrect ? '(Correct)' : isWrong ? '(Wrong)' : isSkipped ? '(Skipped)' : ''}`}
                style={{
                  height: '32px',
                  borderRadius: '7px',
                  background: bg,
                  border,
                  color,
                  boxShadow: shadow,
                  cursor: idx <= currentQIndex || answer ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontWeight: isCurr ? 600 : 500,
                  transition: 'all 0.16s ease',
                  userSelect: 'none',
                }}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── QUESTION BODY (Glass Card Container) ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQIndex}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="daksh-glass-card"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
            padding: '28px 30px',
            borderRadius: '16px',
          }}
        >
          {/* Question number + text */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <span style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              }}>
                QUESTION {currentQIndex + 1} / {totalQuestions}
              </span>
              {currentQuestion.difficultyLevel && (
                <span
                  className="daksh-glass-pill"
                  style={{
                    padding: '3px 10px',
                    fontSize: '11px',
                    textTransform: 'capitalize',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                  }}
                >
                  {currentQuestion.difficultyLevel}
                </span>
              )}
            </div>

            <h3 style={{
              fontSize: '17px',
              fontWeight: 600,
              color: 'var(--text)',
              margin: 0,
              letterSpacing: '-0.015em',
              lineHeight: 1.5,
            }}>
              {currentQuestion.title || currentQuestion.question}
            </h3>
            {currentQuestion.title && currentQuestion.question !== currentQuestion.title && (
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '8px 0 0', lineHeight: 1.55 }}>
                {currentQuestion.question}
              </p>
            )}
          </div>

          {/* Options (Comfortable Rows) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQuestion.options?.map((opt, optIdx) => {
              const isSelected = selectedOptionId === opt.id
              const isCorrectOpt = opt.id === currentQuestion.correct

              // Colors after evaluation
              let bg = 'var(--glass)'
              let border = '1px solid var(--border)'
              let textColor = 'var(--text)'
              let labelBg = 'var(--bg-elevated)'
              let labelColor = 'var(--text-muted)'

              if (isCurrentEvaluated) {
                if (isCorrectOpt) {
                  bg = 'var(--success-dim)'
                  border = '1px solid rgba(95, 176, 143, 0.45)'
                  textColor = 'var(--text)'
                  labelBg = 'var(--success)'
                  labelColor = '#F8F9FC'
                } else if (isSelected && !isCorrectOpt) {
                  bg = 'var(--error-dim)'
                  border = '1px solid rgba(208, 123, 123, 0.45)'
                  textColor = 'var(--text)'
                  labelBg = 'var(--error)'
                  labelColor = '#F8F9FC'
                }
              } else if (isSelected) {
                bg = 'var(--accent-dim)'
                border = '1px solid var(--accent)'
                textColor = 'var(--text)'
                labelBg = 'var(--accent)'
                labelColor = '#F8F9FC'
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => { if (!isCurrentEvaluated) setSelectedOptionId(opt.id) }}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setSelectedOptionId(opt.id) }}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '10px',
                    background: bg,
                    border,
                    color: textColor,
                    cursor: isCurrentEvaluated ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    transition: 'all 0.15s ease',
                    userSelect: 'none',
                  }}
                >
                  {/* Option label badge */}
                  <span style={{
                    width: '26px',
                    height: '26px',
                    flexShrink: 0,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    background: labelBg,
                    color: labelColor,
                    transition: 'all 0.15s ease',
                  }}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>

                  <span style={{ fontSize: '14px', lineHeight: 1.5, flex: 1, fontWeight: 450 }}>
                    {opt.text}
                  </span>

                  {/* Check/X icon after evaluation */}
                  {isCurrentEvaluated && isCorrectOpt && (
                    <CheckCircle2 size={18} color="var(--success)" />
                  )}
                  {isCurrentEvaluated && isSelected && !isCorrectOpt && (
                    <AlertCircle size={18} color="var(--error)" />
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ─── BOTTOM FOOTER ─── */}
      <div style={{ marginTop: '20px' }}>
        <AnimatePresence mode="wait">
          {!isCurrentEvaluated ? (
            /* Normal: Skip | Hint | Submit */
            <motion.div
              key="normal-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}
            >
              <Button variant="ghost" size="sm" onClick={handleSkipQuestion}>
                Skip Question
              </Button>
              <span style={{
                fontSize: '11.5px',
                color: 'var(--text-muted)',
                fontWeight: 500,
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              }}>
                1–4 select · Enter submit · S skip
              </span>
              <Button
                size="md"
                variant="primary"
                disabled={!selectedOptionId}
                onClick={handleSubmitAnswer}
              >
                Submit Answer
              </Button>
            </motion.div>
          ) : (
            /* Feedback: Result strip + Continue */
            <motion.div
              key="feedback-footer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="daksh-glass-card"
              style={{
                borderRadius: '12px',
                background: isCorrectAnswer ? 'var(--success-dim)' : 'var(--error-dim)',
                border: `1px solid ${isCorrectAnswer ? 'rgba(95, 176, 143, 0.35)' : 'rgba(208, 123, 123, 0.35)'}`,
                padding: '14px 18px',
              }}
            >
              {/* Result row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  {isCorrectAnswer
                    ? <CheckCircle2 size={18} color="var(--success)" />
                    : <AlertCircle size={18} color="var(--error)" />
                  }
                  <div>
                    <strong style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isCorrectAnswer ? 'var(--success)' : 'var(--error)',
                      display: 'block',
                    }}>
                      {isCorrectAnswer ? 'Correct!' : `Incorrect — correct answer was (${currentQuestion.correct?.toUpperCase()})`}
                    </strong>
                    <button
                      type="button"
                      onClick={() => setIsExplanationExpanded(p => !p)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        marginTop: '2px',
                      }}
                    >
                      {isExplanationExpanded ? 'Hide explanation' : 'See explanation'}
                      {isExplanationExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </button>
                  </div>
                </div>

                <Button
                  ref={continueBtnRef}
                  size="md"
                  variant="primary"
                  onClick={() => handleNextQuestion()}
                  iconRight={<ArrowRight size={15} />}
                >
                  {isLastQuestion ? 'Finish Check' : 'Next Question'}
                </Button>
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {isExplanationExpanded && currentQuestion.explanation && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      lineHeight: 1.55,
                      margin: '12px 0 0',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--border)',
                      overflow: 'hidden',
                    }}
                  >
                    {currentQuestion.explanation}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Exit Confirm Modal ─── */}
      <AnimatePresence>
        {showExitConfirm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(16px)',
            }}
            onClick={() => setShowExitConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              onClick={e => e.stopPropagation()}
              className="daksh-glass-card"
              style={{
                width: '100%',
                maxWidth: '400px',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow)',
                margin: '20px',
              }}
            >
              <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
                Exit Skill Check?
              </h4>
              <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Your answers so far are saved. You can come back and continue from where you left off.
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button variant="ghost" size="sm" onClick={() => setShowExitConfirm(false)}>
                  Keep Going
                </Button>
                <Button size="sm" variant="outline" onClick={onBack}>
                  Exit to Report
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

