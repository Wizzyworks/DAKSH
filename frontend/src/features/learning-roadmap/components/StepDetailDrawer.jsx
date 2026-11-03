import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Play,
  CheckCircle2,
  HelpCircle,
  Terminal,
  FileText,
  RotateCcw,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Trash2,
} from 'lucide-react'

export default function StepDetailDrawer({
  selectedStep,
  onClose,
  onOpenClassroom,
  onMarkCompleted,
  onDeleteStep,
}) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  if (!selectedStep) return null

  const isVideo = selectedStep.type === 'video'
  const isQuiz = selectedStep.type === 'quiz'
  const isChallenge = selectedStep.type === 'challenge'
  const isSpec = selectedStep.type === 'spec' || selectedStep.type === 'project'
  const isCompleted = selectedStep.status === 'completed'

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 70,
          pointerEvents: 'none',
          fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
        }}
      >
        {/* Backdrop (clicks outside to close) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            pointerEvents: 'auto',
          }}
        />

        {/* Slide-over Drawer from Right (or Bottom-Sheet on mobile) */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '440px',
            background: 'var(--surface-card)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderLeft: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xl), -12px 0 36px rgba(0, 0, 0, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface-soft)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: 'var(--primary-dim)',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                }}
              >
                STAGE {selectedStep.stepNumber || '01'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: isCompleted ? 'var(--success)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={12} />
                    <span>Completed</span>
                  </>
                ) : (
                  <span>In Progress</span>
                )}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {onDeleteStep && (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  aria-label="Delete step"
                  title="Delete this step from roadmap"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.08)',
                    color: 'var(--error)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close step details"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Title & Type */}
            <div>
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--text-subtle)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  fontWeight: 600,
                }}
              >
                {selectedStep.type.toUpperCase()} MODULE
              </span>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--text)',
                  margin: '4px 0 8px 0',
                  lineHeight: 1.35,
                }}
              >
                {selectedStep.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} />
                  <span>{selectedStep.duration || '25 mins'}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)' }}>
                  <Award size={13} />
                  <span>+100 XP</span>
                </span>
              </div>
            </div>

            {/* Contextual Card: VIDEO MODULE */}
            {isVideo && (
              <div
                style={{
                  background: 'var(--surface-soft)',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                    Watch Progress
                  </span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                    {isCompleted ? '100% Completed' : '0% Watched'}
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    height: '6px',
                    borderRadius: '9999px',
                    background: 'var(--border)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: isCompleted ? '100%' : '20%',
                      background: isCompleted ? 'var(--success)' : 'var(--accent)',
                      borderRadius: '9999px',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-subtle)' }}>
                  <span>Watched: {isCompleted ? selectedStep.duration : '0:00'}</span>
                  <span>Remaining: {isCompleted ? '0:00' : selectedStep.duration}</span>
                </div>
              </div>
            )}

            {/* Contextual Card: QUIZ MODULE */}
            {isQuiz && (
              <div
                style={{
                  background: 'var(--surface-soft)',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={18} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>
                    Active Recall Challenge
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  5 scenario-grounded multiple-choice questions. Score ≥ 80% to earn milestone badge and trigger SuperMemo SM-2 retention logs.
                </p>
                <div style={{ display: 'flex', gap: '8px', fontSize: '11.5px', color: 'var(--text-subtle)' }}>
                  <span>• 5 Questions</span>
                  <span>• 10 Mins Time Limit</span>
                  <span>• 1 Attempt Remaining</span>
                </div>
              </div>
            )}

            {/* Contextual Card: CODING CHALLENGE */}
            {isChallenge && (
              <div
                style={{
                  background: 'var(--surface-soft)',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={18} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>
                    Practical Implementation Lab
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Write clean, concurrency-safe code in the browser sandbox. Test against edge cases, network partitioning, and consensus timeout thresholds.
                </p>
              </div>
            )}

            {/* Spaced Repetition Cadence Info */}
            <div
              style={{
                background: 'var(--surface-soft)',
                border: '1px dashed var(--border-accent)',
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <RotateCcw size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--text)' }}>Spaced Repetition Telemetry:</strong> Completing this activity triggers automatic micro-reviews at Day +7, +14, +21, and +30.
              </div>
            </div>
          </div>

          {/* Footer CTAs */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <motion.button
              onClick={() => onOpenClassroom(selectedStep)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '13px',
                borderRadius: '9999px',
                background: 'var(--gradient-primary)',
                color: 'var(--on-acc)',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 8px 20px -4px rgba(91, 108, 240, 0.4)',
              }}
            >
              <Play size={16} fill="var(--on-acc)" />
              <span>{isCompleted ? 'Review Lecture Again' : 'Start / Continue Learning'}</span>
            </motion.button>

            {!isCompleted && (
              <button
                type="button"
                onClick={() => onMarkCompleted(selectedStep.id)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '9999px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Mark as Completed
              </button>
            )}

            {/* Step Deletion Option */}
            {showConfirmDelete ? (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  marginTop: '4px',
                }}
              >
                <p style={{ fontSize: '12.5px', color: 'var(--text)', margin: '0 0 10px', fontWeight: 600, lineHeight: 1.4 }}>
                  Delete this {isVideo ? 'video' : 'activity'}? The rest of your roadmap will remain completely intact.
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(false)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '4px 12px', fontSize: '11.5px', borderRadius: '99px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowConfirmDelete(false)
                      onDeleteStep(selectedStep.id)
                    }}
                    className="btn btn-sm"
                    style={{
                      padding: '4px 14px',
                      fontSize: '11.5px',
                      borderRadius: '99px',
                      background: 'var(--error)',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Yes, Delete Step
                  </button>
                </div>
              </div>
            ) : (
              onDeleteStep && (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  style={{
                    width: '100%',
                    padding: '9px',
                    borderRadius: '9999px',
                    background: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: 'var(--error)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '2px',
                  }}
                >
                  <Trash2 size={13} />
                  <span>Delete This {isVideo ? 'Video' : 'Activity'}</span>
                </button>
              )
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

