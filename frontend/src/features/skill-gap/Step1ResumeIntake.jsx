import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserCheck,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Lock,
} from 'lucide-react'
import ResumeCard from './ResumeCard'
import WhatYouWillGetCard from './WhatYouWillGetCard'
import ScanModal from './ScanModal'

export default function Step1ResumeIntake({
  profileData = {},
  resumeSource,
  setResumeSource,
  customResumeFile,
  setCustomResumeFile,
  selectedRole,
  setSelectedRole,
  customJDText,
  setCustomJDText,
  activeRoleConfig,
  onScanCompleted,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const hasOnboardingResume = !!profileData.resume?.name
  const hasActiveResume = !!customResumeFile || hasOnboardingResume

  const candidateName = profileData.full_name || profileData.name || 'Candidate Profile'
  const candidateDegree = profileData.degree || 'B.Tech'
  const candidateBranch = profileData.branch || 'Computer Science'
  const candidateBatch = profileData.graduation_year || 'Batch 2026'
  const onboardingRole = profileData.targeted_role || 'Web & Software Engineering'

  const activeResumeName = customResumeFile
    ? customResumeFile.name
    : hasOnboardingResume
    ? profileData.resume.name
    : null

  const activeResumeSize = customResumeFile
    ? (customResumeFile.size / (1024 * 1024)).toFixed(2) + ' MB'
    : hasOnboardingResume && profileData.resume?.size
    ? (profileData.resume.size / (1024 * 1024)).toFixed(2) + ' MB'
    : '1.24 MB' // // TODO: wire to API - default fallback size

  const handleStartScanModal = () => {
    if (hasActiveResume) {
      setIsModalOpen(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      style={{ position: 'relative' }}
    >
      {/* ─── Ready-to-Scan Screen Header ─── */}
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: 'clamp(20px, 2.6vw, 26px)',
            fontWeight: 900,
            fontFamily: 'Outfit, sans-serif',
            color: 'var(--text)',
            margin: '0 0 6px',
            letterSpacing: '-0.015em',
          }}
        >
          Step 1: Ready to Scan Your Resume
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-muted)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Your resume from onboarding has been loaded. Confirm your document and launch the audit to benchmark ATS fit.
        </p>
      </div>

      {/* ─── Compact Candidate Profile Bar ─── */}
      <div
        style={{
          background: 'var(--surface-soft)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px var(--primary-glow)',
              flexShrink: 0,
            }}
          >
            <UserCheck size={20} color="#FFFFFF" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <strong style={{ fontSize: '15px', color: 'var(--text)' }}>
                {candidateName}
              </strong>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  background: 'var(--primary-dim)',
                  padding: '2px 8px',
                  borderRadius: '99px',
                }}
              >
                CANDIDATE PROFILE
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '12.5px',
                color: 'var(--text-subtle)',
                marginTop: '3px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <GraduationCap size={13} color="#8B5CF6" />
                {candidateDegree} ({candidateBranch})
              </span>
              <span>•</span>
              <span>{candidateBatch}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} color="var(--primary)" />
                Track: {onboardingRole}
              </span>
            </div>
          </div>
        </div>

        {/* Hint Pill: Target role chosen in next step */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            background: 'var(--surface)',
            padding: '6px 12px',
            borderRadius: '99px',
            border: '1px solid var(--border)',
          }}
        >
          <HelpCircle size={14} color="var(--primary)" />
          <span>You&apos;ll choose your target role in the next step</span>
        </div>
      </div>

      {/* ─── Desktop 2-Column Layout (8px Grid & 16px Radius) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start',
          marginBottom: '36px',
        }}
      >
        {/* Left Column: Hero Resume Card & Slim Replace Row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResumeCard
            profileData={profileData}
            customResumeFile={customResumeFile}
            setCustomResumeFile={setCustomResumeFile}
            setResumeSource={setResumeSource}
            onReplaceSuccess={() => {
              // Successfully replaced CV
            }}
          />
        </div>

        {/* Right Column: "What You'll Get" Deliverables Card */}
        <div>
          <WhatYouWillGetCard />
        </div>
      </div>

      {/* ─── Sticky Bottom Action Bar ─── */}
      <div
        style={{
          position: 'sticky',
          bottom: '20px',
          zIndex: 100,
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-focus)',
          borderRadius: '16px',
          padding: '16px 24px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <strong style={{ fontSize: '15px', color: 'var(--text)', display: 'block' }}>
            Ready to Discover Missing Skills?
          </strong>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            ~30 sec · Your CV stays private and is benchmarked in memory
          </span>
        </div>

        <motion.button
          whileHover={hasActiveResume ? { scale: 1.04, y: -2 } : {}}
          whileTap={hasActiveResume ? { scale: 0.98 } : {}}
          onClick={handleStartScanModal}
          disabled={!hasActiveResume}
          className="btn-rgb-glow"
          type="button"
          style={{
            padding: '13px 32px',
            fontSize: '14px',
            fontWeight: 800,
            cursor: !hasActiveResume ? 'not-allowed' : 'pointer',
            opacity: !hasActiveResume ? 0.6 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Sparkles size={16} />
          <span>Start Skill Gap Scan</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>

      {/* ─── Hero Scan Modal (Phase 1 & Phase 2) ─── */}
      <ScanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeResumeName={activeResumeName}
        activeResumeSize={activeResumeSize}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        customJDText={customJDText}
        setCustomJDText={setCustomJDText}
        onScanComplete={(scanResult) => {
          setIsModalOpen(false)
          onScanCompleted(scanResult)
        }}
      />
    </motion.div>
  )
}
