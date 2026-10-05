import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, CheckCircle2, FileText, Brain, MessageSquare,
  Mic2, Target, Trophy, ShieldCheck, ChevronRight, Users, ChevronDown,
  Building2, Zap, Award, Compass, Play, Star, GraduationCap,
  Layers, Terminal, Check, X,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero3DCanvas from '../components/Hero3DCanvas'


const ROTATING_TITLES = [
  'TCS Prime & Digital Ready',
  'Amazon SDE-1 Ready',
  'Campus Placement Ready',
  'High-Package Engineers'
]

const TARGET_COMPANIES = [
  {
    name: 'Google',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
    ),
  },
  {
    name: 'Microsoft',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path fill="#F25022" d="M1 1h10v10H1z" />
        <path fill="#7FBA00" d="M13 1h10v10H13z" />
        <path fill="#00A4EF" d="M1 13h10v10H1z" />
        <path fill="#FFB900" d="M13 13h10v10H13z" />
      </svg>
    ),
  },
  {
    name: 'Amazon',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M13.9 14.8c-.8.6-2 .9-3.2.9-1.9 0-3.3-.8-3.3-2.7 0-1.8 1.4-2.7 3.5-2.7.9 0 1.9.2 2.7.5v-.5c0-1.1-.7-1.8-2.2-1.8-1 0-2 .3-2.8.8l-.5-1.2c1-.6 2.3-1 3.6-1 2.4 0 3.8 1.2 3.8 3.3v4.6h-1.6v-1.2zm-2.8-.2c1.2 0 2.2-.4 2.8-1v-1.5c-.7-.3-1.6-.4-2.4-.4-1.3 0-2.1.5-2.1 1.4 0 .9.7 1.5 1.7 1.5z" fill="#FF9900" />
        <path d="M21.5 18.5c-3 2.2-7.3 3.3-11 3.3-5.2 0-9.8-2-13.4-5.4-.3-.3-.1-.7.3-.5 3.9 2.2 8.6 3.5 13.4 3.5 3.5 0 7.4-.9 10.3-2.7.5-.3.9.3.4.8z" fill="#FF9900" />
        <path d="M22.5 17.2c-.4-.5-2.5-.2-3.8.3-.4.1-.3-.3.1-.6 2.4-1.7 6.1-1.2 6.6-.7.5.6-.2 4.4-2.4 6.2-.4.3-.7.1-.5-.2.8-1.2 1.2-3.8 0-5z" fill="#FF9900" />
      </svg>
    ),
  },
  {
    name: 'Meta',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#0668E1">
        <path d="M16.96 4c-1.85 0-3.5 1-4.96 2.65C10.54 5 8.89 4 7.04 4 3.16 4 0 7.23 0 11.2c0 4.96 4.31 8.8 9.3 8.8 1.25 0 2.05-.28 2.7-.64.65.36 1.45.64 2.7.64 4.99 0 9.3-3.84 9.3-8.8C24 7.23 20.84 4 16.96 4zm-4.96 11.58c-.68-.6-1.56-1.58-2.39-2.79-1.28-1.87-2.1-3.64-2.57-4.79-.04 0-.08-.01-.12-.01-1.92 0-3.48 1.6-3.48 3.57 0 2.37 1.95 4.37 4.56 4.37 1.61 0 2.87-.66 4-1.35zm9.56-4.38c0-1.97-1.56-3.57-3.48-3.57-.04 0-.08.01-.12.01-.47 1.15-1.29 2.92-2.57 4.79-.83 1.21-1.71 2.19-2.39 2.79 1.13.69 2.39 1.35 4 1.35 2.61 0 4.56-2 4.56-4.37z" />
      </svg>
    ),
  },
  {
    name: 'Apple',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.93c.62-.75 1.04-1.8 1.01-2.93-.9.04-2 .6-2.65 1.36-.58.67-.99 1.74-.85 2.79 1.02.08 2.02-.54 2.49-1.22z" />
      </svg>
    ),
  },
  {
    name: 'Netflix',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#E50914">
        <path d="M5.398 0v24c1.196-.271 2.39-.58 3.585-.92V0H5.398zm9.619 0v19.453c1.23-.424 2.427-.887 3.585-1.387V0h-3.585zM8.983 0v4.444l6.034 16.572V0H8.983z" />
      </svg>
    ),
  },
  {
    name: 'NVIDIA',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#76B900">
        <path d="M7.78 6.47c-2.46.73-4.52 2.84-5.18 5.37C1.65 15.5 4.4 19.3 8.35 19.86v-2.02c-2.65-.63-4.44-3.13-4.06-5.83.33-2.3 2.22-4.14 4.54-4.43v-1.11zm2.34-1.28v1.17c3.96.48 7.07 3.73 7.21 7.73.13 3.99-2.76 7.4-6.72 7.91v2.03c5.38-.59 9.38-5.32 9.04-10.74C19.33 8 15.22 3.96 9.87 3.96c-.85 0-1.7.08-2.52.23l2.77 1zM9.87 8.5v1.27c1.97.4 3.44 2.07 3.49 4.07.05 2.04-1.38 3.79-3.39 4.14v1.89c3.08-.43 5.4-3.08 5.3-6.19-.09-2.88-2.3-5.18-5.18-5.26-.07 0-.15 0-.22.08z" />
      </svg>
    ),
  },
  {
    name: 'Adobe',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#FA0F00">
        <path d="M14.58 2.4h9.42V21.6h-4.32l-3.24-8.64h-3.6zM9.42 2.4H0V21.6h4.32l3.24-8.64h3.6zm2.58 11.04l2.88 7.68h-5.76z" />
      </svg>
    ),
  },
  {
    name: 'Spotify',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#1DB954">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    name: 'Uber',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3.2c3.75 0 6.8 3.05 6.8 6.8s-3.05 6.8-6.8 6.8-6.8-3.05-6.8-6.8 3.05-6.8 6.8-6.8zm-3.2 4v5.6h6.4v-2.8h-3.6V9.2H8.8z" />
      </svg>
    ),
  },
  {
    name: 'Salesforce',
    svg: (
      <svg width="28" height="24" viewBox="0 0 24 24" fill="#00A1E0">
        <path d="M10 4.5c1.3 0 2.5.5 3.3 1.4.8-.6 1.8-.9 2.9-.9 2.7 0 4.8 2.2 4.8 4.8 0 .3 0 .6-.1.9 1.8.6 3.1 2.3 3.1 4.3 0 2.5-2 4.5-4.5 4.5H5c-2.8 0-5-2.2-5-5 0-2.4 1.7-4.4 4-4.9.4-2.9 2.9-5.1 6-5.1z" />
      </svg>
    ),
  },
  {
    name: 'Oracle',
    svg: (
      <svg width="26" height="24" viewBox="0 0 24 24" fill="#F80000">
        <path d="M16.3 5.5H7.7C4.1 5.5 1.2 8.4 1.2 12s2.9 6.5 6.5 6.5h8.6c3.6 0 6.5-2.9 6.5-6.5s-2.9-6.5-6.5-6.5zm-.1 10H7.8C5.8 15.5 4.2 13.9 4.2 12s1.6-3.5 3.6-3.5h8.4c2 0 3.6 1.6 3.6 3.5s-1.6 3.5-3.6 3.5z" />
      </svg>
    ),
  },
  {
    name: 'TCS',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#0076CE">
        <path d="M3 5h18v3.5h-7.25V19h-3.5V8.5H3V5z" />
      </svg>
    ),
  },
  {
    name: 'Infosys',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#007CC3">
        <path d="M3 4h3.5v16H3zm6.5 0H13v9c0 1.9 1.6 3.5 3.5 3.5H20V19h-3.5c-3.6 0-6.5-2.9-6.5-6.5V4z" />
      </svg>
    ),
  },
  {
    name: 'Accenture',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#A100FF">
        <path d="M1 3l15 9-15 9h6.5l15.5-9L7.5 3H1z" />
      </svg>
    ),
  },
  {
    name: 'Cognizant',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#0033A0">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78l-1.41 1.41C14.09 8.47 13.09 8 12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4c1.09 0 2.09-.47 2.81-1.19l1.41 1.41C15.14 17.31 13.66 18 12 18z" />
      </svg>
    ),
  },
  {
    name: 'Wipro',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="6" r="3" fill="#E2231A" />
        <circle cx="18" cy="6" r="3" fill="#00A3E0" />
        <circle cx="6" cy="18" r="3" fill="#78BE20" />
        <circle cx="18" cy="18" r="3" fill="#FFC72C" />
        <circle cx="12" cy="12" r="3" fill="#582C83" />
      </svg>
    ),
  },
  {
    name: 'Goldman Sachs',
    svg: (
      <svg width="26" height="24" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="18" rx="3" fill="#7399C6" />
        <text x="12" y="15.5" fontSize="10.5" fontWeight="900" fill="#FFFFFF" textAnchor="middle" fontFamily="Outfit, sans-serif">GS</text>
      </svg>
    ),
  },
  {
    name: 'Atlassian',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#0052CC">
        <path d="M11.53 2c-.44.62-.7 1.39-.7 2.22 0 2.45 2.15 3.95 4.35 6.03 2.07 1.95 3.82 4.54 3.82 7.75 0 2.21-.83 4.25-2.22 5.8h6.22c.6 0 1-.5 1-1 0-7.3-5.2-13.4-12.47-20.8zm-2.06 6.8c-.44.62-.7 1.39-.7 2.22 0 2.45 2.15 3.95 4.35 6.03 2.07 1.95 3.82 4.54 3.82 7.75 0 .4-.03.8-.08 1.2H.97c-.55 0-1-.45-1-1 0-5.3 3.8-9.8 9.5-16.2z" />
      </svg>
    ),
  },
  {
    name: 'Cisco',
    svg: (
      <svg width="26" height="24" viewBox="0 0 24 24" fill="#049FD9">
        <rect x="3" y="10" width="2.5" height="7" rx="1.25" />
        <rect x="7.5" y="6" width="2.5" height="11" rx="1.25" />
        <rect x="12" y="12" width="2.5" height="5" rx="1.25" />
        <rect x="16.5" y="6" width="2.5" height="11" rx="1.25" />
        <rect x="21" y="10" width="2.5" height="7" rx="1.25" />
      </svg>
    ),
  },
]

