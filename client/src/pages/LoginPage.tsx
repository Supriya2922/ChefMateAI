import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/http'
import { useAuth } from '../auth/AuthContext'
import { AuthLayout, Field, FormError } from '../components/AuthLayout'
import { auth } from '../content/siteCopy'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors([])
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setErrors(error instanceof ApiError ? error.errors : ['Unable to sign in.'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title={auth.login.title}
      subtitle={auth.login.subtitle}
      footer={
        <>
          {auth.login.footerLead} <Link to="/register">{auth.login.footerLink}</Link>
        </>
      }
    >
      <form className="auth__form" onSubmit={onSubmit}>
        <FormError messages={errors} />
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
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />
        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? auth.login.submitting : auth.login.submit}
        </button>
      </form>
    </AuthLayout>
  )
}
