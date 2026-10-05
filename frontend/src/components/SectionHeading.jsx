import { motion } from 'framer-motion'

export default function SectionHeading({ badge, title, subtitle, center = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ textAlign: center ? 'center' : 'left', maxWidth: center ? '620px' : undefined, margin: center ? '0 auto' : undefined }}
    >
      {badge && (
        <div style={{ marginBottom: '16px' }}>
          <span className="badge badge-primary">{badge}</span>
        </div>
      )}
      <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--text)', marginBottom: subtitle ? '12px' : 0, letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