const BENTO_FEATURES = [
  {
    icon: FileText,
    badge: 'Resume Analysis & Builder',
    title: 'Zero Generic Questions',
    desc: 'DAKSH scans every project stack, bullet point, and GitHub link in your resume to grill you on real architecture decisions, database queries, and edge cases.',
    highlight: 'Scans real tech stacks & STAR metrics',
    color: 'var(--primary)'
  },
  {
    icon: Target,
    badge: 'Company Patterns',
    title: 'Targeted Hiring Rubrics',
    desc: 'Whether aiming for a 9 LPA TCS Prime coding defense or an Amazon behavioral round, DAKSH automatically configures question strictness to match company standards.',
    highlight: 'TCS, Infosys, Wipro, Amazon & 40+ recruitment rubrics',
    color: '#059669'
  },
  {
    icon: Mic2,
    badge: 'Delivery Intelligence',
    title: 'Real-Time Voice & Speech Coach',
    desc: 'Live feedback on speech pacing, filler words (um/uh), technical articulation, and hesitation gaps so you never freeze during live placement panels.',
    highlight: 'Speech pacing & filler word reduction metrics',
    color: 'var(--accent-amber)'
  },
  {
    icon: Compass,
    badge: 'Adaptive Drills',
    title: 'Dynamic Weakness Heatmap',
    desc: 'Tracks your knowledge gaps across Data Structures, DBMS, System Design, and HR rounds to construct personalized revision pathways.',
    highlight: 'Pinpoints conceptual blind spots before drive day',
    color: '#0284C7'
  }
]

