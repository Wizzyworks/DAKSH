import { motion } from 'framer-motion'

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="card"
      style={{ padding: '28px', cursor: 'default' }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'var(--primary-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '18px',
          color: 'var(--primary)',
          flexShrink: 0,
        }}
      >
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', lineHeight: 1.3 }}>
        {title}
      </h3>
      <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--text-muted)' }}>
        {description}
      </p>
    </motion.div>
  )
}
