import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { auth, brand } from '../content/siteCopy'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="auth">
      <section className="auth__atmosphere" aria-hidden="true">
        <p className="auth__eyebrow">{auth.eyebrow}</p>
        <h1 className="auth__headline">{auth.headline}</h1>
        <p className="auth__lede">{auth.lede}</p>
      </section>

      <section className="auth__panel">
        <div className="auth__card">
          <p className="auth__brand">
            <Link to="/login">{brand.name}</Link>
          </p>
          <h2 className="auth__title">{title}</h2>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
          <p className="auth__footer">{footer}</p>
        </div>
      </section>
    </div>
  )
}

type FieldProps = {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  autoComplete?: string
  required?: boolean
}

export function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  required,
}: FieldProps) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field__label">{label}</span>
      <input
        id={id}
        className="field__input"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required={required}
      />
    </label>
  )
}

export function FormError({ messages }: { messages: string[] }) {
  if (messages.length === 0) {
    return null
  }

  return (
    <div className="form-error" role="alert">
      {messages.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </div>
  )
}
