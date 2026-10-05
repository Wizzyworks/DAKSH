import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', loading = false, disabled = false, className = '', ...props },
  ref
) {
  const cls = [
    'btn',
    variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'btn-ghost',
    size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={cls}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="spinner" style={{ width: '16px', height: '16px' }} />}
      {children}
    </motion.button>
  )
})

export default Button
