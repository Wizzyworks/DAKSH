import { motion } from 'framer-motion'
import { FileCheck, UploadCloud, CheckCircle, ArrowRight } from 'lucide-react'

export default function Step1ResumeIntake({
  profileData,
  resumeSource,
  setResumeSource,
  customResumeFile,
  setCustomResumeFile,
  onNext,
}) {
  const onboardingRole = profileData.targeted_role || 'Full Stack Engineer (SDE-1)'

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
          Step 1: Candidate Resume Baseline
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Confirm your active resume or upload an updated version to initialize the competency scanner.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        {/* Option A: Existing Onboarding Resume */}
        <div
          onClick={() => setResumeSource('existing')}
          style={{
            background: resumeSource === 'existing' ? 'rgba(99, 102, 241, 0.08)' : 'var(--surface-glass)',
            border: resumeSource === 'existing' ? '2px solid var(--primary)' : '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileCheck size={20} color="#FFFFFF" />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Active Profile Resume</h4>
                <span style={{ fontSize: '11.5px', color: 'var(--text-subtle)' }}>From Onboarding Baseline</span>
              </div>
            </div>

            {resumeSource === 'existing' && <CheckCircle size={20} color="var(--primary)" />}
          </div>

          <div
            style={{
              background: 'var(--surface-soft)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              marginBottom: '14px',
            }}
          >
            <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 2px', color: 'var(--text)' }}>
              {profileData.resume?.name || 'Candidate_Resume_Master.pdf'}
            </p>
            <p style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, margin: 0 }}>
              Verified Candidate Baseline Available
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontSize: '11px', background: 'var(--surface-soft)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              Target: {onboardingRole}
            </span>
            <span style={{ fontSize: '11px', background: 'var(--surface-soft)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              Degree: {profileData.degree || 'B.Tech'} ({profileData.branch || 'CSE'})
            </span>
          </div>
        </div>

        {/* Option B: Upload New / Updated CV */}
        <div
          onClick={() => setResumeSource('custom')}
          style={{
            background: resumeSource === 'custom' ? 'rgba(99, 102, 241, 0.08)' : 'var(--surface-glass)',
            border: resumeSource === 'custom' ? '2px solid var(--primary)' : '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UploadCloud size={20} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Upload Updated CV</h4>
                <span style={{ fontSize: '11.5px', color: 'var(--text-subtle)' }}>PDF, DOCX format (Max 5MB)</span>
              </div>
            </div>

            {resumeSource === 'custom' && <CheckCircle size={20} color="var(--primary)" />}
          </div>

          <div
            style={{
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center',
              background: 'var(--surface-soft)',
              marginBottom: '14px',
            }}
            onClick={(e) => {
              e.stopPropagation()
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = '.pdf,.docx,.txt'
              input.onchange = (evt) => {
                const file = evt.target.files[0]
                if (file) {
                  setCustomResumeFile(file)
                  setResumeSource('custom')
                }
              }
              input.click()
            }}
          >
            <p style={{ fontSize: '12.5px', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
              {customResumeFile ? customResumeFile.name : 'Click or Drag New CV Here'}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-subtle)', margin: '2px 0 0' }}>
              {customResumeFile ? 'Ready for multi-signal extraction' : 'Browse local files'}
            </p>
          </div>

          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0 }}>
            Upload your latest resume if you added new projects, internships, or certifications.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onNext}
          className="btn btn-primary"
          style={{
            padding: '12px 28px',
            borderRadius: '99px',
            fontSize: '14px',
            fontWeight: 800,
            gap: '8px',
            boxShadow: '0 4px 16px var(--primary-glow)',
            cursor: 'pointer',
          }}
        >
          <span>Continue to Step 2: Target Benchmark</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  )
}
