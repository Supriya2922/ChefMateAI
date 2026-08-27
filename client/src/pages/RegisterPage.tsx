import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/http'
import { useAuth } from '../auth/AuthContext'
import { AuthLayout, Field, FormError } from '../components/AuthLayout'
import { auth } from '../content/siteCopy'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors([])
    setSubmitting(true)
    try {
      await register({
        displayName,
        email,
        password,
        phoneNumber: phoneNumber.trim() || undefined,
      })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setErrors(
        error instanceof ApiError ? error.errors : ['Unable to create your account.'],
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title={auth.register.title}
      subtitle={auth.register.subtitle}
      footer={
        <>
          {auth.register.footerLead} <Link to="/login">{auth.register.footerLink}</Link>
        </>
      }
    >
      <form className="auth__form" onSubmit={onSubmit}>
        <FormError messages={errors} />
        <Field
          id="displayName"
          label="Name"
          value={displayName}
          onChange={setDisplayName}
          autoComplete="name"
          required
        />
        <Field
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <Field
          id="phoneNumber"
          label="Phone (optional)"
          type="tel"
          value={phoneNumber}
          onChange={setPhoneNumber}
          autoComplete="tel"
        />
        <Field
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
        />
        <p className="auth__hint">{auth.register.passwordHint}</p>
        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? auth.register.submitting : auth.register.submit}
        </button>
      </form>
    </AuthLayout>
  )
}
