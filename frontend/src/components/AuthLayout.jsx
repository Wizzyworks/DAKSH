import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, ArrowLeft } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        backgroundImage: 'var(--bg-gradient)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '30%',
          width: '450px',
          height: '450px',
          background: 'var(--gradient-glow)',
          filter: 'blur(90px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          opacity: 0.45,
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Link
          to="/"
          className="btn btn-ghost btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
        >
          <ArrowLeft size={15} />
          <span>Back to Home</span>
        </Link>

        <ThemeToggle />
      </div>

      {/* Center Auth Card Container with Smooth Entrance Motion */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 24px 60px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', maxWidth: '440px' }}
        >
          {/* Brand Identity */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px var(--primary-glow)',
                }}
              >
                <GraduationCap size={22} color="#FFFFFF" strokeWidth={2.2} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    color: 'var(--text)',
                    letterSpacing: '-0.03em',
                    fontFamily: 'Outfit, sans-serif',
                    display: 'block',
                    lineHeight: 1,
                  }}
                >
                  DAKSH
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>
                  HireForge AI Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Frosted Glass Card */}
          <div
            className="gradient-border-card"
            style={{
              padding: '36px 32px',
              background: 'var(--surface-glass)',
              backdropFilter: 'blur(24px) saturate(180%)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {(title || subtitle) && (
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                {title && (
                  <h1
                    style={{
                      fontSize: '22px',
                      fontWeight: 800,
                      color: 'var(--text)',
                      marginBottom: subtitle ? '6px' : 0,
                    }}
                  >
                    {title}
                  </h1>
                )}
                {subtitle && <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>{subtitle}</p>}
              </div>
            )}
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
