import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Check, X, ShieldCheck } from 'lucide-react'
import { ADAPTIVE_QUESTION_POOL } from './skillGapData'

export default function Step4DiagnosticArena({
  arenaAnswers,
  setArenaAnswers,
  onBack,
  onCompleteCalibration,
}) {
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [isCurrentEvaluated, setIsCurrentEvaluated] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState(null)

  const currentQuestion = ADAPTIVE_QUESTION_POOL[currentQIndex] || ADAPTIVE_QUESTION_POOL[0]
  const totalQuestions = ADAPTIVE_QUESTION_POOL.length
  const calibrationConfidence = Math.round(((currentQIndex + (isCurrentEvaluated ? 1 : 0)) / totalQuestions) * 100)

  const handleSelectOption = (optionId) => {
    if (isCurrentEvaluated) return
    setSelectedOptionId(optionId)
  }

  const handleSubmitCurrent = () => {
    if (!selectedOptionId || isCurrentEvaluated) return
    const isCorrect = selectedOptionId === currentQuestion.correct
    setArenaAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selected: selectedOptionId,
        isCorrect,
      },
    }))
    setIsCurrentEvaluated(true)
  }

  const handleNextQuestion = () => {
    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex((prev) => prev + 1)
      setIsCurrentEvaluated(false)
      setSelectedOptionId(null)
    } else {
      onCompleteCalibration()
    }
  }

  const isCorrect = selectedOptionId === currentQuestion.correct

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
    >
      {/* Step Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 900,
                margin: '0 0 4px',
                fontFamily: 'Outfit, sans-serif',
                color: 'var(--text)',
                letterSpacing: '-0.01em',
              }}
            >
              Step 3: Quick Practical Skill Check
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              5 targeted questions to verify your conceptual problem-solving skills and calibrate your readiness.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--primary)',
                background: 'var(--primary-dim)',
                padding: '5px 12px',
                borderRadius: '99px',
                border: '1px solid var(--border)',
              }}
            >
              Question {currentQIndex + 1} of {totalQuestions}
            </span>
          </div>
        </div>

        {/* Live Calibration Confidence Progress Bar (Theme-Aware & Responsive) */}
        <div
          style={{
            background: 'var(--surface-soft)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 16px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Verification Calibration Telemetry
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: calibrationConfidence === 100 ? '#10B981' : 'var(--primary)' }}>
              {calibrationConfidence}% Calibrated
            </span>
          </div>
          <div style={{ height: '6px', background: 'var(--surface-hover)', borderRadius: '99px', overflow: 'hidden' }}>
            <motion.div
              style={{
                height: '100%',
                background: calibrationConfidence === 100 ? '#10B981' : 'var(--gradient-primary)',
                width: `${calibrationConfidence}%`,
                borderRadius: '99px',
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Developer Cockpit Question Canvas (Theme-Aware & Responsive) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          style={{
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(24px)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--border)',
            padding: 'clamp(18px, 3vw, 28px)',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Category Ribbon */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--primary)',
                background: 'var(--primary-dim)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
              }}
            >
              {currentQuestion.category}
            </span>
            <span style={{ fontSize: '11.5px', color: 'var(--text-subtle)', fontWeight: 600 }}>
              Skill Focus: <strong>{currentQuestion.skillTarget}</strong>
            </span>
          </div>

          {/* Question Text */}
          <h4
            style={{
              fontSize: '16.5px',
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: '16px',
              lineHeight: 1.45,
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {currentQuestion.question}
          </h4>

          {/* Dark Monaco Code Studio Canvas */}
          {currentQuestion.codeSnippet && (
            <div
              style={{
                background: '#090D16',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '16px 20px',
                marginBottom: '20px',
                overflowX: 'auto',
                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={12} color="#94A3B8" />
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                    snippet_sandbox.js
                  </span>
                </div>
              </div>

              <pre style={{ margin: 0, fontSize: '13px', fontFamily: 'Consolas, Monaco, monospace', color: '#38BDF8', lineHeight: 1.6 }}>
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Interactive Keyboard Option Capsules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {currentQuestion.options.map((opt) => {
              const isChosen = selectedOptionId === opt.id
              let cardBg = 'var(--surface-soft)'
              let cardBorder = 'var(--border)'
              let cardTextColor = 'var(--text)'
              let indicatorBg = 'var(--surface)'

              if (isCurrentEvaluated) {
                if (opt.id === currentQuestion.correct) {
                  cardBg = 'rgba(16, 185, 129, 0.12)'
                  cardBorder = 'rgba(16, 185, 129, 0.45)'
                  cardTextColor = '#10B981'
                  indicatorBg = '#10B981'
                } else if (isChosen && !isCorrect) {
                  cardBg = 'rgba(244, 63, 94, 0.12)'
                  cardBorder = 'rgba(244, 63, 94, 0.45)'
                  cardTextColor = '#E11D48'
                  indicatorBg = '#F43F5E'
                }
              } else if (isChosen) {
                cardBg = 'var(--primary-dim)'
                cardBorder = 'var(--primary)'
                cardTextColor = 'var(--primary)'
                indicatorBg = 'var(--primary)'
              }

              return (
                <motion.button
                  key={opt.id}
                  whileHover={!isCurrentEvaluated ? { x: 3 } : {}}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isCurrentEvaluated}
                  style={{
                    background: cardBg,
                    border: `1.5px solid ${cardBorder}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '12px 18px',
                    textAlign: 'left',
                    fontSize: '13.5px',
                    color: cardTextColor,
                    cursor: isCurrentEvaluated ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    transition: 'all 0.15s ease',
                    boxShadow: isChosen && !isCurrentEvaluated ? '0 0 16px var(--primary-glow)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '8px',
                      background: indicatorBg,
                      color: isChosen || (isCurrentEvaluated && opt.id === currentQuestion.correct) ? '#FFFFFF' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      flexShrink: 0,
                      border: isChosen || isCurrentEvaluated ? 'none' : '1px solid var(--border)',
                    }}
                  >
                    {isCurrentEvaluated && opt.id === currentQuestion.correct ? (
                      <Check size={14} strokeWidth={3} />
                    ) : isCurrentEvaluated && isChosen && !isCorrect ? (
                      <X size={14} strokeWidth={3} />
                    ) : (
                      opt.id
                    )}
                  </div>
                  <span style={{ lineHeight: 1.45, flex: 1 }}>{opt.text}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Instant Evaluation Feedback Drawer */}
          {isCurrentEvaluated && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '14px 18px',
                fontSize: '13px',
                color: 'var(--text)',
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                {isCorrect ? (
                  <CheckCircle2 size={16} color="#10B981" />
                ) : (
                  <AlertCircle size={16} color="#F43F5E" />
                )}
                <strong style={{ color: isCorrect ? '#10B981' : '#E11D48' }}>
                  {isCorrect ? 'Correct Analysis!' : 'Engineering Insight:'}
                </strong>
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={onBack}
          className="btn btn-outline"
          style={{ padding: '10px 22px', borderRadius: '99px', fontSize: '13px', cursor: 'pointer', gap: '6px' }}
        >
          <ArrowLeft size={15} />
          <span>Back to Match & Skills</span>
        </button>

        {!isCurrentEvaluated ? (
          <button
            onClick={handleSubmitCurrent}
            disabled={!selectedOptionId}
            className="btn btn-primary"
            style={{
              padding: '13px 30px',
              borderRadius: '99px',
              fontSize: '14px',
              fontWeight: 800,
              gap: '8px',
              boxShadow: '0 4px 20px var(--primary-glow)',
              cursor: !selectedOptionId ? 'not-allowed' : 'pointer',
            }}
          >
            <span>Submit Answer</span>
            <ArrowRight size={15} />
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="btn btn-primary"
            style={{
              padding: '13px 30px',
              borderRadius: '99px',
              fontSize: '14px',
              fontWeight: 800,
              gap: '8px',
              boxShadow: '0 4px 20px var(--primary-glow)',
              cursor: 'pointer',
            }}
          >
            <span>
              {currentQIndex < totalQuestions - 1
                ? 'Continue to Next Question'
                : 'Complete Diagnostic Calibration'}
            </span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </motion.div>
  )
}
