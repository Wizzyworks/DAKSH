import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Menu, X, LogOut, ArrowRight, LayoutDashboard, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const isHome = location.pathname === '/'

  const scrollTo = (id) => {
    setMobileOpen(false)
    if (!isHome) {
      navigate('/' + id)
      return
    }
    const el = document.querySelector(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header className="site-navbar">
        <div className="site-navbar-container">
          {/* Brand Logo with Official DAKSH Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <img
              src="/daksh-logo.png"
              alt="DAKSH - Placement Intelligence"
              style={{
                height: '38px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            <span
              className="hidden sm:inline-flex"
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                padding: '3px 8px',
                borderRadius: '99px',
                background: 'var(--primary-dim)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                textTransform: 'uppercase',
              }}
            >
              Placement Engine
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              background: 'var(--surface-soft)',
              padding: '4px 6px',
              borderRadius: '999px',
              border: '1px solid var(--border)',
            }}
          >
            <button
              onClick={() => scrollTo('#features')}
              className="nav-link"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Features
            </button>
            <button
              onClick={() => scrollTo('#methodology')}
              className="nav-link"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Methodology
            </button>
            <Link
              to="/dashboard"
              className="nav-link"
              style={{ cursor: 'pointer' }}
            >
              Skill Gap Matrix
            </Link>
            <button
              onClick={() => scrollTo('#comparison')}
              className="nav-link"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Placement Benchmarks
            </button>
            <button
              onClick={() => scrollTo('#faqs')}
              className="nav-link"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              FAQ
            </button>
          </nav>

          {/* Action Buttons & Theme */}
          <div
            className="hidden sm:flex"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <ThemeToggle />

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  to="/dashboard"
                  className="btn btn-primary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '99px',
                    padding: '8px 16px',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  <LayoutDashboard size={15} />
                  <span>Dashboard</span>
                  <ChevronRight size={14} />
                </Link>

                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 10px' }}
                  title="Sign out"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm"
                  style={{
                    fontWeight: 700,
                    fontSize: '13px',
                    color: 'var(--text)',
                    padding: '8px 16px',
                  }}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm"
                  style={{
                    borderRadius: '99px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger & theme */}
          <div className="flex lg:hidden" style={{ alignItems: 'center', gap: '6px' }}>
            <ThemeToggle />
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle Navigation"
              style={{ padding: '6px 8px' }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed',
              top: '68px',
              left: 0,
              right: 0,
              background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              padding: '20px 24px',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 99,
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <button
              onClick={() => scrollTo('#features')}
              style={{ padding: '10px', textAlign: 'left', background: 'none', border: 'none', fontWeight: 600, color: 'var(--text)', fontSize: '14.5px' }}
            >
              Platform Features
            </button>
            <button
              onClick={() => scrollTo('#methodology')}
              style={{ padding: '10px', textAlign: 'left', background: 'none', border: 'none', fontWeight: 600, color: 'var(--text)', fontSize: '14.5px' }}
            >
              Preparation Methodology
            </button>
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              style={{ padding: '10px', textAlign: 'left', background: 'none', border: 'none', fontWeight: 600, color: 'var(--text)', fontSize: '14.5px', textDecoration: 'none' }}
            >
              Skill Gap Matrix & Dashboard
            </Link>
            <button
              onClick={() => scrollTo('#comparison')}
              style={{ padding: '10px', textAlign: 'left', background: 'none', border: 'none', fontWeight: 600, color: 'var(--text)', fontSize: '14.5px' }}
            >
              Placement Benchmarks
            </button>
            <button
              onClick={() => scrollTo('#faqs')}
              style={{ padding: '10px', textAlign: 'left', background: 'none', border: 'none', fontWeight: 600, color: 'var(--text)', fontSize: '14.5px' }}
            >
              Frequently Asked Questions
            </button>

            <div style={{ height: '1px', background: 'var(--border)', margin: '6px 0' }} />

            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Signed in as <strong>{user.email}</strong>
                </span>
                <Link to="/dashboard" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard size={16} /> Open Dashboard
                </Link>
                <button className="btn btn-outline" onClick={handleLogout}>
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/login" className="btn btn-outline" onClick={() => setMobileOpen(false)}>
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                  Get Started Free
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 1024px) {
          .flex.lg\\:hidden { display: none !important; }
        }
        @media (max-width: 1023px) {
          .hidden.lg\\:flex { display: none !important; }
        }
        @media (min-width: 640px) {
          .hidden.sm\\:inline-flex { display: inline-flex !important; }
          .hidden.sm\\:flex { display: flex !important; }
        }
        @media (max-width: 639px) {
          .hidden.sm\\:inline-flex { display: none !important; }
          .hidden.sm\\:flex { display: none !important; }
        }
      `}</style>
    </>
  )
}
