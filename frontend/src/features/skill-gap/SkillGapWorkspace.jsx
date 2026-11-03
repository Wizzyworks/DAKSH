import { useState, useEffect, useLayoutEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Stepper from './Stepper'
import Step1ResumeIntake from './Step1ResumeIntake'
import Step2GapReport from './Step2GapReport'
import Step3DiagnosticArena from './Step3DiagnosticArena'
import Step4CalibratedRoadmap from './Step4CalibratedRoadmap'
import { PRESET_ROLES } from './skillGapData'
import { TOKENS, HUDTag } from './ui/SkillGapPrimitives'

export default function SkillGapWorkspace({ profileData = {}, onNavigateToRoadmap, onNavigateToHome }) {
  const hasOnboardingResume = !!profileData.resume?.name

  // ─── Fresh State on Load & Refresh (Always start at Step 1, role empty) ─────
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = sessionStorage.getItem('daksh-sg-step')
      const parsed = parseInt(saved, 10)
      return parsed >= 1 && parsed <= 4 ? parsed : 1
    } catch {
      return 1
    }
  })

  // Synchronously reset scroll container to top on every step transition
  useLayoutEffect(() => {
    const mainEl = document.getElementById('daksh-main-scroll') || document.querySelector('main')
    if (mainEl) {
      mainEl.scrollTop = 0
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (document.documentElement) document.documentElement.scrollTop = 0
    if (document.body) document.body.scrollTop = 0

    // Shift focus to step heading for a11y
    const heading = document.querySelector('[data-step-heading="true"], h2')
    if (heading && typeof heading.focus === 'function') {
      heading.focus()
    }
  }, [currentStep])


  const [maxUnlockedStep, setMaxUnlockedStep] = useState(() => {
    try {
      const saved = sessionStorage.getItem('daksh-sg-max-step')
      const parsed = parseInt(saved, 10)
      return parsed >= 1 && parsed <= 4 ? parsed : 1
    } catch {
      return 1
    }
  })

  // Target Role & Custom JD State (starts empty by default)
  const [selectedRole, setSelectedRole] = useState(() => {
    try {
      return sessionStorage.getItem('daksh-sg-role') || ''
    } catch {
      return ''
    }
  })

  const [customJDText, setCustomJDText] = useState(() => {
    try {
      return sessionStorage.getItem('daksh-sg-jd') || ''
    } catch {
      return ''
    }
  })

  // Direct Skill Gap Resume File State
  const [resumeFile, setResumeFile] = useState(() => {
    try {
      const savedName = sessionStorage.getItem('daksh-sg-resume-name')
      if (savedName) {
        return {
          name: savedName,
          size: parseInt(sessionStorage.getItem('daksh-sg-resume-size') || '1250000', 10),
        }
      }
      return null
    } catch {
      return null
    }
  })

  // Real Scan Benchmark Report
  const [scanReport, setScanReport] = useState(() => {
    try {
      const saved = sessionStorage.getItem('daksh-sg-report')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Adaptive Diagnostic Answers
  const [arenaAnswers, setArenaAnswers] = useState(() => {
    try {
      const saved = sessionStorage.getItem('daksh-sg-answers')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Sync to SessionStorage
  useEffect(() => {
    sessionStorage.setItem('daksh-sg-step', currentStep.toString())
    sessionStorage.setItem('daksh-sg-max-step', maxUnlockedStep.toString())
    if (selectedRole) sessionStorage.setItem('daksh-sg-role', selectedRole)
    if (customJDText) sessionStorage.setItem('daksh-sg-jd', customJDText)
    if (scanReport) sessionStorage.setItem('daksh-sg-report', JSON.stringify(scanReport))
    if (arenaAnswers) sessionStorage.setItem('daksh-sg-answers', JSON.stringify(arenaAnswers))
  }, [currentStep, maxUnlockedStep, selectedRole, customJDText, scanReport, arenaAnswers])

  // Invalidate downstream state when resume changes
  const handleInvalidateResume = () => {
    setScanReport(null)
    setArenaAnswers({})
    setMaxUnlockedStep(1)
    setCurrentStep(1)
    sessionStorage.removeItem('daksh-sg-report')
    sessionStorage.removeItem('daksh-sg-answers')
    sessionStorage.removeItem('daksh-arena-questions')
    sessionStorage.removeItem('daksh-arena-phase')
    sessionStorage.removeItem('daksh-arena-q-index')
  }

  // Active Role Configuration
  const activeRoleConfig =
    PRESET_ROLES.find(
      (r) =>
        r.title.toLowerCase() === (selectedRole || '').trim().toLowerCase() ||
        r.id === selectedRole
    ) || {
      id: 'custom-role',
      title: selectedRole?.trim() || 'Software Engineer',
      description: `Target rubric for ${selectedRole || 'Software Engineering'}.`,
      coreSkills: ['Core Problem Solving', 'Web Architecture', 'Engineering Fundamentals'],
    }

  // Derive gap skills list for Step 3 Quick Check
  const detectedGapSkills = scanReport?.gap_items?.length > 0
    ? scanReport.gap_items.map((item) => item.skill_name)
    : ['Redis', 'Docker', 'PostgreSQL', 'JavaScript', 'REST APIs']

  const baseMatch = scanReport?.overall_match_score || 76

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(12px, 2vw, 24px)' }}>
      {/* ─── Premium Workspace Header ─── */}
      <div style={{ marginBottom: '32px', position: 'relative' }}>
        {/* Top row: workspace badge + progress pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="daksh-glass-pill"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: '99px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                letterSpacing: '0.01em',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
              Skill Intelligence
            </span>
          </div>

          {/* Minimal progress indicator */}
          <div
            className="daksh-glass-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '99px',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--text-muted)',
            }}
          >
            <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
              {Math.round(((currentStep - 1) / 3) * 100)}%
            </span>
            <span>completed</span>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(24px, 3vw, 32px)',
            fontWeight: 650,
            letterSpacing: '-0.025em',
            color: 'var(--text)',
            margin: '0 0 8px',
            lineHeight: 1.2,
          }}
        >
          Career Readiness &amp;{' '}
          <span
            style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Skill Gap Analysis
          </span>
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            margin: '0 0 16px',
            maxWidth: '640px',
            lineHeight: 1.6,
          }}
        >
          Benchmark your profile against market standards, discover high-impact gaps, and calibrate your personalized roadmap.
        </p>

        {/* Status badges row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { label: 'Role Benchmarks', dot: 'var(--accent)' },
            { label: 'Adaptive Evaluation', dot: 'var(--success)' },
            { label: 'Encrypted & Private', dot: 'var(--text-muted)' },
          ].map((item) => (
            <span
              key={item.label}
              className="daksh-glass-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11.5px',
                color: 'var(--text-muted)',
                padding: '3px 10px',
                borderRadius: '99px',
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: item.dot }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Redesigned Stepper ─── */}
      <Stepper
        currentStep={currentStep}
        maxUnlockedStep={maxUnlockedStep}
        onSelectStep={(stepNum) => setCurrentStep(stepNum)}
      />

      {/* ─── Dynamic Step Views ─── */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <Step1ResumeIntake
            key="step-1"
            onNavigateToHome={onNavigateToHome}
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            customJDText={customJDText}
            setCustomJDText={setCustomJDText}
            activeRoleConfig={activeRoleConfig}
            onInvalidateDownstream={handleInvalidateResume}
            onScanCompleted={(scanResult) => {
              if (scanResult?.role) setSelectedRole(scanResult.role)
              if (scanResult?.jd) setCustomJDText(scanResult.jd)
              if (scanResult?.report) setScanReport(scanResult.report)

              // Clear past assessment answers for fresh scan
              setArenaAnswers({})
              sessionStorage.removeItem('daksh-sg-answers')
              sessionStorage.removeItem('daksh-arena-questions')
              sessionStorage.removeItem('daksh-arena-phase')
              sessionStorage.removeItem('daksh-arena-q-index')

              setMaxUnlockedStep((prev) => Math.max(prev, 2))
              setCurrentStep(2)
            }}
          />
        )}

        {currentStep === 2 && (
          <Step2GapReport
            key="step-2"
            scanReport={scanReport}
            baseMatch={baseMatch}
            activeRoleConfig={activeRoleConfig}
            customJDText={customJDText}
            onBack={() => setCurrentStep(1)}
            onNext={() => {
              setMaxUnlockedStep((prev) => Math.max(prev, 3))
              setCurrentStep(3)
            }}
            onRescan={() => {
              setCurrentStep(1)
            }}
          />
        )}

        {currentStep === 3 && (
          <Step3DiagnosticArena
            key="step-3"
            gapSkills={detectedGapSkills}
            arenaAnswers={arenaAnswers}
            setArenaAnswers={setArenaAnswers}
            onBack={() => setCurrentStep(2)}
            onCompleteCalibration={() => {
              setMaxUnlockedStep((prev) => Math.max(prev, 4))
              setCurrentStep(4)
            }}
          />
        )}

        {currentStep === 4 && (
          <Step4CalibratedRoadmap
            key="step-4"
            onBack={() => setCurrentStep(3)}
            onBackToReport={() => setCurrentStep(2)}
            activeRoleConfig={activeRoleConfig}
            baseMatch={baseMatch}
            arenaAnswers={arenaAnswers}
            onNavigateToRoadmap={onNavigateToRoadmap}
            onRetakeCheck={() => {
              sessionStorage.setItem('daksh-arena-phase', 'active')
              sessionStorage.setItem('daksh-arena-q-index', '0')
              setCurrentStep(3)
            }}
            onRescan={() => {
              setCurrentStep(1)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
