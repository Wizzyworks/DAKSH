export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: '16px' }}>
      <div className="spinner spinner-dark" style={{ width: '32px', height: '32px', borderWidth: '3px' }} />
      <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{message}</p>
    </div>
  )
}
