import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, GraduationCap, Bell, Search, Sparkles } from 'lucide-react'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout({ activeTab, onSelectTab, children }) {
  const { user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const tabLabels = {
    'skill-gap': 'Skill Gap Analysis',
    'home': 'Home & Readiness',
    'learning-roadmap': 'Learning Hub',
    'setu-ai': 'SETU AI Assistant',
    'interview-room': 'Interview Room',
    'resume-builder': 'Resume Builder',
    'job-search': 'Job Search',
    'settings': 'Settings',
  }

  const currentTitle = tabLabels[activeTab] || 'Workspace'

  return (
    <div
      className="daksh-dashboard-root"
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--bg)',
        backgroundImage: 'var(--bg-gradient)',
        color: 'var(--text)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Faint ambient indigo/blue depth blob for glassmorphism */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-180px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '960px',
          height: '460px',
          background: 'radial-gradient(ellipse 65% 55% at 50% 50%, var(--primary-glow), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((c) => !c)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* 2. Right Main Workspace Viewport */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 1 }}>
        
        {/* Top Header Bar (Desktop & Mobile, calm Linear/Vercel style) */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 28px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          {/* Mobile hamburger & brand / Desktop breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open Navigation Menu"
              className="lg:hidden"
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Menu size={17} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => onSelectTab('home')}
                title="Go to Home"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textDecoration: activeTab !== 'home' ? 'underline' : 'none',
                  textUnderlineOffset: '2px',
                }}
              >
                Workspace
              </button>
              <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>/</span>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                {currentTitle}
              </span>
            </div>
          </div>

          {/* Right actions: Subtle status pill & Minimal Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 9px',
                borderRadius: '9999px',
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                fontSize: '11.5px',
                color: 'var(--text-muted)',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'var(--success)',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: 500 }}>Live Sync</span>
            </div>

            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main
          id="daksh-main-scroll"
          style={{
            flex: 1,
            padding: '28px 32px 80px',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .daksh-dashboard-root {
            height: 100vh !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </div>
  )
}

