import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, hint, id, className = '', wrapperClassName = '', ...props },
  ref
) {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={['form-input', error ? 'error' : '', className].filter(Boolean).join(' ')}
        {...props}
      />
      {error && <p className="form-error" role="alert">{error}</p>}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  )
})

export default Input
