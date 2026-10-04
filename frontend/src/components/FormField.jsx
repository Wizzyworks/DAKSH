export default function FormField({ label, error, hint, children, id, required }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span style={{ color: '#EF4444', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      {children}
      {error && <p className="form-error" role="alert">{error}</p>}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  )
}
