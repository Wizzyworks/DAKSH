import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, FileText, CheckCircle2, ShieldCheck, Layers, Cpu, Sparkles, Terminal, Code } from 'lucide-react'

const RESUME_PROJECT_SCANS = [
  {
    projectName: 'Microservices E-Commerce Backend',
    techStack: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker'],
    targetCompany: 'TCS Prime / Digital (9 LPA)',
    extractedWeakness: 'ACID transactions across distributed services & Saga pattern',
    simulatedQuestion: '“Your resume highlights Kafka event streaming in this checkout service. How did you ensure idempotency and handle payment failure rollbacks without distributed deadlocks?”',
    candidateDefense: '“Implemented idempotent consumer headers using message GUIDs stored in Redis and orchestrated compensating transactions via the Saga pattern...”',
    aiScore: { depth: 95, articulation: 91, architecture: 94 }
  },
  {
    projectName: 'Distributed Real-Time Chat Engine',
    techStack: ['Node.js', 'WebSockets', 'Redis Pub/Sub', 'MongoDB'],
    targetCompany: 'Amazon SDE-1 Campus',
    extractedWeakness: 'Horizontal socket clustering & connection state persistence',
    simulatedQuestion: '“How did you scale WebSockets horizontally across multi-instance nodes when users connected to different servers needed instant message broadcast?”',
    candidateDefense: '“Decoupled state from the socket servers using Redis Pub/Sub backplane channel routing and pinned session tokens via sticky reverse-proxy load balancing...”',
    aiScore: { depth: 96, articulation: 94, architecture: 95 }
  },
  {
    projectName: 'Cloud Attendance & Face Recognition API',
    techStack: ['Python', 'FastAPI', 'OpenCV', 'AWS S3', 'PostgreSQL'],
    targetCompany: 'Cognizant GenC Next',
    extractedWeakness: 'Image encoding latency & asynchronous database IO',
    simulatedQuestion: '“In your FastAPI service, walk me through how you prevented async event-loop blocking during intensive face vector calculations.”',
    candidateDefense: '“Offloaded CPU-bound matrix embeddings to background process workers via Celery while keeping the I/O event loop non-blocking with asyncpg...”',
    aiScore: { depth: 93, articulation: 90, architecture: 92 }
  }
]

export default function ProductPreview() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const current = RESUME_PROJECT_SCANS[selectedIdx]

  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedIdx((prev) => (prev + 1) % RESUME_PROJECT_SCANS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div id="resume-intelligence" style={{ width: '100%', maxWidth: '660px', margin: '0 auto', position: 'relative' }}>
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          right: '10%',
          bottom: '10%',
          background: 'var(--gradient-glow)',
          filter: 'blur(50px)',
          borderRadius: '50%',
          zIndex: 0,
          opacity: 0.4,
        }}
      />

      {/* Main glass card container */}
      <div
        className="gradient-border-card"
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
        }}
      >
        {/* Card Header Bar */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-soft)',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
              <FileText size={15} color="var(--primary)" />
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                AI RESUME SCANNER & PROJECT GRILLER
              </span>
            </div>
          </div>

          {/* Interactive Project Switcher Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--surface)', padding: '2px', borderRadius: '99px', border: '1px solid var(--border)' }}>
            {RESUME_PROJECT_SCANS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '99px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedIdx === idx ? 'var(--primary)' : 'transparent',
                  color: selectedIdx === idx ? '#FFFFFF' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                }}
              >
                Project {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '22px' }}
          >
            {/* Parsed Project Details */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text)' }}>
                  {current.projectName}
                </span>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '99px',
                    fontSize: '11px',
                    fontWeight: 800,
                    background: 'var(--primary-dim)',
                    color: 'var(--primary)',
                    border: '1px solid rgba(37, 99, 235, 0.2)',
                  }}
                >
                  Target: {current.targetCompany}
                </span>
              </div>

              {/* Extracted Tech Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {current.techStack.map((tech, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'var(--surface-soft)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Generated Question */}
            <div
              style={{
                background: 'var(--surface-soft)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                marginBottom: '12px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <Code size={13} color="var(--primary)" />
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  AI Generated Technical Defense Question
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 600, lineHeight: 1.55 }}>
                {current.simulatedQuestion}
              </p>
            </div>

            {/* Candidate Response + Voice Waveform */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-focus)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                marginBottom: '14px',
                boxShadow: '0 2px 10px var(--primary-glow)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Mic size={13} color="var(--accent-amber)" />
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
                    Candidate Technical Speech Defense
                  </span>
                </div>

                {/* Animated Voice Equalizer */}
                <div className="wave-container" style={{ height: '16px', gap: '3px' }}>
                  {[10, 18, 12, 22, 8, 20, 14, 24, 10, 16].map((h, i) => (
                    <div
                      key={i}
                      className="wave-bar"
                      style={{
                        width: '3px',
                        animationDelay: `${i * 0.1}s`,
                        background: 'var(--primary)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '12.5px', color: 'var(--text)', fontStyle: 'italic', lineHeight: 1.55 }}>
                {current.candidateDefense}
              </p>
            </div>

            {/* AI Evaluation Gauges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 8px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Architecture</span>
                <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--primary)' }}>{current.aiScore.architecture}%</span>
              </div>
              <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 8px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Tech Depth</span>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#10B981' }}>{current.aiScore.depth}%</span>
              </div>
              <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 8px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Articulation</span>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#F59E0B' }}>{current.aiScore.articulation}%</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating badge */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-12px',
          right: '-10px',
          background: 'var(--surface)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <ShieldCheck size={16} color="var(--primary)" />
        <div>
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', display: 'block', textTransform: 'uppercase' }}>
            Semantic Analysis
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text)' }}>
            Real Project Grilling
          </span>
        </div>
      </motion.div>
    </div>
  )
}
