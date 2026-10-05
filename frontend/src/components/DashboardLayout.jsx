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

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--bg)',
        backgroundImage: 'var(--bg-gradient)',
        color: 'var(--text)',
        position: 'relative',
      }}
    >
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Mobile Top Header (Hidden on Desktop) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(20px)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
          className="mobile-top-bar"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsMobileOpen(true)}
              style={{
                background: 'var(--surface-soft)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Menu size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--text)', fontFamily: 'Outfit, sans-serif' }}>
                DAKSH
              </span>
              <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 800 }}>
                PIPELINE
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ThemeToggle />
          </div>
        </div>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, padding: '32px 28px 80px', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .mobile-top-bar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
