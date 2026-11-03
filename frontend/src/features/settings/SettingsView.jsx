import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText,
  RotateCcw,
  ArrowLeft,
  Edit3,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function SettingsView({ profileData = {}, onNavigateToActive, onNavigateToHome }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Load existing profile from localStorage verified through Onboarding
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('daksh-onboarding-data-v4')
      if (saved) {
        const p = JSON.parse(saved)
        const computedName = [p.first_name, p.last_name].filter(Boolean).join(' ') || p.fullName || (user?.email ? user.email.split('@')[0] : 'Candidate')
        return {
          ...p,
          fullName: computedName,
          college: p.college_name || p.college || 'Heritage Institute of Technology',
          degree: p.degree || 'B.Tech / B.E.',
          branch: p.branch || 'Computer Science & Engineering',
          graduationYear: p.graduation_year || p.graduationYear || 'Batch 2026',
          targetRole: p.targeted_role || p.targetRole || 'Full Stack Developer',
          targetCompany: Array.isArray(p.targeted_company_types)
            ? p.targeted_company_types.join(', ').toUpperCase()
            : (p.targetCompany || 'TCS, Infosys, Amazon'),
          phone: p.phone || '',
          resume: p.resume || { name: 'Master_Resume_2026.pdf', size: 1420000 },
        }
      }
    } catch (e) {
      console.warn(e)
    }

    return {
      fullName: user?.email ? user.email.split('@')[0] : 'Engineering Candidate',
      college: profileData.college || 'Heritage Institute of Technology',
      degree: 'B.Tech / B.E.',
      branch: 'Computer Science & Engineering',
      graduationYear: profileData.graduationYear || 'Batch 2026',
      targetRole: profileData.targetRole || 'Full Stack Developer',
      targetCompany: profileData.targetCompany || 'TCS, Infosys, Amazon',
      phone: '',
      resume: profileData.resume || { name: 'Master_Resume_2026.pdf', size: 1420000 },
    }
  })

  const [isResetting, setIsResetting] = useState(false)

  // Navigate to Onboarding in edit mode
  const handleEditInOnboarding = () => {
    navigate('/onboarding?mode=edit')
  }

  const handleClearAssessmentCache = () => {
    if (window.confirm('Reset local assessment cache and start fresh scans?')) {
      sessionStorage.removeItem('daksh-sg-step')
      sessionStorage.removeItem('daksh-sg-max-step')
      sessionStorage.removeItem('daksh-sg-report')
      sessionStorage.removeItem('daksh-sg-answers')
      sessionStorage.removeItem('daksh-arena-questions')
      sessionStorage.removeItem('daksh-arena-phase')
      sessionStorage.removeItem('daksh-arena-q-index')
      setIsResetting(true)
      setTimeout(() => setIsResetting(false), 2000)
    }
  }

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 clamp(12px, 2vw, 24px) 40px' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          {onNavigateToHome && (
            <button
              type="button"
              onClick={onNavigateToHome}
              className="btn btn-outline btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '99px',
                fontSize: '12px',
                marginBottom: '10px',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={13} />
              <span>Back to Dashboard Home</span>
            </button>
          )}
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: 'var(--text)' }}>
            Candidate Profile &amp; Preferences
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
            Sync your academic background, placement targets, and resume verified through Onboarding.
          </p>
        </div>
      </div>

      {/* ─── Profile Upload & Onboarding Verification Card ─── */}
      <div
        className="matte-card"
        style={{
          padding: '28px',
          borderRadius: '20px',
          background: 'var(--surface-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                color: 'var(--on-acc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 700,
                boxShadow: '0 8px 24px -4px rgba(91, 108, 240, 0.4)',
                flexShrink: 0,
              }}
            >
              {profile.fullName?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                  {profile.fullName || 'Candidate Profile'}
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '99px',
                    background: 'var(--success-dim)',
                    color: 'var(--success)',
                    border: '1px solid var(--success)',
                  }}
                >
                  Onboarding Verified
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span>{user?.email || 'Registered Candidate'}</span>
                {profile.phone && <span>• {profile.phone}</span>}
              </p>
            </div>
          </div>

          {/* Edit in Onboarding Button */}
          <button
            type="button"
            onClick={handleEditInOnboarding}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '99px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Edit3 size={15} />
            <span>Edit in Onboarding Flow</span>
          </button>
        </div>

        {/* Highlights Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            padding: '16px',
            borderRadius: '14px',
            background: 'var(--surface-soft)',
            border: '1px solid var(--border)',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
              Institution &amp; Batch
            </span>
            <strong style={{ fontSize: '13.5px', color: 'var(--text)', display: 'block' }}>
              {profile.college}
            </strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {profile.degree} • {profile.graduationYear}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
              Primary Target Role
            </span>
            <strong style={{ fontSize: '13.5px', color: 'var(--accent)', display: 'block' }}>
              {profile.targetRole}
            </strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Specialization: {profile.branch}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
              Target Placement Companies
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '4px' }}>
              {profile.targetCompany.split(',').map((comp, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    padding: '2px 7px',
                    borderRadius: '6px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                >
                  {comp.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Master Resume & Cache Card */}
      <div
        className="matte-card"
        style={{
          padding: '26px',
          borderRadius: '16px',
          background: 'var(--surface-card)',
          border: '1px solid var(--border)',
          marginBottom: '26px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <FileText size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--text)' }}>
              Master Resume &amp; Data Cache
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Attached documents and assessment storage</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: 'var(--surface-soft)', border: '1px solid var(--border)', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text)' }}>
                {profile.resume?.name || 'Master_Resume.pdf'}
              </strong>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Size: ~{Math.round((profile.resume?.size || 1200000) / 1024)} KB • Status: Active Master Resume
              </span>
            </div>
          </div>

          <label
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '99px', fontSize: '12px', cursor: 'pointer', padding: '6px 14px' }}
          >
            <span>Replace File</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const updatedProfile = {
                    ...profile,
                    resume: { name: file.name, size: file.size },
                  }
                  setProfile(updatedProfile)
                  try {
                    const saved = localStorage.getItem('daksh-onboarding-data-v4')
                    const parsed = saved ? JSON.parse(saved) : {}
                    parsed.resume = { name: file.name, size: file.size }
                    localStorage.setItem('daksh-onboarding-data-v4', JSON.stringify(parsed))
                  } catch (err) {
                    console.warn(err)
                  }
                }
              }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <button
            type="button"
            onClick={handleClearAssessmentCache}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--text-muted)', fontSize: '12px', padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={13} />
            <span>{isResetting ? 'Cache Reset!' : 'Reset Assessment Session Cache'}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToActive}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '99px', fontSize: '12px', padding: '6px 14px' }}
          >
            <span>Open Skill Gap Engine</span>
          </button>
        </div>
      </div>
    </div>
  )
}
