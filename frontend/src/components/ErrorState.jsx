import { AlertCircle } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ message, onRetry }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: '16px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(239,68,68,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#EF4444',
        }}
      >
        <AlertCircle size={24} />
      </div>
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>Something went wrong</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{message || 'Please try again.'}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>Try again</Button>
      )}
    </div>
  )
}
