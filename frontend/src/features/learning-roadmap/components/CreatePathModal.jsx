import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Target,
  SlidersHorizontal,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  X,
  Command,
  Video,
  FileText,
  HelpCircle,
  Terminal,
  RotateCcw,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  Bot,
  ExternalLink,
  Layers,
} from 'lucide-react'

const SUGGESTIONS = [
  'Full Stack Next.js',
  'System Design & Distributed Systems',
  'Kubernetes & Cloud Native',
  'AI Agent Engineering',
]

const DURATION_PRESETS = [
  {
    id: '2-weeks',
    weeks: 2,
    label: '2 Weeks',
    subtitle: 'Sprint • 15 hrs/wk',
    icon: Zap,
    iconColor: 'var(--success)',
  },
  {
    id: '4-weeks',
    weeks: 4,
    label: '4 Weeks',
    subtitle: 'Accelerated • 10 hrs/wk',
    icon: TrendingUp,
    iconColor: 'var(--accent)',
  },
  {
    id: '6-weeks',
    weeks: 6,
    label: '6 Weeks',
    subtitle: 'Recommended • 7 hrs/wk',
    isOptimal: true,
    icon: Target,
    iconColor: 'var(--accent)',
  },
  {
    id: '8-weeks',
    weeks: 8,
    label: '8 Weeks',
    subtitle: 'Comprehensive • 5 hrs/wk',
    icon: Clock,
    iconColor: 'var(--text-muted)',
  },
  {
    id: '12-weeks',
    weeks: 12,
    label: '12 Weeks',
    subtitle: 'Mastery • 3 hrs/wk',
    icon: Target,
    iconColor: 'var(--text-muted)',
  },
]

// Extract YouTube ID for real thumbnail generation
function getYouTubeThumbnail(url) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

