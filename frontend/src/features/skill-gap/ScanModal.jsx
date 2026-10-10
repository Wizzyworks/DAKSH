import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target,
  Sparkles,
  Search,
  X,
  Check,
  ChevronDown,
  FileText,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  FileCode,
  SlidersHorizontal,
} from 'lucide-react'

// Popular quick chips
const POPULAR_ROLE_CHIPS = [
  'Full Stack Web Developer',
  'AI / ML Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'DevOps Engineer',
  'Software Engineer',
]

// Common engineering keywords to detect in JD
const DETECTABLE_KEYWORDS = [
  'react', 'node', 'express', 'python', 'java', 'sql', 'postgres', 'mongodb',
  'docker', 'aws', 'kubernetes', 'redis', 'graphql', 'rest', 'api', 'git',
  'typescript', 'javascript', 'dsa', 'algorithms', 'system design', 'ci/cd',
  'html', 'css', 'tailwind', 'microservices', 'c++', 'golang', 'linux'
]

export default function ScanModal({
  isOpen,
  onClose,
  activeResumeName,
  activeResumeSize,
  selectedRole,
  setSelectedRole,
  customJDText,
  setCustomJDText,
  onScanComplete,
}) {
  // Phase 1 (input) or Phase 2 (scanning)
  const [phase, setPhase] = useState('input') // 'input' | 'scanning' | 'error'

  // Input states
  const [roleQuery, setRoleQuery] = useState(selectedRole || '')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [jdMode, setJdMode] = useState(customJDText?.trim() ? 'paste' : 'skip') // 'paste' | 'skip'
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  // Phase 2 scanning progress states
  const [scanStepIndex, setScanStepIndex] = useState(0) // 0 to 4
  const [scanPercentage, setScanPercentage] = useState(0)
  const [scanTimer, setScanTimer] = useState(null)

  const dropdownRef = useRef(null)
  const modalRef = useRef(null)

  // Sync roleQuery if selectedRole changes
  useEffect(() => {
    if (selectedRole) setRoleQuery(selectedRole)
  }, [selectedRole])

  // Reset phase when opening
  useEffect(() => {
    if (isOpen) {
      setPhase('input')
      setScanStepIndex(0)
      setScanPercentage(0)
      setShowDiscardConfirm(false)
    }
  }, [isOpen])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation & Esc key handling with discard confirmation
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return
      if (e.key === 'Escape') {
        if (phase === 'scanning') {
          handleCancelScan()
        } else if (customJDText?.trim().length > 10) {
          setShowDiscardConfirm(true)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, phase, customJDText])

  // Count detected keywords in pasted JD
  const countKeywords = (text = '') => {
    if (!text.trim()) return 0
    const lower = text.toLowerCase()
    return DETECTABLE_KEYWORDS.filter((kw) => lower.includes(kw)).length
  }

  const keywordCount = countKeywords(customJDText)
  const charCount = customJDText?.length || 0

  // Handle Role Selection
  const handleSelectRole = (role) => {
    setRoleQuery(role)
    setSelectedRole(role)
    setIsDropdownOpen(false)
  }

  // Handle Scanning Phase Execution (Guaranteed 4.5s minimum realistic duration)
  const startScanningExecution = () => {
    const finalRole = roleQuery.trim() || selectedRole
    if (!finalRole) return

    setSelectedRole(finalRole)
    setPhase('scanning')
    setScanStepIndex(0)
    setScanPercentage(10)

    // Step 1: Reading CV (0s - 1.1s)
    const t1 = setTimeout(() => {
      setScanStepIndex(1)
      setScanPercentage(35)
    }, 1100)

    // Step 2: Extracting skills (1.1s - 2.3s)
    const t2 = setTimeout(() => {
      setScanStepIndex(2)
      setScanPercentage(65)
    }, 2300)

    // Step 3: Reading requirements (2.3s - 3.5s)
    const t3 = setTimeout(() => {
      setScanStepIndex(3)
      setScanPercentage(88)
    }, 3500)

    // Step 4: Calculating ATS score (3.5s - 4.6s)
    const t4 = setTimeout(() => {
      setScanStepIndex(4)
      setScanPercentage(100)
    }, 4600)

    // Transition to Result View
    const t5 = setTimeout(() => {
      onScanComplete({
        role: finalRole,
        jd: jdMode === 'paste' ? customJDText : '',
      })
    }, 5200)

    setScanTimer({ t1, t2, t3, t4, t5 })
  }

  const handleCancelScan = () => {
    if (scanTimer) {
      clearTimeout(scanTimer.t1)
      clearTimeout(scanTimer.t2)
      clearTimeout(scanTimer.t3)
      clearTimeout(scanTimer.t4)
      clearTimeout(scanTimer.t5)
    }
    setPhase('input')
    setScanStepIndex(0)
    setScanPercentage(0)
  }

  const handleAttemptClose = () => {
    if (phase === 'scanning') {
      handleCancelScan()
      onClose()
    } else if (customJDText?.trim().length > 10) {
      setShowDiscardConfirm(true)
    } else {
      onClose()
    }
  }

  const checklistItems = [
    { title: 'Reading your CV document', sub: 'Parsing ATS tokens, formatting & layout' },
    { title: 'Extracting verified competencies', sub: 'Identifying frameworks, languages & architectures' },
    { title: 'Matching target job rubric', sub: jdMode === 'paste' && customJDText?.trim() ? 'Aligning with pasted campus drive JD' : 'Benchmarking with Tier-1 industry standards' },
    { title: 'Synthesizing ATS score & gaps', sub: 'Computing match percentage and high-impact deltas' },
  ]

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scan-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleAttemptClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)',
        }}
      />

      {/* Modal Dialog Card */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '620px',
          background: 'var(--surface)',
          border: '1px solid var(--border-focus)',
          borderRadius: '16px',
          boxShadow: '0 24px 70px -10px rgba(0, 0, 0, 0.65), 0 0 35px var(--primary-glow)',
          padding: '24px 28px',
          zIndex: 100000,
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Phase 1: Input Setup */}
        {phase === 'input' && (
          <div>
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      background: 'var(--primary-dim)',
                      padding: '3px 10px',
                      borderRadius: '99px',
                      border: '1px solid var(--border)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    BENCHMARK SETUP
                  </span>
                </div>
                <h2
                  id="scan-modal-title"
                  style={{
                    margin: '0 0 4px',
                    fontSize: '22px',
                    fontWeight: 900,
                    fontFamily: 'Outfit, sans-serif',
                    color: 'var(--text)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Configure Target Role &amp; Benchmark
                </h2>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Select the role track to audit your resume against. Job description is optional.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAttemptClose}
                aria-label="Close dialog"
                style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--border)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Field 1: Target Role Searchable Combobox */}
            <div style={{ marginBottom: '18px', position: 'relative' }} ref={dropdownRef}>
              <label
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  color: 'var(--text-subtle)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '8px',
                }}
              >
                Target Role <span style={{ color: '#EF4444' }}>*</span>
              </label>

              {/* Combobox Input */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Search size={16} />
                </div>

                <input
                  type="text"
                  value={roleQuery}
                  onChange={(e) => {
                    setRoleQuery(e.target.value)
                    setSelectedRole(e.target.value)
                    if (!isDropdownOpen) setIsDropdownOpen(true)
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Select or type your role (e.g. Full Stack Web Developer)..."
                  style={{
                    width: '100%',
                    padding: '12px 64px 12px 40px',
                    borderRadius: '12px',
                    background: 'var(--surface-soft)',
                    border: isDropdownOpen ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                    color: 'var(--text)',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxShadow: isDropdownOpen ? '0 0 16px var(--primary-glow)' : 'none',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {roleQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setRoleQuery('')
                        setSelectedRole('')
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '2px' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '2px' }}
                  >
                    <ChevronDown size={16} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                </div>
              </div>

              {/* Dropdown Options */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      right: 0,
                      maxHeight: '220px',
                      overflowY: 'auto',
                      background: 'var(--surface)',
                      border: '1px solid var(--border-focus)',
                      borderRadius: '12px',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
                      zIndex: 200,
                      padding: '6px',
                    }}
                  >
                    {POPULAR_ROLE_CHIPS.map((chip, idx) => {
                      const isSelected = roleQuery.toLowerCase().trim() === chip.toLowerCase().trim()
                      return (
                        <div
                          key={idx}
                          onClick={() => handleSelectRole(chip)}
                          style={{
                            padding: '9px 14px',
                            borderRadius: '8px',
                            background: isSelected ? 'var(--primary-dim)' : 'transparent',
                            color: isSelected ? 'var(--primary)' : 'var(--text)',
                            fontSize: '13px',
                            fontWeight: isSelected ? 800 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{chip}</span>
                          {isSelected && <Check size={14} color="var(--primary)" />}
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Popular Role Quick Chips */}
              <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-subtle)', alignSelf: 'center', marginRight: '4px' }}>
                  Popular:
                </span>
                {POPULAR_ROLE_CHIPS.slice(0, 4).map((chip, cIdx) => (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => handleSelectRole(chip)}
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '99px',
                      background: roleQuery === chip ? 'var(--primary-dim)' : 'var(--surface-soft)',
                      border: roleQuery === chip ? '1px solid var(--primary)' : '1px solid var(--border)',
                      color: roleQuery === chip ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 2: Job Description Setup (Toggle: Paste JD vs Skip) */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <label
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    color: 'var(--text-subtle)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Job Description (Optional)
                </label>

                {/* Segmented Mode Selector */}
                <div
                  style={{
                    display: 'flex',
                    background: 'var(--surface-soft)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '2px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setJdMode('paste')}
                    style={{
                      background: jdMode === 'paste' ? 'var(--surface)' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: jdMode === 'paste' ? 800 : 600,
                      color: jdMode === 'paste' ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      boxShadow: jdMode === 'paste' ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    Paste JD
                  </button>
                  <button
                    type="button"
                    onClick={() => setJdMode('skip')}
                    style={{
                      background: jdMode === 'skip' ? 'var(--surface)' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: jdMode === 'skip' ? 800 : 600,
                      color: jdMode === 'skip' ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      boxShadow: jdMode === 'skip' ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    Skip (Use Standard Benchmark)
                  </button>
                </div>
              </div>

              {jdMode === 'paste' ? (
                <div>
                  <textarea
                    rows={6}
                    value={customJDText}
                    onChange={(e) => setCustomJDText(e.target.value)}
                    placeholder="Paste full campus drive Job Description or requirements here...
(e.g., tech stack requirements, required projects, DSA/system design criteria)"
                    style={{
                      width: '100%',
                      minHeight: '140px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'var(--surface-soft)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11.5px', color: 'var(--text-subtle)' }}>
                    <span>
                      {keywordCount > 0 ? (
                        <strong style={{ color: 'var(--primary)' }}>{keywordCount} core tech keywords recognized</strong>
                      ) : (
                        'Paste JD to auto-detect core tech keywords'
                      )}
                    </span>
                    <span>{charCount} characters</span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'var(--surface-soft)',
                    border: '1px solid var(--border)',
                    fontSize: '12.5px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  No problem! DAKSH will use standard Tier-1 placement hiring rubrics for{' '}
                  <strong style={{ color: 'var(--text)' }}>{roleQuery || 'your chosen role'}</strong> to benchmark your resume.
                </div>
              )}
            </div>

            {/* Bottom CV File Indicator Chip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'var(--surface-soft)',
                border: '1px solid var(--border)',
                marginBottom: '20px',
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={15} color="var(--primary)" />
                <span>
                  Attached CV: <strong style={{ color: 'var(--text)' }}>{activeResumeName || 'Resume'}</strong>
                </span>
                {activeResumeSize && <span>({activeResumeSize})</span>}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981' }}>READY FOR AUDIT</span>
            </div>

            {/* Modal Action Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={handleAttemptClose}
                className="btn btn-outline"
                style={{ borderRadius: '99px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer' }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={startScanningExecution}
                disabled={!roleQuery.trim()}
                className="btn-rgb-glow"
                style={{
                  padding: '12px 28px',
                  borderRadius: '99px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: !roleQuery.trim() ? 'not-allowed' : 'pointer',
                  opacity: !roleQuery.trim() ? 0.6 : 1,
                }}
              >
                <Sparkles size={16} />
                <span>{roleQuery.trim() ? 'Scan Now' : 'Select a Role to Scan'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: High-End Scanning Execution Animation (Checklist + Progress Ring) */}
        {phase === 'scanning' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            {/* Header Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-dim)', padding: '4px 14px', borderRadius: '99px', marginBottom: '16px' }}>
              <RefreshCw size={13} color="var(--primary)" className="animate-spin" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.04em' }}>
                AI SKILL GAP SCAN RUNNING
              </span>
            </div>

            <h3
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color: 'var(--text)',
                fontFamily: 'Outfit, sans-serif',
                margin: '0 0 6px',
                letterSpacing: '-0.01em',
              }}
            >
              Auditing against {roleQuery}
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '0 auto 24px', maxWidth: '440px' }}>
              Synthesizing ATS parse tokens, technical competency gaps, and semantic rubric fit...
            </p>

            {/* Circular Progress Ring */}
            <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 28px' }}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle
                  cx="55"
                  cy="55"
                  r="45"
                  stroke="var(--surface-soft)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="55"
                  cy="55"
                  r="45"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  strokeDasharray={283}
                  strokeDashoffset={283 - (283 * scanPercentage) / 100}
                  strokeLinecap="round"
                  fill="none"
                  style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
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
                <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>
                  {scanPercentage}%
                </span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                  COMPLETE
                </span>
              </div>
            </div>

            {/* 4-Step Checklist with Animated Checkmarks */}
            <div style={{ maxWidth: '440px', margin: '0 auto 26px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
              {checklistItems.map((item, idx) => {
                const isStepDone = scanStepIndex > idx
                const isStepCurrent = scanStepIndex === idx

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: isStepDone
                        ? 'rgba(16, 185, 129, 0.08)'
                        : isStepCurrent
                        ? 'var(--primary-dim)'
                        : 'var(--surface-soft)',
                      border: isStepDone
                        ? '1px solid rgba(16, 185, 129, 0.25)'
                        : isStepCurrent
                        ? '1px solid var(--primary)'
                        : '1px solid var(--border)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isStepDone ? '#10B981' : isStepCurrent ? 'var(--primary)' : 'var(--surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: isStepDone || isStepCurrent ? '#FFFFFF' : 'var(--text-subtle)',
                      }}
                    >
                      {isStepDone ? (
                        <Check size={14} strokeWidth={3} />
                      ) : isStepCurrent ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : (
                        <span style={{ fontSize: '10px', fontWeight: 800 }}>{idx + 1}</span>
                      )}
                    </div>

                    <div>
                      <strong
                        style={{
                          fontSize: '13px',
                          color: isStepDone ? 'var(--text)' : isStepCurrent ? 'var(--primary)' : 'var(--text-muted)',
                          display: 'block',
                        }}
                      >
                        {item.title}
                      </strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                        {item.sub}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Cancel Button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleCancelScan}
                className="btn btn-outline"
                style={{ borderRadius: '99px', padding: '8px 22px', fontSize: '12.5px', cursor: 'pointer' }}
              >
                Cancel Scan
              </button>
            </div>
          </div>
        )}

        {/* Discard Confirmation Dialog Overlay */}
        <AnimatePresence>
          {showDiscardConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.82)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                zIndex: 100010,
              }}
            >
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-focus)',
                  borderRadius: '14px',
                  padding: '20px',
                  maxWidth: '380px',
                  textAlign: 'center',
                }}
              >
                <AlertCircle size={32} color="#F59E0B" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 800, color: 'var(--text)' }}>
                  Discard Entered Job Description?
                </h4>
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  You have entered campus drive requirements. Closing will discard your pasted text.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowDiscardConfirm(false)}
                    className="btn btn-outline"
                    style={{ borderRadius: '99px', padding: '8px 16px', fontSize: '12px' }}
                  >
                    Keep Editing
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDiscardConfirm(false)
                      onClose()
                    }}
                    className="btn btn-primary"
                    style={{ borderRadius: '99px', padding: '8px 18px', fontSize: '12px', background: '#EF4444' }}
                  >
                    Discard &amp; Exit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
