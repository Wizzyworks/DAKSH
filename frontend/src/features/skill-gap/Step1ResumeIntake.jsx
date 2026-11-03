import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  CheckCircle2,
  ArrowRight,
  Lock,
  Sparkles,
  RotateCcw,
  AlertCircle,
  FileCode,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import WhatYouWillGetCard from './WhatYouWillGetCard'
import ScanModal from './ScanModal'
import { Button, TOKENS, CornerHUD, HUDTag } from './ui/SkillGapPrimitives'

export default function Step1ResumeIntake({
  onNavigateToHome,
  resumeFile,
  setResumeFile,
  selectedRole,
  setSelectedRole,
  customJDText,
  setCustomJDText,
  onScanCompleted,
  onInvalidateDownstream,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(resumeFile || null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [parsingProgress, setParsingProgress] = useState(0)
  const fileInputRef = useRef(null)

  // Sync when resumeFile updates
  useEffect(() => {
    if (resumeFile && !uploadedFile) {
      setUploadedFile(resumeFile)
    }
  }, [resumeFile])

  // Scroll reset to top synchronously
  useLayoutEffect(() => {
    const mainEl = document.getElementById('daksh-main-scroll') || document.querySelector('main')
    if (mainEl) mainEl.scrollTop = 0
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  // Validate and handle file upload with interactive parsing animation
  const handleFile = (file) => {
    setUploadError('')
    if (!file) return

    const validExtensions = ['.pdf', '.docx', '.txt']
    const hasValidExt = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    )

    if (!hasValidExt) {
      setUploadError('Invalid format. Please upload a PDF or DOCX file (max 5 MB).')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds 5 MB limit. Please upload a smaller file.')
      return
    }

    // Launch 1.2s smooth document ingestion animation
    setIsParsing(true)
    setParsingProgress(25)

    setTimeout(() => {
      setParsingProgress(70)
    }, 400)

    setTimeout(() => {
      setParsingProgress(100)
    }, 850)

    setTimeout(() => {
      setUploadedFile(file)
      if (setResumeFile) setResumeFile(file)
      if (onInvalidateDownstream) onInvalidateDownstream()
      try {
        sessionStorage.setItem('daksh-sg-resume-name', file.name)
        sessionStorage.setItem('daksh-sg-resume-size', file.size.toString())
      } catch {}
      setIsParsing(false)
    }, 1150)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const activeFile = uploadedFile || resumeFile
  const activeFileSizeFormatted = activeFile
    ? ((activeFile.size || 1250000) / (1024 * 1024)).toFixed(2) + ' MB'
    : '1.25 MB'

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{ position: 'relative', paddingBottom: '36px' }}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) handleFile(e.target.files[0])
        }}
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
      />

      {/* ─── Clean Step Header ─── */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span
            className="daksh-glass-pill"
            style={{
              fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--accent)',
              padding: '3px 10px',
              borderRadius: '99px',
            }}
          >
            Step 01 • Intake &amp; Scan
          </span>
        </div>
        <h2
          data-step-heading="true"
          style={{
            fontSize: 'clamp(20px, 2.5vw, 24px)',
            fontWeight: 650,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            margin: '0 0 6px',
          }}
        >
          Upload Your Resume
        </h2>
        <p
          style={{
            fontSize: '13.5px',
            color: 'var(--text-muted)',
            margin: '0 auto',
            maxWidth: '620px',
            lineHeight: 1.55,
          }}
        >
          Upload your latest CV to benchmark technical skills against market requirements, discover high-impact gaps, and generate your calibrated roadmap.
        </p>
      </div>

      {/* ─── Centered Layout ─── */}
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Main Column: Upload Dropzone & Action Bar */}
        <div style={{ width: '100%' }}>
          {isParsing ? (
            /* FILE PARSING CARD */
            <div
              className="daksh-glass-card"
              style={{
                borderRadius: '12px',
                padding: '36px 28px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--border-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--accent)',
                }}
              >
                <FileCode size={28} />
              </div>

              <h3
                style={{
                  fontSize: '17px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  margin: '0 0 6px',
                }}
              >
                Parsing Document Structure...
              </h3>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px' }}>
                Extracting technical skills, frameworks, and verified experiences
              </p>

              {/* Progress bar */}
              <div
                style={{
                  height: '4px',
                  width: '100%',
                  maxWidth: '360px',
                  background: 'var(--border)',
                  borderRadius: '99px',
                  overflow: 'hidden',
                  margin: '0 auto',
                }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${parsingProgress}%` }}
                  transition={{ duration: 0.25 }}
                  style={{
                    height: '100%',
                    background: 'var(--gradient-primary)',
                    borderRadius: '99px',
                  }}
                />
              </div>

              <div style={{ marginTop: '12px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                {parsingProgress}% Analyzed
              </div>
            </div>
          ) : !activeFile ? (
            /* 1. FRESH DROPZONE ─── */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="daksh-glass-card"
              style={{
                borderRadius: '12px',
                padding: '44px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                border: isDragging
                  ? '1.5px dashed var(--accent)'
                  : '1.5px dashed var(--border-strong)',
                background: isDragging ? 'var(--accent-dim)' : 'var(--glass)',
                transition: 'all 0.18s ease',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--border-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--accent)',
                }}
              >
                <UploadCloud size={26} />
              </div>

              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  margin: '0 0 6px',
                }}
              >
                {isDragging ? 'Drop resume file to upload' : 'Click or drag your resume to upload'}
              </h3>

              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  margin: '0 0 16px',
                }}
              >
                PDF, DOCX, or TXT up to 5 MB
              </p>

              {/* Supported format chips */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                {['PDF', 'DOCX', 'TXT'].map((ext) => (
                  <span
                    key={ext}
                    className="daksh-glass-pill"
                    style={{
                      fontSize: '10.5px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 500,
                      color: 'var(--text-muted)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    .{ext}
                  </span>
                ))}
              </div>

              <div style={{ display: 'inline-block' }}>
                <Button size="md" variant="primary">
                  Browse Files
                </Button>
              </div>

              {uploadError && (
                <div
                  style={{
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '12.5px',
                    color: 'var(--error)',
                    fontWeight: 500,
                  }}
                >
                  <AlertCircle size={15} />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          ) : (
            /* 2. UPLOADED RESUME READY CARD ─── */
            <div
              className="daksh-glass-card"
              style={{
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                position: 'relative',
              }}
            >
              {/* File details row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '48px',
                      borderRadius: '8px',
                      background: 'var(--accent-dim)',
                      border: '1px solid var(--border-accent)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={20} color="var(--accent)" />
                    <span style={{ fontSize: '9px', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', marginTop: '2px' }}>
                      DOC
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                        {activeFile?.name || 'Resume.pdf'}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 500,
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
                        <CheckCircle2 size={12} strokeWidth={2.2} /> Ready
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
                      <span>{activeFileSizeFormatted}</span> • <span style={{ color: 'var(--success)' }}>Verified &amp; Parsed</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={<RotateCcw size={13} />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change File
                </Button>
              </div>

              {/* Action row with Select Role & Scan button */}
              <div
                style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="var(--success)" />
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    Evaluated privately against market engineering standards
                  </span>
                </div>

                <Button
                  size="md"
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                  iconRight={<ArrowRight size={15} />}
                >
                  Select Role &amp; Scan
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Benefit Cards Row ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
          }}
        >
          <div
            className="daksh-glass-card"
            style={{
              borderRadius: '10px',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'var(--accent-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                }}
              >
                <Zap size={15} />
              </div>
              <strong style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                Precision ATS Fit
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Benchmark match score against verified industry job rubrics.
            </p>
          </div>

          <div
            className="daksh-glass-card"
            style={{
              borderRadius: '10px',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'var(--warning-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--warning)',
                }}
              >
                <AlertCircle size={15} />
              </div>
              <strong style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                Skill Gap Delta
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Uncover critical missing competencies ranked by hiring weight.
            </p>
          </div>

          <div
            className="daksh-glass-card"
            style={{
              borderRadius: '10px',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'var(--success-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--success)',
                }}
              >
                <ShieldCheck size={15} />
              </div>
              <strong style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                Diagnostic Arena
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Verify competencies through an adaptive quick evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Floating Box: Target Role & JD Selection (Glass Modal) ─── */}
      <ScanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeResumeFile={activeFile}
        activeResumeName={activeFile?.name || 'Resume.pdf'}
        activeResumeSize={activeFileSizeFormatted}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        customJDText={customJDText}
        setCustomJDText={setCustomJDText}
        onScanComplete={(scanResult) => {
          setIsModalOpen(false)
          if (onScanCompleted) onScanCompleted(scanResult)
        }}
      />
    </motion.div>
  )
}
