import { useState, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const PasswordInput = forwardRef(function PasswordInput(
  { label, error, hint, id, ...props },
  ref
) {
  const [show, setShow] = useState(false)

  return (
    <div>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          ref={ref}
          id={id}
          type={show ? 'text' : 'password'}
          className={['form-input', error ? 'error' : ''].filter(Boolean).join(' ')}
          style={{ paddingRight: '44px' }}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            borderRadius: '4px',
            transition: 'color var(--transition)',
          }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  )
})

export default PasswordInput