export default function CreatePathModal({ isOpen, onClose, onGenerateMap }) {
  // Wizard Step: 1 = Initialize, 2 = Curriculum Assets, 3 = AI Co-Pilot
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1 State: Course Meta
  const [courseTitle, setCourseTitle] = useState('Distributed Systems & Consensus Engineering')
  const [selectedDurationId, setSelectedDurationId] = useState('6-weeks')
  const [customWeeks, setCustomWeeks] = useState(10)

  // Step 2 State: Video Lectures & Assets
  const [lectures, setLectures] = useState([
    {
      id: 'lec-1',
      title: 'Introduction to Consensus & Byzantine Fault Tolerance',
      url: 'https://www.youtube.com/watch?v=R2-9bsKmFBo',
      duration: '24 mins',
      type: 'video',
    },
    {
      id: 'lec-2',
      title: 'The Raft Consensus Algorithm: Leader Election & Log Replication',
      url: 'https://www.youtube.com/watch?v=vYp4LYbnnW8',
      duration: '32 mins',
      type: 'video',
    },
  ])

  // Step 3 State: SETU AI Suggestions
  const [aiSuggestions, setAiSuggestions] = useState([
    {
      id: 'sug-quiz',
      type: 'quiz',
      title: '5-Question Scenario Quiz: Byzantine Dilemmas & Quorums',
      desc: 'Active recall check testing network partitioning, split votes, and heartbeat timeouts.',
      reward: '+100 XP',
      included: true,
      icon: HelpCircle,
    },
    {
      id: 'sug-spec',
      type: 'spec',
      title: 'Official Spec: Raft Paper & TLA+ Verification Compendium',
      desc: 'Original Ongaro & Ousterhout paper breakdown with state machine diagrams (16 Pages).',
      reward: '+50 XP',
      included: true,
      icon: FileText,
    },
    {
      id: 'sug-lab',
      type: 'challenge',
      title: 'Hands-on Lab: Build a 3-Node Raft Cluster in Go / Node.js',
      desc: 'Simulate packet drops, election timeouts, and commit index synchronization.',
      reward: '+150 XP',
      included: false,
      icon: Terminal,
    },
  ])

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Reset step on reopen
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
    }
  }, [isOpen])

  // ─── Step 1 Handlers ────────────────────────────────────────────────────────
  const handleSelectPreset = (presetId) => setSelectedDurationId(presetId)
  const handleSelectCustom = () => setSelectedDurationId('custom')
  const handleIncrementWeeks = (e) => {
    e.stopPropagation()
    setSelectedDurationId('custom')
    setCustomWeeks((w) => Math.min(52, w + 1))
  }
  const handleDecrementWeeks = (e) => {
    e.stopPropagation()
    setSelectedDurationId('custom')
    setCustomWeeks((w) => Math.max(1, w - 1))
  }

  // ─── Step 2 Handlers (Video Lectures) ────────────────────────────────────────
  const handleAddLecture = () => {
    const newIdx = lectures.length + 1
    setLectures((prev) => [
      ...prev,
      {
        id: `lec-${Date.now()}`,
        title: `Lesson 0${newIdx}: Core Concept & Implementation`,
        url: '',
        duration: '20 mins',
        type: 'video',
      },
    ])
  }

  const handleUpdateLecture = (id, field, value) => {
    setLectures((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const handleRemoveLecture = (id) => {
    if (lectures.length <= 1) return
    setLectures((prev) => prev.filter((item) => item.id !== id))
  }

  const handleMoveLecture = (index, direction) => {
    const targetIdx = index + direction
    if (targetIdx < 0 || targetIdx >= lectures.length) return
    setLectures((prev) => {
      const copy = [...prev]
      const [moved] = copy.splice(index, 1)
      copy.splice(targetIdx, 0, moved)
      return copy
    })
  }

  // ─── Step 3 Handlers (AI Suggestions) ───────────────────────────────────────
  const handleToggleSuggestion = (id) => {
    setAiSuggestions((prev) =>
      prev.map((sug) => (sug.id === id ? { ...sug, included: !sug.included } : sug))
    )
  }

  // Final Compilation into Dynamic Map
  const handleCompileMap = () => {
    const selectedPreset = DURATION_PRESETS.find((p) => p.id === selectedDurationId)
    const weeksCount = selectedDurationId === 'custom' ? customWeeks : selectedPreset?.weeks || 6

    const compiledCourse = {
      id: `course-${Date.now()}`,
      title: courseTitle.trim(),
      weeks: weeksCount,
      durationLabel: selectedDurationId === 'custom' ? `${customWeeks} Weeks (Custom)` : selectedPreset?.label,
      lectures,
      acceptedAiBundles: aiSuggestions.filter((s) => s.included),
      totalStages: lectures.length + aiSuggestions.filter((s) => s.included).length,
      createdAt: new Date().toISOString(),
    }

    onGenerateMap(compiledCourse)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
          }}
        >
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />

          {/* Floating Studio Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '680px',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              background: 'var(--surface-card)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--border)',
              borderRadius: '30px',
              boxShadow: 'var(--shadow-xl), 0 24px 60px -12px rgba(15, 23, 42, 0.28)',
              padding: '32px 36px 28px',
              zIndex: 1,
            }}
          >
            {/* Close Button in top right */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '20px',
                right: '22px',
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                border: '1px solid var(--border)',
                background: 'var(--surface-soft)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text)'
                e.currentTarget.style.background = 'var(--surface-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.background = 'var(--surface-soft)'
              }}
            >
              <X size={16} />
            </button>

            {/* Stepper Header Tag + 3 Step Dots */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: 'var(--primary-dim)',
                  border: '1px solid var(--border-accent)',
                  color: 'var(--accent)',
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}
              >
                <span>
                  • STEP 0{currentStep} / 03 •{' '}
                  {currentStep === 1
                    ? 'INITIALIZE'
                    : currentStep === 2
                    ? 'CURRICULUM ASSETS'
                    : 'AI CO-PILOT BUNDLE'}
                </span>
              </div>

              {/* Step indicator pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '36px' }}>
                <span
                  style={{
                    width: currentStep === 1 ? '24px' : '8px',
                    height: '6px',
                    borderRadius: '9999px',
                    background: currentStep >= 1 ? 'var(--accent)' : 'var(--border-strong)',
                    transition: 'all 0.25s ease',
                  }}
                />
                <span
                  style={{
                    width: currentStep === 2 ? '24px' : '8px',
                    height: '6px',
                    borderRadius: '9999px',
                    background: currentStep >= 2 ? 'var(--accent)' : 'var(--border-strong)',
                    transition: 'all 0.25s ease',
                  }}
                />
                <span
                  style={{
                    width: currentStep === 3 ? '24px' : '8px',
                    height: '6px',
                    borderRadius: '9999px',
                    background: currentStep === 3 ? 'var(--accent)' : 'var(--border-strong)',
                    transition: 'all 0.25s ease',
                  }}
                />
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                STEP 01: INITIALIZE (COURSE TITLE & DURATION)
               ══════════════════════════════════════════════════════════════════ */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <h2
                    style={{
                      fontSize: '26px',
                      fontWeight: 700,
                      letterSpacing: '-0.025em',
                      color: 'var(--text)',
                      margin: '0 0 6px 0',
                      lineHeight: 1.25,
                    }}
                  >
                    Create Your Learning Path
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                    Let&apos;s start by defining what you want to learn.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (courseTitle.trim()) setCurrentStep(2)
                  }}
                >
                  {/* Course Title Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <label
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: 'var(--text)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>Course Title</span>
                        <span style={{ color: 'var(--error)' }}>*</span>
                      </label>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-subtle)' }}>
                        Clear &amp; specific topic
                      </span>
                    </div>

                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '16px',
                        border: '1.5px solid var(--border)',
                        background: 'var(--surface-soft)',
                        padding: '0 14px',
                        transition: 'border-color var(--transition), box-shadow var(--transition)',
                      }}
                    >
                      <div style={{ color: 'var(--accent)', marginRight: '10px' }}>
                        <BookOpen size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        placeholder="e.g. Distributed Systems & Consensus Engineering"
                        style={{
                          flex: 1,
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          padding: '13px 0',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: 'var(--text)',
                          fontFamily: 'inherit',
                        }}
                      />
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-subtle)',
                        }}
                      >
                        <Command size={11} />
                        <span>K</span>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginTop: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11.5px',
                          color: 'var(--text-subtle)',
                          fontWeight: 500,
                          marginRight: '2px',
                        }}
                      >
                        Suggestions:
                      </span>
                      {SUGGESTIONS.map((sug, idx) => {
                        const isSelected = courseTitle === sug
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCourseTitle(sug)}
                            style={{
                              fontSize: '11.5px',
                              padding: '4px 11px',
                              borderRadius: '9999px',
                              border: isSelected
                                ? '1px solid var(--border-accent)'
                                : '1px solid var(--border)',
                              background: isSelected ? 'var(--primary-dim)' : 'var(--surface-soft)',
                              color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                              fontWeight: isSelected ? 600 : 500,
                              cursor: 'pointer',
                              transition: 'all var(--transition)',
                            }}
                          >
                            {sug}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Expected Learning Duration */}
                  <div style={{ marginBottom: '28px' }}>
                    <div style={{ marginBottom: '6px' }}>
                      <label
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: 'var(--text)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>Expected Learning Duration</span>
                        <span style={{ color: 'var(--error)' }}>*</span>
                      </label>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                        How many weeks do you plan to dedicate to completing this curriculum?
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '10px',
                        marginTop: '12px',
                      }}
                    >
                      {DURATION_PRESETS.map((preset) => {
                        const isSelected = selectedDurationId === preset.id
                        const Icon = preset.icon
                        return (
                          <div
                            key={preset.id}
                            onClick={() => handleSelectPreset(preset.id)}
                            style={{
                              position: 'relative',
                              padding: '14px 14px 12px',
                              borderRadius: '18px',
                              border: isSelected ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                              background: isSelected ? 'var(--primary-dim)' : 'var(--surface-soft)',
                              cursor: 'pointer',
                              transition: 'all var(--transition)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                          >
                            {preset.isOptimal && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '-1px',
                                  right: '-1px',
                                  background: 'var(--accent)',
                                  color: 'var(--on-acc)',
                                  fontSize: '9px',
                                  fontWeight: 700,
                                  letterSpacing: '0.04em',
                                  padding: '2px 8px 3px',
                                  borderRadius: '0 16px 0 10px',
                                  fontFamily: 'var(--font-mono)',
                                }}
                              >
                                OPTIMAL
                              </div>
                            )}

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '6px',
                                paddingRight: preset.isOptimal ? '54px' : '0',
                              }}
                            >
                              <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)' }}>
                                {preset.label}
                              </span>
                              <div
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  border: isSelected
                                    ? '4.5px solid var(--accent)'
                                    : '1.5px solid var(--border-strong)',
                                  background: isSelected ? 'var(--surface-card)' : 'transparent',
                                }}
                              />
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '11.5px',
                                color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                              }}
                            >
                              <Icon size={12} style={{ color: preset.iconColor }} />
                              <span>{preset.subtitle}</span>
                            </div>
                          </div>
                        )
                      })}

                      {/* Custom Stepper */}
                      <div
                        onClick={handleSelectCustom}
                        style={{
                          position: 'relative',
                          padding: '14px 14px 12px',
                          borderRadius: '18px',
                          border:
                            selectedDurationId === 'custom'
                              ? '2px solid var(--accent)'
                              : '1.5px solid var(--border)',
                          background:
                            selectedDurationId === 'custom'
                              ? 'var(--primary-dim)'
                              : 'var(--surface-soft)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                            Custom Weeks
                          </span>
                          <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '6px',
                            background: 'var(--surface)',
                            borderRadius: '9999px',
                            padding: '3px 6px',
                            border: '1px solid var(--border)',
                          }}
                        >
                          <button
                            type="button"
                            onClick={handleDecrementWeeks}
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              border: 'none',
                              background: 'var(--surface-soft)',
                              color: 'var(--text)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Minus size={11} />
                          </button>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                            {customWeeks} wks
                          </span>
                          <button
                            type="button"
                            onClick={handleIncrementWeeks}
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              border: 'none',
                              background: 'var(--surface-soft)',
                              color: 'var(--text)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 1 Submit Action */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        maxWidth: '340px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        padding: '13px 28px',
                        borderRadius: '9999px',
                        background: 'var(--gradient-primary)',
                        color: 'var(--on-acc)',
                        border: 'none',
                        fontSize: '14.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 8px 22px -4px rgba(91, 108, 240, 0.45)',
                      }}
                    >
                      <span>Continue to Add Content</span>
                      <ArrowRight size={16} />
                    </motion.button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-subtle)' }}>
                      <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
                      <span>No credit card or setup required • AI curriculum synthesizer ready</span>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                STEP 02: CURRICULUM ASSET BUILDER (VIDEO LECTURES & REORDER)
               ══════════════════════════════════════════════════════════════════ */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h2
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                        color: 'var(--text)',
                        margin: 0,
                      }}
                    >
                      Add Video Lectures &amp; Assets
                    </h2>
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                    Sequence the foundational lectures for <strong style={{ color: 'var(--text)' }}>{courseTitle}</strong>. Drag or use arrows to reorder.
                  </p>
                </div>

                {/* Video Lecture List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {lectures.map((lec, idx) => {
                    const ytThumb = getYouTubeThumbnail(lec.url)
                    return (
                      <div
                        key={lec.id}
                        style={{
                          background: 'var(--surface-soft)',
                          border: '1px solid var(--border)',
                          borderRadius: '20px',
                          padding: '16px',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        {/* Header line: Index Pill + Reorder Arrows + Delete */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '3px 10px',
                                borderRadius: '9999px',
                                background: 'var(--primary-dim)',
                                color: 'var(--accent)',
                                fontSize: '11px',
                                fontWeight: 700,
                                fontFamily: 'var(--font-mono)',
                              }}
                            >
                              <Video size={12} />
                              <span>LECTURE 0{idx + 1}</span>
                            </span>

                            <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
                              • {lec.duration}
                            </span>
                          </div>

                          {/* Reorder controls & delete */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveLecture(idx, -1)}
                              aria-label="Move lecture up"
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                color: idx === 0 ? 'var(--text-subtle)' : 'var(--text)',
                                cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: idx === 0 ? 0.4 : 1,
                              }}
                            >
                              <ChevronUp size={14} />
                            </button>

                            <button
                              type="button"
                              disabled={idx === lectures.length - 1}
                              onClick={() => handleMoveLecture(idx, 1)}
                              aria-label="Move lecture down"
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                color: idx === lectures.length - 1 ? 'var(--text-subtle)' : 'var(--text)',
                                cursor: idx === lectures.length - 1 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: idx === lectures.length - 1 ? 0.4 : 1,
                              }}
                            >
                              <ChevronDown size={14} />
                            </button>

                            {lectures.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveLecture(lec.id)}
                                aria-label="Remove lecture"
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '8px',
                                  border: '1px solid var(--border)',
                                  background: 'var(--surface)',
                                  color: 'var(--error)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginLeft: '4px',
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Title input */}
                        <div>
                          <input
                            type="text"
                            value={lec.title}
                            onChange={(e) => handleUpdateLecture(lec.id, 'title', e.target.value)}
                            placeholder="Lecture Title (e.g. Leader Election & Heartbeats)"
                            style={{
                              width: '100%',
                              background: 'var(--surface)',
                              border: '1px solid var(--border)',
                              borderRadius: '12px',
                              padding: '10px 14px',
                              fontSize: '13.5px',
                              fontWeight: 600,
                              color: 'var(--text)',
                              outline: 'none',
                              fontFamily: 'inherit',
                            }}
                          />
                        </div>

                        {/* URL input + Live Thumbnail Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ flex: 1 }}>
                            <input
                              type="url"
                              value={lec.url}
                              onChange={(e) => handleUpdateLecture(lec.id, 'url', e.target.value)}
                              placeholder="Paste YouTube or MP4 Video URL"
                              style={{
                                width: '100%',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '9px 12px',
                                fontSize: '12.5px',
                                color: 'var(--text-muted)',
                                outline: 'none',
                                fontFamily: 'var(--font-mono)',
                              }}
                            />
                          </div>

                          {/* Thumbnail preview badge */}
                          {ytThumb ? (
                            <img
                              src={ytThumb}
                              alt="Thumbnail preview"
                              style={{
                                width: '56px',
                                height: '34px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '56px',
                                height: '34px',
                                borderRadius: '8px',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-subtle)',
                              }}
                            >
                              <Video size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* + Add Another Video Lecture button */}
                <button
                  type="button"
                  onClick={handleAddLecture}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '18px',
                    border: '1.5px dashed var(--border-accent)',
                    background: 'var(--primary-dim)',
                    color: 'var(--accent)',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '26px',
                    transition: 'all var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-accent)'
                  }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>+ Add Another Video Lecture</span>
                </button>

                {/* Footer Navigation (Back / Continue) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 18px',
                      borderRadius: '9999px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text-muted)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>

                  <motion.button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 26px',
                      borderRadius: '9999px',
                      background: 'var(--gradient-primary)',
                      color: 'var(--on-acc)',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 8px 22px -4px rgba(91, 108, 240, 0.45)',
                    }}
                  >
                    <span>Continue to AI Suggestions</span>
                    <ArrowRight size={15} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                STEP 03: SETU AI CO-PILOT BUNDLE & MAP GENERATION
               ══════════════════════════════════════════════════════════════════ */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Bot size={20} style={{ color: 'var(--accent)' }} />
                    <h2
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                        color: 'var(--text)',
                        margin: 0,
                      }}
                    >
                      SETU AI Smart Enhancements
                    </h2>
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                    SETU AI analyzed your topic and suggested high-yield retention checkpoints. You have 100% control to include or skip.
                  </p>
                </div>

                {/* AI Suggestions Stack */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {aiSuggestions.map((sug) => {
                    const Icon = sug.icon
                    const isIncluded = sug.included
                    return (
                      <div
                        key={sug.id}
                        style={{
                          background: isIncluded ? 'var(--primary-dim)' : 'var(--surface-soft)',
                          border: isIncluded
                            ? '1.5px solid var(--border-accent)'
                            : '1.5px solid var(--border)',
                          borderRadius: '18px',
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          transition: 'all var(--transition)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              background: isIncluded ? 'var(--accent)' : 'var(--surface)',
                              color: isIncluded ? 'var(--on-acc)' : 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                                {sug.title}
                              </h3>
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-mono)',
                                  color: 'var(--success)',
                                  padding: '1px 6px',
                                  borderRadius: '9999px',
                                  background: 'var(--success-dim)',
                                }}
                              >
                                {sug.reward}
                              </span>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                              {sug.desc}
                            </p>
                          </div>
                        </div>

                        {/* Toggle button: Include / Skip */}
                        <button
                          type="button"
                          onClick={() => handleToggleSuggestion(sug.id)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            border: isIncluded ? 'none' : '1px solid var(--border)',
                            background: isIncluded ? 'var(--accent)' : 'var(--surface)',
                            color: isIncluded ? 'var(--on-acc)' : 'var(--text-muted)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            flexShrink: 0,
                            transition: 'all var(--transition)',
                          }}
                        >
                          {isIncluded ? (
                            <>
                              <Check size={13} strokeWidth={2.5} />
                              <span>Included</span>
                            </>
                          ) : (
                            <span>Skip</span>
                          )}
                        </button>
                      </div>
                    )
                  })}

                  {/* Spaced Repetition Permanent Banner */}
                  <div
                    style={{
                      background: 'var(--surface-soft)',
                      border: '1px dashed var(--border-accent)',
                      borderRadius: '16px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <RotateCcw size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text)' }}>SuperMemo SM-2 Engine Active:</strong> Memory recall reviews scheduled at Day +7, +14, +21, and +30 upon lecture completion.
                    </div>
                  </div>
                </div>

                {/* Curriculum Summary Bar */}
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '14px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    marginBottom: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>Total Path Curriculum:</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    {lectures.length} Lectures • {aiSuggestions.filter((s) => s.included).length} AI Checkpoints • Est. {lectures.length * 25 + 30} mins
                  </span>
                </div>

                {/* Footer Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 18px',
                      borderRadius: '9999px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text-muted)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>

                  <motion.button
                    type="button"
                    onClick={handleCompileMap}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 28px',
                      borderRadius: '9999px',
                      background: 'var(--gradient-primary)',
                      color: 'var(--on-acc)',
                      border: 'none',
                      fontSize: '14.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px -4px rgba(91, 108, 240, 0.45)',
                    }}
                  >
                    <Sparkles size={16} />
                    <span>🚀 Generate My Learning Map</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
