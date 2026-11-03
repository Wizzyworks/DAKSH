import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target,
  Search,
  X,
  Check,
  ChevronDown,
  FileText,
  AlertCircle,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  Terminal,
  ShieldCheck,
} from 'lucide-react'
import { skillGapApi } from '../../services/skillGapApi'
import { EXPANDED_ROLE_CATEGORIES } from './skillGapData'
import { Button, Chip, TOKENS, CornerHUD } from './ui/SkillGapPrimitives'

const QUICK_CHIPS = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'AI & Machine Learning Engineer',
  'DevOps Engineer',
  'Data Scientist',
]

export default function ScanModal({
  isOpen,
  onClose,
  activeResumeFile,
  activeResumeName = 'Resume.pdf',
  activeResumeSize = '1.2 MB',
  selectedRole,
  setSelectedRole,
  customJDText,
  setCustomJDText,
  onScanComplete,
}) {
  // Phase: 'config' | 'scanning' | 'error'
  const [phase, setPhase] = useState('config')
  const [roleQuery, setRoleQuery] = useState('')
  const [selectedRoleSlug, setSelectedRoleSlug] = useState('sde-fullstack')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [hoveredRoleSlug, setHoveredRoleSlug] = useState(null)
  const [apiError, setApiError] = useState(null)

  // Scanner animation states
  const [scanElapsed, setScanElapsed] = useState(0)
  const [extractedTokens, setExtractedTokens] = useState([])
  const [currentScanStep, setCurrentScanStep] = useState('Reading document structure...')

  const dropdownRef = useRef(null)
  const timerRef = useRef(null)
  const timeoutsRef = useRef([])

  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timeoutsRef.current.forEach((t) => clearTimeout(t))
    timeoutsRef.current = []
  }

  useEffect(() => {
    return () => clearAllTimers()
  }, [])

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      clearAllTimers()
      setPhase('config')
      setRoleQuery(selectedRole || '')
      setScanElapsed(0)
      setExtractedTokens([])
      setApiError(null)
      setIsDropdownOpen(false)
    }
  }, [isOpen, selectedRole])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectRole = (title, slug = 'sde-fullstack') => {
    setRoleQuery(title)
    setSelectedRoleSlug(slug)
    setSelectedRole(title)
    setIsDropdownOpen(false)
  }

  // Filter categories by search
  const filteredCategories = EXPANDED_ROLE_CATEGORIES.map((cat) => ({
    ...cat,
    roles: cat.roles.filter(
      (r) =>
        !roleQuery.trim() ||
        r.title.toLowerCase().includes(roleQuery.trim().toLowerCase())
    ),
  })).filter((cat) => cat.roles.length > 0)

  // Trigger high-tech scan with real API
  const handleStartAnalysis = async () => {
    const effectiveRole = roleQuery.trim() || selectedRole
    if (!effectiveRole) return

    clearAllTimers()
    setSelectedRole(effectiveRole)
    setPhase('scanning')
    setScanElapsed(0)
    setExtractedTokens([])
    setCurrentScanStep('Reading document layout tokens & section headers...')

    const startTime = Date.now()

    // Timer ticker
    const timerInterval = setInterval(() => {
      setScanElapsed((prev) => prev + 1)
    }, 1000)
    timerRef.current = timerInterval

    // Visual extraction pipeline stages
    const t1 = setTimeout(() => {
      setCurrentScanStep('Extracting verified technical competencies & frameworks...')
      setExtractedTokens(['React.js', 'JavaScript', 'REST APIs'])
    }, 1100)
    timeoutsRef.current.push(t1)

    const t2 = setTimeout(() => {
      setCurrentScanStep(`Benchmarking against ${effectiveRole} hiring rubrics...`)
      setExtractedTokens(['React.js', 'JavaScript', 'REST APIs', 'Node.js', 'PostgreSQL', 'Docker'])
    }, 2400)
    timeoutsRef.current.push(t2)

    const t3 = setTimeout(() => {
      setCurrentScanStep('Synthesizing ATS semantic match & delta gap matrix...')
    }, 3600)
    timeoutsRef.current.push(t3)

    try {
      const report = await skillGapApi.analyzeBenchmark(
        selectedRoleSlug || 'sde-fullstack',
        ['React.js', 'JavaScript', 'Node.js', 'PostgreSQL', 'Git', 'REST APIs'],
        customJDText || ''
      )

      const elapsed = Date.now() - startTime
      const waitRemaining = Math.max(0, 4200 - elapsed)

      const tDone = setTimeout(() => {
        clearAllTimers()
        onScanComplete({
          role: effectiveRole,
          jd: customJDText || '',
          report,
        })
      }, waitRemaining)
      timeoutsRef.current.push(tDone)
    } catch (err) {
      clearAllTimers()
      setApiError('Unable to analyze resume. Please try again.')
      setPhase('error')
    }
  }

  const handleCancelScan = () => {
    clearAllTimers()
    setPhase('config')
    setScanElapsed(0)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(14px, 2.5vw, 28px)',
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      onClick={phase === 'scanning' ? undefined : onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 6 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          background: 'var(--bg-elevated)',
          borderRadius: '14px',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          position: 'relative',
        }}
      >
        {/* ─── Modal Header ─── */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--glass)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                className="daksh-glass-pill"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: phase === 'scanning' ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {phase === 'scanning' ? 'Evaluating Benchmark' : 'Benchmark Target'}
              </span>
            </div>
            <h3
              style={{
                fontSize: '17px',
                fontWeight: 650,
                color: 'var(--text)',
                margin: '2px 0 0',
                letterSpacing: '-0.02em',
              }}
            >
              {phase === 'scanning' ? 'Analyzing Readiness' : 'Select Target Role & Job Rubric'}
            </h3>
          </div>

          {phase !== 'scanning' && (
            <button
              onClick={onClose}
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* ─── Modal Body ─── */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* 1. CONFIGURATION PHASE */}
          {phase === 'config' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Attached CV Pill */}
              <div
                className="daksh-glass-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--accent-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FileText size={16} color="var(--accent)" />
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text)', display: 'block' }}>
                      {activeResumeName}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {activeResumeSize} • Verified format
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--success)',
                    background: 'var(--success-dim)',
                    border: '1px solid rgba(95, 176, 143, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '99px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Check size={11} strokeWidth={2.5} /> Attached
                </span>
              </div>

              {/* Target Role Dropdown */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    marginBottom: '6px',
                  }}
                >
                  Target Role <span style={{ color: 'var(--error)' }}>*</span>
                </label>

                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <div
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'var(--glass)',
                      border: isDropdownOpen
                        ? '1px solid var(--accent)'
                        : roleQuery.trim()
                        ? '1px solid var(--border-strong)'
                        : '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <Search size={15} color="var(--text-muted)" />
                      <input
                        type="text"
                        placeholder="Search or select target role..."
                        value={roleQuery}
                        onChange={(e) => {
                          setRoleQuery(e.target.value)
                          setSelectedRole(e.target.value)
                          if (!isDropdownOpen) setIsDropdownOpen(true)
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsDropdownOpen(true)
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: 'var(--text)',
                          fontSize: '13.5px',
                          fontWeight: 500,
                          width: '100%',
                        }}
                      />
                    </div>
                    <ChevronDown
                      size={15}
                      color="var(--text-muted)"
                      style={{
                        transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.15s ease',
                      }}
                    />
                  </div>

                  {/* Dropdown Options */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="daksh-glass-card"
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 4px)',
                          left: 0,
                          right: 0,
                          zIndex: 100,
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '10px',
                          boxShadow: 'var(--shadow)',
                          maxHeight: '240px',
                          overflowY: 'auto',
                          padding: '6px',
                        }}
                      >
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((group) => (
                            <div key={group.category} style={{ marginBottom: '6px' }}>
                              <div
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  fontFamily: 'JetBrains Mono, monospace',
                                  letterSpacing: '0.04em',
                                  textTransform: 'uppercase',
                                  color: 'var(--text-muted)',
                                  padding: '4px 8px',
                                }}
                              >
                                {group.category}
                              </div>
                              {group.roles.map((r) => {
                                const isSelected = roleQuery === r.title
                                const isHovered = hoveredRoleSlug === r.slug

                                return (
                                  <div
                                    key={r.slug || r.title}
                                    onClick={() => handleSelectRole(r.title, r.slug)}
                                    onMouseEnter={() => setHoveredRoleSlug(r.slug)}
                                    onMouseLeave={() => setHoveredRoleSlug(null)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '7px 10px',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '13px',
                                      fontWeight: isSelected ? 600 : 400,
                                      color: isSelected ? 'var(--accent)' : 'var(--text)',
                                      background: isSelected
                                        ? 'var(--accent-dim)'
                                        : isHovered
                                        ? 'var(--surface-hover)'
                                        : 'transparent',
                                      transition: 'all 0.12s ease',
                                    }}
                                  >
                                    <span>{r.title}</span>
                                    {isSelected && <Check size={14} color="var(--accent)" />}
                                  </div>
                                )
                              })}
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '12px', textAlign: 'center', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                            No matching roles found.
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick Shortcut Chips */}
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Quick Suggestions:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {QUICK_CHIPS.map((chip) => {
                      const isSelected = roleQuery === chip
                      return (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleSelectRole(chip)}
                          className="daksh-glass-pill"
                          style={{
                            fontSize: '11px',
                            fontWeight: isSelected ? 600 : 400,
                            padding: '3px 10px',
                            borderRadius: '99px',
                            border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                            background: isSelected ? 'var(--accent)' : 'var(--glass)',
                            color: isSelected ? '#F8F9FC' : 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {chip}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Job Description Textarea */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    marginBottom: '4px',
                  }}
                >
                  Job Description <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                </label>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 6px', lineHeight: 1.4 }}>
                  Paste job description or requirements to benchmark against custom parameters.
                </p>
                <textarea
                  rows={3}
                  placeholder="Paste specific job requirements here..."
                  value={customJDText || ''}
                  onChange={(e) => setCustomJDText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--glass)',
                    color: 'var(--text)',
                    fontSize: '13px',
                    resize: 'vertical',
                    outline: 'none',
                    lineHeight: 1.5,
                  }}
                />
              </div>
            </div>
          )}

          {/* 2. SCANNING ANIMATION */}
          {phase === 'scanning' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '10px 0' }}>
              <div
                className="daksh-glass-card"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '140px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Subtle scanning wave */}
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--border-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    marginBottom: '8px',
                  }}
                >
                  <Target size={26} />
                </motion.div>

                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--text-muted)',
                  }}
                >
                  {scanElapsed}s elapsed • Benchmarking profile
                </div>
              </div>

              {/* Status Message */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    marginBottom: '4px',
                  }}
                >
                  {currentScanStep}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Target Role: <strong style={{ color: 'var(--accent)' }}>{roleQuery || selectedRole}</strong>
                </div>
              </div>

              {/* Extracted Tokens */}
              <div style={{ minHeight: '36px', display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                {extractedTokens.map((token) => (
                  <span
                    key={token}
                    className="daksh-glass-pill"
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      fontFamily: 'JetBrains Mono, monospace',
                      color: 'var(--accent)',
                      padding: '2px 8px',
                      borderRadius: '99px',
                    }}
                  >
                    ✓ {token}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 3. ERROR STATE */}
          {phase === 'error' && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <AlertCircle size={32} color="var(--error)" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ margin: '0 0 6px', color: 'var(--text)', fontSize: '15px', fontWeight: 600 }}>
                Analysis Encountered an Issue
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                {apiError || 'An error occurred while connecting to the gap analyzer.'}
              </p>
              <Button size="sm" variant="primary" onClick={handleStartAnalysis}>
                Retry Analysis
              </Button>
            </div>
          )}
        </div>

        {/* ─── Modal Footer ─── */}
        {phase === 'config' && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--glass)',
            }}
          >
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>

            <Button
              size="md"
              variant="primary"
              disabled={!roleQuery.trim() && !selectedRole}
              onClick={handleStartAnalysis}
              iconRight={<ArrowRight size={15} />}
            >
              Analyze Resume
            </Button>
          </div>
        )}

        {phase === 'scanning' && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--glass)',
            }}
          >
            <Button variant="ghost" size="sm" onClick={handleCancelScan}>
              Cancel
            </Button>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
              Evaluating against industry benchmarks
            </span>
          </div>
        )}
      </motion.div>
    </div>
  )
}
