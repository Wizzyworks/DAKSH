import { motion, AnimatePresence } from 'framer-motion'
import OnboardingField from './OnboardingField'

const variants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
}

export default function OnboardingStep({ step, direction, values, onChange, errors }) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={step.id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.28, ease: 'easeInOut' }}
      >
        {step.description && (
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
            {step.description}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {step.fields.map(field => (
            <OnboardingField
              key={field.id}
              config={field}
              value={values[field.id]}
              onChange={(val) => onChange(field.id, val)}
              error={errors?.[field.id]}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
