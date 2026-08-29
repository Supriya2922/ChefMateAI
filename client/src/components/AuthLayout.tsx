import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { auth, brand } from '../content/siteCopy'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '../motion/variants'
import { pageTransition } from '../motion/transitions'
import { FloatingVegScene } from './veg/FloatingVegScene'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  const reduced = useReducedMotion()
  const container = reduced ? undefined : staggerContainer
  const item = reduced ? undefined : staggerItem
  const cardVariants = reduced ? fadeUp : scaleIn
  const transition = reduced ? { duration: 0 } : pageTransition

  return (
    <div className="auth">
      <section className="auth__atmosphere" aria-hidden="true">
        <FloatingVegScene />
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.p className="auth__eyebrow" variants={item} transition={transition}>
            {auth.eyebrow}
          </motion.p>
          <motion.h1 className="auth__headline" variants={item} transition={transition}>
            {auth.headline}
          </motion.h1>
          <motion.p className="auth__lede" variants={item} transition={transition}>
            {auth.lede}
          </motion.p>
        </motion.div>
      </section>

      <section className="auth__panel">
        <motion.div
          className="auth__card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ ...transition, delay: reduced ? 0 : 0.15 }}
        >
          <p className="auth__brand">
            <Link to="/login">{brand.name}</Link>
          </p>
          <h2 className="auth__title">{title}</h2>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
          <p className="auth__footer">{footer}</p>
        </motion.div>
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
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="form-error"
      role="alert"
      initial={false}
      animate={
        messages.length > 0
          ? { opacity: 1, height: 'auto' }
          : { opacity: 0, height: 0, marginTop: 0 }
      }
      transition={reduced ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
      style={{ overflow: 'hidden' }}
    >
      {messages.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </motion.div>
  )
}
