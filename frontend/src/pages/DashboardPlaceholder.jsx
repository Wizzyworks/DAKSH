import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, BrainCircuit, CheckCircle2, RefreshCw, ShieldCheck, Layers } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function DashboardPlaceholder() {
  const { user } = useAuth()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', backgroundImage: 'var(--bg-gradient)' }}>
      <Navbar />

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '110px 24px 70px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="gradient-border-card"
          style={{
            maxWidth: '560px',
            width: '100%',
            textAlign: 'center',
            padding: '44px 32px',
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(24px)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          {/* Glowing Icon */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 20px var(--primary-glow)',
            }}
          >
            <BrainCircuit size={36} color="#FFFFFF" />
          </div>

          {/* Status Badge */}
          <div style={{ display: 'inline-block', marginBottom: '14px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '99px',
                background: 'var(--primary-dim)',
                color: 'var(--primary)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
              }}
            >
              PHASE 1 COMPLETE • CANDIDATE CALIBRATED
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: '10px',
              letterSpacing: '-0.02em',
            }}
          >
            Welcome, {user?.name || 'Candidate'}!
          </h1>

          <p
            style={{
              fontSize: '14.5px',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: '24px',
            }}
          >
            Your candidate persona and company targets have been calibrated. The core interview engine (live voice simulation room, real-time code execution, and dynamic scoring) is coming in Phase 2.
          </p>

          {/* Features preview checklist */}
          <div
            style={{
              background: 'var(--surface-soft)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '16px 20px',
              marginBottom: '28px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Resume & Target Companies Profile Synced</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>TCS, Infosys & Product Rubrics Configured</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>
              <Layers size={16} color="var(--primary)" />
              <span>Live Voice Mock Room (Next Release)</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/onboarding" className="btn btn-outline" style={{ borderRadius: '99px', fontSize: '13px' }}>
              <RefreshCw size={13} />
              <span>Edit Profile Data</span>
            </Link>
            <Link to="/" className="btn btn-primary" style={{ borderRadius: '99px', fontSize: '13px' }}>
              <ArrowLeft size={14} />
              <span>Return to Home</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
