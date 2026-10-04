import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Check, X } from 'lucide-react'
import { ADAPTIVE_QUESTION_POOL } from './skillGapData'

export default function Step4DiagnosticArena({
  arenaAnswers,
  setArenaAnswers,
  onBack,
  onCompleteCalibration,
}) {
  // Current active question index (0 to total - 1)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  // Track submission state for the current question
  const [isCurrentEvaluated, setIsCurrentEvaluated] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState(null)

  const currentQuestion = ADAPTIVE_QUESTION_POOL[currentQIndex] || ADAPTIVE_QUESTION_POOL[0]
  const totalQuestions = ADAPTIVE_QUESTION_POOL.length
  const calibrationConfidence = Math.round(((currentQIndex + (isCurrentEvaluated ? 1 : 0)) / totalQuestions) * 100)

  // Handle option selection
  const handleSelectOption = (optionId) => {
    if (isCurrentEvaluated) return
    setSelectedOptionId(optionId)
  }

  // Submit current question evaluation
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

  // Advance to next question or complete calibration
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {/* 1. Header & Live Calibration Confidence Telemetry */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 2px', fontFamily: 'Outfit, sans-serif' }}>
              Step 4: Adaptive Diagnostic Arena
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              One-by-one conceptual and debugging questions dynamically calibrating your true competency baseline.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
              Question {currentQIndex + 1} of {totalQuestions}
            </span>
          </div>
        </div>

        {/* Live Calibration Confidence Bar */}
        <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Skill Gap Calibration Confidence
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: calibrationConfidence === 100 ? '#10B981' : 'var(--primary)' }}>
              {calibrationConfidence}% Calibrated
            </span>
          </div>
          <div style={{ height: '6px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
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

      {/* 2. Single Question Focus Container (Animated Slide Transition) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="gradient-border-card"
          style={{
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(24px)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
            padding: '28px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Domain Category Header (NO Difficulty Tags!) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', background: 'var(--surface-soft)', padding: '3px 10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
              {currentQuestion.category}
            </span>
            <span style={{ fontSize: '11.5px', color: 'var(--text-subtle)', fontWeight: 600 }}>
              Competency: {currentQuestion.skillTarget}
            </span>
          </div>

          {/* Question Title & Prompt */}
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', marginBottom: '14px', lineHeight: 1.4, fontFamily: 'Outfit, sans-serif' }}>
            {currentQuestion.question}
          </h4>

          {/* Dark Obsidian IDE Code Sandbox with Mac Dots */}
          {currentQuestion.codeSnippet && (
            <div
              style={{
                background: '#090D16',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '14px 18px',
                marginBottom: '18px',
                overflowX: 'auto',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Terminal size={12} color="#94A3B8" />
                  <span style={{ fontSize: '10.5px', color: '#94A3B8', fontFamily: 'monospace' }}>
                    snippet_sandbox.js
                  </span>
                </div>
              </div>

              <pre style={{ margin: 0, fontSize: '12.5px', fontFamily: 'Consolas, Monaco, monospace', color: '#38BDF8', lineHeight: 1.55 }}>
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* 4 Interactive Option Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            {currentQuestion.options.map((opt) => {
              const isChosen = selectedOptionId === opt.id
              let cardBg = 'var(--surface-soft)'
              let cardBorder = 'var(--border)'
              let cardTextColor = 'var(--text)'
              let indicatorBg = 'var(--surface)'

              if (isCurrentEvaluated) {
                if (opt.id === currentQuestion.correct) {
                  cardBg = 'rgba(16, 185, 129, 0.12)'
                  cardBorder = 'rgba(16, 185, 129, 0.5)'
                  cardTextColor = '#10B981'
                  indicatorBg = '#10B981'
                } else if (isChosen && !isCorrect) {
                  cardBg = 'rgba(239, 68, 68, 0.12)'
                  cardBorder = 'rgba(239, 68, 68, 0.5)'
                  cardTextColor = '#EF4444'
                  indicatorBg = '#EF4444'
                }
              } else if (isChosen) {
                cardBg = 'rgba(99, 102, 241, 0.12)'
                cardBorder = 'var(--primary)'
                cardTextColor = 'var(--primary)'
                indicatorBg = 'var(--primary)'
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isCurrentEvaluated}
                  style={{
                    background: cardBg,
                    border: `1.5px solid ${cardBorder}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: cardTextColor,
                    cursor: isCurrentEvaluated ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                    boxShadow: isChosen && !isCurrentEvaluated ? '0 0 12px rgba(99, 102, 241, 0.2)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: indicatorBg,
                      color: isChosen || (isCurrentEvaluated && opt.id === currentQuestion.correct) ? '#FFFFFF' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}
                  >
                    {isCurrentEvaluated && opt.id === currentQuestion.correct ? (
                      <Check size={13} strokeWidth={3} />
                    ) : isCurrentEvaluated && isChosen && !isCorrect ? (
                      <X size={13} strokeWidth={3} />
                    ) : (
                      opt.id
                    )}
                  </div>
                  <span style={{ lineHeight: 1.45, flex: 1 }}>{opt.text}</span>
                </button>
              )
            })}
          </div>

          {/* Instant Evaluation Feedback Card */}
          {isCurrentEvaluated && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                fontSize: '12.5px',
                color: 'var(--text)',
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                {isCorrect ? (
                  <CheckCircle2 size={16} color="#10B981" />
                ) : (
                  <AlertCircle size={16} color="#EF4444" />
                )}
                <strong style={{ color: isCorrect ? '#10B981' : '#EF4444' }}>
                  {isCorrect ? 'Correct Analysis!' : 'Conceptual Insight:'}
                </strong>
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 3. Action Footer (Single-Step Transition Buttons) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onBack}
          className="btn btn-outline"
          style={{ padding: '10px 20px', borderRadius: '99px', fontSize: '13px', cursor: 'pointer', gap: '6px' }}
        >
          <ArrowLeft size={15} />
          <span>Back to Report</span>
        </button>

        {!isCurrentEvaluated ? (
          <button
            onClick={handleSubmitCurrent}
            disabled={!selectedOptionId}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              borderRadius: '99px',
              fontSize: '13.5px',
              fontWeight: 800,
              gap: '6px',
              boxShadow: '0 4px 16px var(--primary-glow)',
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
              padding: '12px 28px',
              borderRadius: '99px',
              fontSize: '13.5px',
              fontWeight: 800,
              gap: '8px',
              boxShadow: '0 4px 16px var(--primary-glow)',
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
