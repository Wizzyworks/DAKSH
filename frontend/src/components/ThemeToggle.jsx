import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        background: 'var(--glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        transition: 'border-color 180ms ease, color 180ms ease, background-color 180ms ease',
        flexShrink: 0,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <motion.div
        key={theme}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </motion.div>
    </motion.button>
  )
}
