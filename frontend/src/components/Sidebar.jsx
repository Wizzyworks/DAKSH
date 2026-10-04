import { Link } from 'react-router-dom'
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
  GraduationCap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export const SIDEBAR_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'skill-gap', label: 'Skill Gap Analysis', icon: FileSearch },
  { id: 'learning-roadmap', label: 'Learning Roadmap', icon: BookOpen },
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
  const targetRole = profileData.targeted_role || 'Candidate Persona'

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(28px) saturate(180%)',
        borderRight: '1px solid var(--border)',
        padding: isCollapsed ? '16px 8px' : '20px 14px',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      {/* 1. Header: DAKSH Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border)',
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
              height: isCollapsed ? '28px' : '34px',
              maxWidth: isCollapsed ? '32px' : '150px',
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
              background: 'var(--surface-soft)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft size={15} />
          </button>
        )}
      </div>

      {/* Expand Button when Collapsed */}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          title="Expand Sidebar"
          style={{
            background: 'var(--surface-soft)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '6px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <ChevronRight size={15} />
        </button>
      )}

      {/* 2. Clean Navigation Menu List */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id)
                if (onCloseMobile) onCloseMobile()
              }}
              title={isCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '12px',
                width: '100%',
                padding: isCollapsed ? '10px 0' : '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon
                size={18}
                color={isActive ? 'var(--primary)' : 'var(--text-muted)'}
                strokeWidth={isActive ? 2.4 : 1.8}
                style={{ flexShrink: 0 }}
              />

              {!isCollapsed && (
                <span
                  style={{
                    fontSize: '13.5px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--text)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* 3. Bottom User Profile & Actions */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 800,
              color: '#FFFFFF',
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
                  color: 'var(--text)',
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
                  color: 'var(--text-subtle)',
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
              onClick={logout}
              title="Sign Out"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        style={{
          width: isCollapsed ? '68px' : '250px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          flexShrink: 0,
          zIndex: 40,
          display: 'none',
        }}
        className="desktop-sidebar"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
              }}
            />

            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              style={{ width: '270px', height: '100%', position: 'relative', zIndex: 10 }}
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-sidebar {
            display: block !important;
          }
        }
      `}</style>
    </>
  )
}
