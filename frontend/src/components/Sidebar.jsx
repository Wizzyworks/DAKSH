import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  FileSearch,
  BookOpen,
  Bot,
  Mic,
  FileText,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export const SIDEBAR_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'skill-gap', label: 'Skill Gap Analysis', icon: FileSearch },
  { id: 'learning-roadmap', label: 'Learning Hub', icon: BookOpen },
  { id: 'setu-ai', label: 'SETU AI', icon: Bot },
  { id: 'interview-room', label: 'Interview Room', icon: Mic },
  { id: 'resume-builder', label: 'Resume Builder', icon: FileText },
  { id: 'job-search', label: 'Job Search', icon: Briefcase },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }
  const sidebarRef = useRef(null)
  const [hoveredTab, setHoveredTab] = useState(null)

  // Retrieve user onboarding profile data
  const profileData = (() => {
    try {
      const stored = localStorage.getItem('daksh-onboarding-data-v4')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })()

  const firstName = profileData.first_name || user?.name || 'Candidate'
  const targetRole = profileData.targeted_role || 'Software Engineering'

  // Pointer-following spotlight on hover
  useEffect(() => {
    const el = sidebarRef.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return

    let rafId = null
    const handlePointerMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        el.style.setProperty('--mx', `${x}px`)
        el.style.setProperty('--my', `${y}px`)
      })
    }

    el.addEventListener('pointermove', handlePointerMove)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      el.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  const sidebarContent = (
    <div
      ref={sidebarRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        padding: isCollapsed ? '16px 8px' : '20px 14px',
        position: 'relative',
        transition: 'width 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}
      className="daksh-sidebar-container"
    >
      {/* Faint top ambient depth */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'radial-gradient(ellipse 70% 50% at 50% -10%, var(--sidebar-glow) 0%, transparent 80%)',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />

      {/* 1. Header: DAKSH Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--sidebar-border)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            overflow: 'hidden',
          }}
        >
          <img
            src="/daksh-logo.png"
            alt="DAKSH"
            style={{
              height: isCollapsed ? '26px' : '30px',
              maxWidth: isCollapsed ? '30px' : '135px',
              objectFit: 'contain',
              display: 'block',
              transition: 'all 0.2s ease',
            }}
          />
        </Link>

        {/* Collapse Button (Desktop) */}
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            title="Collapse Sidebar"
            style={{
              background: 'var(--sidebar-surface)',
              border: '1px solid var(--sidebar-border)',
              borderRadius: '6px',
              padding: '5px',
              color: 'var(--sidebar-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease, color 0.15s ease',
            }}
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Expand Button when Collapsed */}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          title="Expand Sidebar"
          style={{
            background: 'var(--sidebar-surface)',
            border: '1px solid var(--sidebar-border)',
            borderRadius: '8px',
            padding: '6px',
            color: 'var(--sidebar-text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            width: '32px',
            height: '32px',
            margin: '0 auto 14px',
          }}
        >
          <ChevronRight size={15} />
        </button>
      )}

      {/* 2. Navigation Items List */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const isHovered = hoveredTab === item.id

          return (
            <div key={item.id} style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  onSelectTab(item.id)
                  if (onCloseMobile) onCloseMobile()
                }}
                onMouseEnter={() => setHoveredTab(item.id)}
                onMouseLeave={() => setHoveredTab(null)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  gap: '12px',
                  width: '100%',
                  padding: isCollapsed ? '8px 0' : '8px 10px',
                  borderRadius: '7px',
                  background: isActive
                    ? 'var(--sidebar-active-bg)'
                    : isHovered
                    ? 'var(--sidebar-hover-bg)'
                    : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(107, 124, 245, 0.16)' : 'transparent',
                  color: isActive ? 'var(--sidebar-active-text)' : isHovered ? 'var(--sidebar-text)' : 'var(--sidebar-text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Active left bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '7px',
                      bottom: '7px',
                      width: '2px',
                      borderRadius: '0 3px 3px 0',
                      background: 'var(--accent)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                  />
                )}

                <Icon
                  size={17}
                  color={isActive ? 'var(--sidebar-active-text)' : isHovered ? 'var(--sidebar-text)' : 'var(--sidebar-text-muted)'}
                  strokeWidth={isActive ? 2 : 1.7}
                  style={{
                    flexShrink: 0,
                    transition: 'color 0.15s ease',
                  }}
                />

                {!isCollapsed && (
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 450,
                      color: isActive ? 'var(--sidebar-active-text)' : isHovered ? 'var(--sidebar-text)' : 'var(--sidebar-text-muted)',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.15s ease',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </button>

              {/* Tooltip when collapsed */}
              {isCollapsed && isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    left: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginLeft: '8px',
                    padding: '4px 9px',
                    borderRadius: '6px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    color: 'var(--text)',
                    whiteSpace: 'nowrap',
                    zIndex: 100,
                    pointerEvents: 'none',
                  }}
                >
                  {item.label}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* 3. Bottom User Profile & Theme Toggle */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid var(--sidebar-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: '#F8F9FC',
              flexShrink: 0,
            }}
          >
            {firstName.charAt(0).toUpperCase()}
          </div>

          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--sidebar-text)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {firstName}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--sidebar-text-muted)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {targetRole}
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--sidebar-text-muted)',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .daksh-sidebar-container {
          background-image: radial-gradient(
            280px circle at var(--mx, -500px) var(--my, -500px),
            rgba(99, 86, 255, 0.06),
            transparent 80%
          );
        }
      `}</style>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Fixed / Collapsible) */}
      <aside
        className="hidden lg:block"
        style={{
          width: isCollapsed ? '64px' : '240px',
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Responsive Overlay) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
              }}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                width: '260px',
                height: '100%',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
