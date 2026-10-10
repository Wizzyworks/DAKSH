import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Stepper from './Stepper'
import Step1ResumeIntake from './Step1ResumeIntake'
import Step3GapReport from './Step3GapReport'
import Step4DiagnosticArena from './Step4DiagnosticArena'
import Step5CalibratedRoadmap from './Step5CalibratedRoadmap'
import { PRESET_ROLES } from './skillGapData'

export default function SkillGapWorkspace({ profileData = {}, onNavigateToRoadmap }) {
  const hasOnboardingResume = !!profileData.resume?.name

  // Wizard Step Navigation State (1 to 4)
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Resume Intake State
  const [resumeSource, setResumeSource] = useState(hasOnboardingResume ? 'existing' : 'custom')
  const [customResumeFile, setCustomResumeFile] = useState(null)

  // Target Benchmark & JD State
  const [selectedRole, setSelectedRole] = useState('')
  const [customJDText, setCustomJDText] = useState('')

  // Step 3 (Diagnostic Arena): Adaptive Diagnostic Answers
  const [arenaAnswers, setArenaAnswers] = useState({})

  // Determine active role config
  const activeRoleConfig =
    PRESET_ROLES.find(
      (r) => r.id === selectedRole || r.title.toLowerCase() === (selectedRole || '').trim().toLowerCase()
    ) || (selectedRole && selectedRole.trim()
      ? {
          id: 'custom-role',
          title: selectedRole.trim(),
          description: `Targeted rubric for ${selectedRole.trim()}.`,
          coreSkills: ['Core Problem Solving', 'Web Architecture', 'Engineering Fundamentals'],
        }
      : {
          id: 'unselected',
          title: '',
          description: '',
          coreSkills: [],
        })

  // Calibration score bonus calculation
  const correctAnswersCount = Object.values(arenaAnswers).filter((ans) => ans?.isCorrect).length
  const verifiedBonusScore = correctAnswersCount * 3 // +3% boost per verified question

  const hasResume = !!customResumeFile || hasOnboardingResume
  const baseMatch = hasResume ? 76 : 0
  const finalCalibratedScore = Math.min(98, baseMatch + verifiedBonusScore)

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 clamp(12px, 2vw, 24px)' }}>
      {/* ─── Top Studio Banner ─── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--primary)',
              background: 'var(--primary-dim)',
              padding: '4px 12px',
              borderRadius: '99px',
              border: '1px solid var(--border)',
              letterSpacing: '0.04em',
            }}
          >
            ACTIVE ENGINE: MODULE 1
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
            Placement Readiness &amp; Skill Gap Studio
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(24px, 3.4vw, 34px)',
            fontWeight: 900,
            fontFamily: 'Outfit, sans-serif',
            color: 'var(--text)',
            margin: '0 0 8px',
            letterSpacing: '-0.015em',
          }}
        >
          Career Readiness &amp; Skill Gap Studio
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-muted)',
            margin: 0,
            maxWidth: '780px',
            lineHeight: 1.6,
          }}
        >
          A 4-step intelligent workflow to benchmark your profile, discover missing skills, verify hands-on knowledge in a 5-minute check, and build your custom roadmap.
        </p>
      </div>

      {/* ─── Modular 4-Step Stepper Component ─── */}
      <Stepper
        currentStep={currentStep}
        onSelectStep={(stepNum) => setCurrentStep(stepNum)}
      />

      {/* ─── Dynamic Step View Rendering ─── */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <Step1ResumeIntake
            key="step-1"
            profileData={profileData}
            resumeSource={resumeSource}
            setResumeSource={setResumeSource}
            customResumeFile={customResumeFile}
            setCustomResumeFile={setCustomResumeFile}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            customJDText={customJDText}
            setCustomJDText={setCustomJDText}
            activeRoleConfig={activeRoleConfig}
            onScanCompleted={(scanResult) => {
              if (scanResult?.role) setSelectedRole(scanResult.role)
              if (scanResult?.jd) setCustomJDText(scanResult.jd)
              setCurrentStep(2) // Advance to Step 2: ATS Result & Gap Report
            }}
          />
        )}

        {currentStep === 2 && (
          <Step3GapReport
            key="step-2"
            baseMatch={baseMatch}
            activeRoleConfig={activeRoleConfig}
            customJDText={customJDText}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
            onRescan={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step4DiagnosticArena
            key="step-3"
            arenaAnswers={arenaAnswers}
            setArenaAnswers={setArenaAnswers}
            onBack={() => setCurrentStep(2)}
            onCompleteCalibration={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && (
          <Step5CalibratedRoadmap
            key="step-4"
            activeRoleConfig={activeRoleConfig}
            baseMatch={baseMatch}
            verifiedBonusScore={verifiedBonusScore}
            finalCalibratedScore={finalCalibratedScore}
            onNavigateToRoadmap={onNavigateToRoadmap}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
