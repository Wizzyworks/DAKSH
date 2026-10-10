import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  FileCheck,
  Eye,
  RefreshCw,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  File,
  RotateCcw,
} from 'lucide-react'

export default function ResumeCard({
  profileData = {},
  customResumeFile,
  setCustomResumeFile,
  setResumeSource,
  onReplaceSuccess,
}) {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const hasOnboardingResume = !!profileData.resume?.name
  const isCustomActive = !!customResumeFile

  // Active resume properties
  const activeName = customResumeFile
    ? customResumeFile.name
    : hasOnboardingResume
    ? profileData.resume.name
    : null

  const activeSize = customResumeFile
    ? (customResumeFile.size / (1024 * 1024)).toFixed(2) + ' MB'
    : hasOnboardingResume
    ? profileData.resume.size
      ? (profileData.resume.size / (1024 * 1024)).toFixed(2) + ' MB'
      : '1.24 MB' // // TODO: wire to API - fallback display size
    : null

  const sourceTag = isCustomActive ? 'Custom Upload' : 'From Onboarding'

  // Validate and handle file upload
  const validateAndUploadFile = (file) => {
    setUploadError('')
    if (!file) return

    // Validate format
    const validExtensions = ['.pdf', '.docx', '.txt']
    const hasValidExt = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    )

    if (!hasValidExt) {
      setUploadError('Invalid format. Please upload a PDF or DOCX document.')
      return
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setUploadError('File is too large. Maximum supported size is 5 MB.')
      return
    }

    // Run clean progress simulation
    setIsUploading(true)
    setUploadProgress(25)

    setTimeout(() => {
      setUploadProgress(70)
    }, 280)

    setTimeout(() => {
      setUploadProgress(100)
    }, 550)

    setTimeout(() => {
      setCustomResumeFile(file)
      setResumeSource('custom')
      setIsUploading(false)
      setUploadProgress(0)
      if (onReplaceSuccess) onReplaceSuccess(file)
    }, 950)
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
      validateAndUploadFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUploadFile(e.target.files[0])
    }
  }

  const handleRevertOnboarding = () => {
    setCustomResumeFile(null)
    setResumeSource(hasOnboardingResume ? 'existing' : 'custom')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
      />

      {/* Main Hero Resume Card (16px radius, soft shadow) */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
        }}
      >
        {activeName ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {/* Left: Thumbnail & File Metadata */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '240px' }}>
              {/* PDF Preview Thumbnail Icon */}
              <div
                style={{
                  width: '52px',
                  height: '58px',
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.04))',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                }}
              >
                <FileText size={24} color="#EF4444" />
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 900,
                    color: '#EF4444',
                    letterSpacing: '0.04em',
                    marginTop: '2px',
                  }}
                >
                  PDF
                </span>
              </div>

              {/* Title, Size & Tags */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '15px', color: 'var(--text)', wordBreak: 'break-all' }}>
                    {activeName}
                  </strong>

                  {/* Ready Status Badge */}
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: '#10B981',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '99px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCircle2 size={11} /> READY
                  </span>

                  {/* Source Tag */}
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      background: 'var(--surface-soft)',
                      padding: '2px 8px',
                      borderRadius: '99px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {sourceTag}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--text-subtle)' }}>
                  <span>{activeSize}</span>
                  <span>•</span>
                  <span>ATS Token Parser Verified</span>
                  {isCustomActive && hasOnboardingResume && (
                    <>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={handleRevertOnboarding}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <RotateCcw size={11} /> Revert to Onboarding Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Preview & Replace Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="btn btn-outline"
                style={{
                  padding: '8px 16px',
                  borderRadius: '99px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Eye size={14} />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="btn btn-outline"
                style={{
                  padding: '8px 16px',
                  borderRadius: '99px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={14} />
                <span>Replace</span>
              </button>
            </div>
          </div>
        ) : (
          /* Empty State: No CV attached yet */
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={22} color="#F59E0B" />
              <div>
                <strong style={{ fontSize: '14px', color: '#D97706', display: 'block' }}>
                  No resume found from onboarding
                </strong>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Upload your CV below to begin your Career Readiness &amp; Skill Gap audit.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="btn btn-primary"
              style={{
                borderRadius: '99px',
                padding: '8px 18px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Attach CV
            </button>
          </div>
        )}
      </div>

      {/* Slim Row: "Replace with a different CV" (Drag and drop + browse) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        style={{
          border: isDragging
            ? '1.5px solid var(--primary)'
            : '1px dashed var(--border-focus)',
          borderRadius: '12px',
          padding: '12px 18px',
          background: isDragging
            ? 'var(--primary-dim)'
            : 'var(--surface-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isDragging ? '0 0 20px var(--primary-glow)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <UploadCloud size={18} color="var(--primary)" />
          <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>
            {isDragging
              ? 'Drop to replace current CV'
              : activeName
              ? 'Replace with a different CV (Drag & drop or Browse)'
              : 'Upload your CV file (Drag & drop or Browse)'}
          </span>
        </div>

        <span
          style={{
            fontSize: '11.5px',
            color: 'var(--text-subtle)',
            background: 'var(--surface)',
            padding: '4px 10px',
            borderRadius: '99px',
            border: '1px solid var(--border)',
          }}
        >
          PDF, DOCX · Max 5MB
        </span>
      </div>

      {/* Upload Progress Bar (when replacing) */}
      {isUploading && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-focus)',
            borderRadius: '12px',
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
              Uploading and analyzing resume ({uploadProgress}%)...
            </span>
            <RefreshCw size={14} color="var(--primary)" className="animate-spin" />
          </div>
          <div style={{ height: '4px', background: 'var(--surface-soft)', borderRadius: '99px', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.2 }}
              style={{ height: '100%', background: 'var(--gradient-primary)', borderRadius: '99px' }}
            />
          </div>
        </div>
      )}

      {/* Inline Upload Error Notice */}
      {uploadError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            fontSize: '12.5px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={15} />
            <span>{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadError('')}
            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0 }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Quick Preview Modal Dialog */}
      <AnimatePresence>
        {showPreviewModal && (
          <div
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreviewModal(false)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '520px',
                background: 'var(--surface)',
                border: '1px solid var(--border-focus)',
                borderRadius: '16px',
                padding: '24px',
                zIndex: 100000,
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={20} color="#EF4444" />
                  <strong style={{ fontSize: '16px', color: 'var(--text)' }}>
                    Resume Document Preview
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  style={{
                    background: 'var(--surface-soft)',
                    border: '1px solid var(--border)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--border)',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <FileCheck size={24} color="#10B981" />
                  <div>
                    <strong style={{ fontSize: '14px', color: 'var(--text)', display: 'block' }}>
                      {activeName}
                    </strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Size: {activeSize} • Status: Ready for Scan
                    </span>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  This document contains your verified academic milestones, project links, and technical competencies linked for AI semantic matching.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="btn btn-primary"
                  style={{ borderRadius: '99px', padding: '9px 20px', fontSize: '13px', cursor: 'pointer' }}
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