const FAQS = [
  {
    q: 'How is DAKSH different from solving LeetCode or watching YouTube mocks?',
    a: 'LeetCode only tests isolated algorithm problems without speech or architecture defense, while YouTube is passive watching. DAKSH is an active, voice-enabled AI interviewer that examines YOUR actual resume projects, asks probing follow-ups when you hesitate, and grades you against company hiring rubrics.'
  },
  {
    q: 'I study in a Tier-2 / Tier-3 college. How will this platform help me?',
    a: 'Tier-2 and Tier-3 colleges often face limited alumni mentoring and mass recruitment filters. DAKSH bridges this gap by providing every candidate with 1-on-1 personalized interview coaching matching tier-1 standards, turning average project descriptions into confident, hire-ready profiles.'
  },
  {
    q: 'Can DAKSH prepare me for both service and product company interviews?',
    a: 'Yes. DAKSH has pre-configured interview engines for mass-recruiter high-package upgrades (like TCS Digital/Prime, Infosys SP, Cognizant GenC Next) as well as tier-1 product roles (Amazon, High-growth Startups, Fintech).'
  },
  {
    q: 'Do I need to install any heavy software to practice?',
    a: 'No, DAKSH runs completely in your web browser. You can create an account, upload your resume, configure your target companies, and start your initial mock interview session in under 2 minutes.'
  }
]

