import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, ArrowRight, Bot } from 'lucide-react'

export default function GenerationSequence({ courseData, onComplete }) {
  const [stage, setStage] = useState(0)

  // Simulation timeline:
  // 0ms: START appears
  // 600ms: Steps pop in one by one
  // 1400ms: Arrows draw themselves
  // 2100ms: END appears
  // 2800ms: Complete and transition to Flow Map
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 600)
    const t2 = setTimeout(() => setStage(2), 1400)
    const t3 = setTimeout(() => setStage(3), 2100)
    const t4 = setTimeout(() => {
      if (onComplete) onComplete()
    }, 2800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onComplete])

  return (
    <div
      style={{
        minHeight: '440px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
        fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
      }}
    >
      {/* Central Ambient Glow */}
      <div
        style={{
          position: 'relative',
          width: '120px',
          height: '120px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '-12px',
            borderRadius: '50%',
            border: '2px dashed var(--border-accent)',
            opacity: 0.7,
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'var(--primary-dim)',
            border: '1px solid var(--border-strong)',
          }}
        />

        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            color: 'var(--on-acc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px -4px rgba(91, 108, 240, 0.5)',
          }}
        >
          <Bot size={32} />
        </motion.div>
      </div>

      {/* Dynamic Animated Status Text */}
      <motion.h2
        key={stage}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--text)',
          letterSpacing: '-0.02em',
          margin: '0 0 8px 0',
        }}
      >
        {stage === 0 && 'Initializing Learning Journey...'}
        {stage === 1 && 'Synthesizing Step Nodes & Milestones...'}
        {stage === 2 && 'Drawing Serpentine Flow Connectors...'}
        {stage >= 3 && 'Curriculum Map Verified! Launching...'}
      </motion.h2>

      <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 24px 0', maxWidth: '420px' }}>
        Building your personalized learning roadmap for <strong style={{ color: 'var(--text)' }}>{courseData?.title || 'Your Course'}</strong>.
      </p>

      {/* Visual Mini Pipeline Progression */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--surface-card)',
          border: '1px solid var(--border)',
          borderRadius: '9999px',
          padding: '6px 16px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <span style={{ color: stage >= 0 ? 'var(--accent)' : 'var(--text-subtle)', fontWeight: 600 }}>START</span>
        <span style={{ color: 'var(--text-subtle)' }}>→</span>
        <span style={{ color: stage >= 1 ? 'var(--accent)' : 'var(--text-subtle)', fontWeight: 600 }}>
          {courseData?.totalStages || 4} NODES
        </span>
        <span style={{ color: 'var(--text-subtle)' }}>→</span>
        <span style={{ color: stage >= 2 ? 'var(--accent)' : 'var(--text-subtle)', fontWeight: 600 }}>CONNECTORS</span>
        <span style={{ color: 'var(--text-subtle)' }}>→</span>
        <span style={{ color: stage >= 3 ? 'var(--success)' : 'var(--text-subtle)', fontWeight: 600 }}>END</span>
      </div>
    </div>
  )
}