export default function LandingPage() {
  const [rotatorIdx, setRotatorIdx] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setRotatorIdx((prev) => (prev + 1) % ROTATING_TITLES.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: '0' }}>
        {/* ─── Hero Section with 2-Column 3D Interactive Layout ──── */}
        <section className="section hero-tech-bg" style={{ paddingTop: '40px', paddingBottom: '65px' }}>
          <div className="page-container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                alignItems: 'center',
                gap: '40px',
              }}
            >
              {/* Left Column: Heading, Subtitle & Direct Action CTAs */}
              <div>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  style={{ display: 'inline-block', marginBottom: '18px' }}
                >
                  <div className="glow-pill" style={{ padding: '4px 12px' }}>
                    <GraduationCap size={15} color="var(--primary)" />
                    <span style={{ color: 'var(--text)', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      ENGINEERING PLACEMENT INTELLIGENCE • DAKSH
                    </span>
                  </div>
                </motion.div>

                {/* Dynamic Rotating Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{
                    fontSize: 'clamp(32px, 4.2vw, 52px)',
                    lineHeight: 1.15,
                    letterSpacing: '-0.035em',
                    marginBottom: '16px',
                  }}
                >
                  Turn Campus Preparation Into{' '}
                  <span className="shimmer-text">Guaranteed Placement</span>
                  <br />
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75em', fontWeight: 600, marginTop: '4px' }}>
                    Calibrated as{' '}
                  </span>
                  <span style={{ display: 'inline-block', minHeight: '1.2em' }}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={rotatorIdx}
                        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        style={{
                          background: 'var(--gradient-primary)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 900,
                        }}
                      >
                        {ROTATING_TITLES[rotatorIdx]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{
                    fontSize: 'clamp(14px, 1.8vw, 16px)',
                    color: 'var(--text-muted)',
                    maxWidth: '560px',
                    marginBottom: '26px',
                    lineHeight: 1.65,
                  }}
                >
                  The autonomous placement preparation ecosystem for engineering students. Multi-signal resume parsing, adaptive diagnostic arenas, and Tier-1 hiring rubrics.
                </motion.p>

                {/* Direct Action Buttons: Sign Up & Log In */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    flexWrap: 'wrap',
                    marginBottom: '28px',
                  }}
                >
                  <Link
                    to="/signup"
                    className="btn btn-primary btn-lg"
                    style={{
                      borderRadius: '99px',
                      fontSize: '14.5px',
                      fontWeight: 800,
                      padding: '13px 28px',
                      boxShadow: '0 4px 20px var(--primary-glow)',
                    }}
                  >
                    <span>Sign Up / Get Started</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/login"
                    className="btn btn-outline btn-lg"
                    style={{
                      borderRadius: '99px',
                      fontSize: '14.5px',
                      fontWeight: 700,
                      padding: '13px 26px',
                    }}
                  >
                    <span>Log In</span>
                  </Link>
                </motion.div>

                {/* System Capability Telemetry Bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="var(--primary)" />
                    <span>Multi-Signal AI Engine</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Terminal size={14} color="#10B981" />
                    <span>GitHub Repo-Aware</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Target size={14} color="#F59E0B" />
                    <span>Adaptive Diagnostic Arena</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Unboxed Floating 3D Canvas */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                }}
              >
                {/* 3D Neural Placement Core Canvas */}
                <Hero3DCanvas />
              </motion.div>
            </div>
          </div>
        </section>

                {/* ─── Target Companies Infinite Marquee ────────────────────────────── */}
        <section style={{ padding: '30px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface-soft)' }}>
          <p style={{ textAlign: 'center', fontSize: '11.5px', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
            Calibrated on Hiring Patterns of Top Tech Recruitment Drives
          </p>

          <div className="marquee-container">
            {/* Track 1 */}
            <div className="marquee-track">
              {TARGET_COMPANIES.map((comp, idx) => (
                <div key={`track1-${idx}`} className="company-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', flexShrink: 0 }}>
                    {comp.svg}
                  </div>
                  <span style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                    {comp.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Track 2 (Seamless Infinite Looping) */}
            <div className="marquee-track" aria-hidden="true">
              {TARGET_COMPANIES.map((comp, idx) => (
                <div key={`track2-${idx}`} className="company-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', flexShrink: 0 }}>
                    {comp.svg}
                  </div>
                  <span style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                    {comp.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ─── Bento Grid Features Section (Scroll Reveal) ─────────── */}
        <section id="features" className="section">
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}
            >
              <span className="glow-pill" style={{ marginBottom: '12px' }}>
                CORE INTELLIGENCE
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: '14px' }}>
                Engineered for High-Stakes Campus Interviews
              </h2>
              <p style={{ fontSize: '15px' }}>
                Standard mock tools ask standard trivia. DAKSH uses multi-agent evaluation to test your architecture decisions, edge cases, and voice confidence.
              </p>
            </motion.div>

            {/* Asymmetric Bento Grid with Scroll Reveal */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '22px',
              }}
            >
              {BENTO_FEATURES.map((feat, idx) => {
                const Icon = feat.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4 }}
                    className="gradient-border-card"
                    style={{
                      padding: '30px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'var(--surface)',
                      borderRadius: 'var(--radius-xl)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'var(--surface-soft)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={22} color={feat.color} />
                        </div>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '99px',
                            background: 'var(--surface-soft)',
                            color: feat.color,
                            border: `1px solid ${feat.color}30`,
                            textTransform: 'uppercase'
                          }}
                        >
                          {feat.badge}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '19px', marginBottom: '10px' }}>{feat.title}</h3>
                      <p style={{ fontSize: '13.5px', lineHeight: 1.65, marginBottom: '20px' }}>{feat.desc}</p>
                    </div>

                    <div
                      style={{
                        padding: '9px 12px',
                        background: 'var(--surface-soft)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Zap size={14} color={feat.color} />
                      <span>{feat.highlight}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── Methodology / Pipeline (Scroll Reveal) ──────────────── */}
        <section id="methodology" className="section" style={{ background: 'var(--surface-soft)' }}>
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}
            >
              <span className="glow-pill" style={{ marginBottom: '12px' }}>
                METHODOLOGY
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: '14px' }}>
                From Resume Parsing to Campus Offer Letter
              </h2>
              <p style={{ fontSize: '15px' }}>
                A systematic workflow designed to convert college talent into confident, interview-hardened engineers.
              </p>
            </motion.div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '18px',
              }}
            >
              {[
                {
                  step: '01',
                  title: 'Smart Profile Onboarding',
                  desc: 'Input your college, batch, target companies, and upload your resume for deep semantic parsing.'
                },
                {
                  step: '02',
                  title: 'Custom Question Generation',
                  desc: 'DAKSH extracts your specific project stack to generate authentic questions — zero generic trivia.'
                },
                {
                  step: '03',
                  title: 'Live Voice & Text Simulation',
                  desc: 'Engage in an adaptive interview. AI probes deeper if your answers lack depth or STAR structure.'
                },
                {
                  step: '04',
                  title: 'Actionable Score & Fix Plan',
                  desc: 'Receive immediate metrics across technical correctness, communication, and step-by-step revision drills.'
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '30px',
                      fontWeight: 900,
                      background: 'var(--gradient-primary)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'block',
                      marginBottom: '10px',
                    }}
                  >
                    {item.step}
                  </span>
                  <h4 style={{ fontSize: '17px', marginBottom: '8px' }}>{item.title}</h4>
                  <p style={{ fontSize: '13px', lineHeight: 1.6 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Comparison Benchmarks (Scroll Reveal) ───────────────── */}
        <section id="comparison" className="section">
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}
            >
              <span className="glow-pill" style={{ marginBottom: '12px' }}>
                BENCHMARK COMPARISON
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: '14px' }}>
                Why Traditional Prep Falls Short
              </h2>
            </motion.div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '24px',
                maxWidth: '880px',
                margin: '0 auto',
              }}
            >
              {/* Traditional Prep Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '30px',
                  opacity: 0.9,
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                  Traditional Campus Prep
                </span>
                <h3 style={{ fontSize: '19px', marginTop: '6px', marginBottom: '18px', color: 'var(--text-muted)' }}>
                  Generic & Rote Memorization
                </h3>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    'Memorizing generic answers from YouTube',
                    'Solving abstract DSA puzzles without speaking practice',
                    'Zero feedback on actual resume projects',
                    'No practice for spontaneous HR & behavioral rounds',
                    'Panic and hesitation during actual interview panels'
                  ].map((text, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <X size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* DAKSH AI Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="gradient-border-card"
                style={{
                  background: 'var(--surface)',
                  border: '2px solid var(--primary)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '30px',
                  boxShadow: '0 16px 36px var(--primary-glow)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                    DAKSH Platform
                  </span>
                  <span style={{ padding: '3px 8px', borderRadius: '99px', background: 'var(--primary-dim)', color: 'var(--primary)', fontSize: '10.5px', fontWeight: 800 }}>
                    Recommended
                  </span>
                </div>

                <h3 style={{ fontSize: '19px', marginTop: '6px', marginBottom: '18px' }}>
                  Personalized Intelligence
                </h3>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    'Custom questions derived from YOUR real resume projects',
                    'Real-time voice feedback on speech pacing & filler words',
                    'Company-specific evaluation (TCS Prime, Amazon, Infosys)',
                    'Adaptive follow-up questions when you answer vaguely',
                    'High confidence & zero freeze on placement day'
                  ].map((text, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>
                      <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── FAQ Section (Scroll Reveal) ─────────────────────────── */}
        <section className="section" style={{ background: 'var(--surface-soft)' }}>
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 45px' }}
            >
              <span className="glow-pill" style={{ marginBottom: '12px' }}>
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>Frequently Asked Questions</h2>
            </motion.div>

            <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.45, delay: idx * 0.05 }}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14.5px',
                        fontWeight: 700,
                        color: 'var(--text)',
                      }}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={17}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                          color: 'var(--primary)',
                          flexShrink: 0,
                          marginLeft: '10px'
                        }}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ padding: '0 20px 16px', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── Bottom CTA Banner (Scroll Reveal) ───────────────────── */}
        <section className="section">
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="gradient-border-card"
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-xl)',
                padding: '56px 28px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '20%',
                  right: '20%',
                  bottom: '-50%',
                  background: 'var(--gradient-glow)',
                  filter: 'blur(70px)',
                  opacity: 0.25,
                  pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1, maxWidth: '620px', margin: '0 auto' }}>
                <span className="glow-pill" style={{ marginBottom: '16px' }}>
                  PLACEMENT ASSESSMENT
                </span>

                <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', marginBottom: '16px' }}>
                  Stop Wondering If You're Hire-Ready.
                  <br />
                  <span className="shimmer-text">Prove It With DAKSH.</span>
                </h2>

                <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '28px' }}>
                  Join thousands of engineering candidates upgrading their mock preparation with instant, intelligent AI feedback.
                </p>

                <Link
                  to="/signup"
                  className="btn btn-primary btn-lg"
                  style={{ borderRadius: '99px', fontSize: '15px', padding: '15px 36px' }}
                >
                  <ShieldCheck size={18} />
                  <span>Get Started For Free</span>
                  <ArrowRight size={17} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
