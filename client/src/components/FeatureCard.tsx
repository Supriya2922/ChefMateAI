import { Link } from 'react-router-dom'

type FeatureCardProps = {
  title: string
  description: string
  to?: string
}

export function FeatureCard({ title, description, to }: FeatureCardProps) {
  const body = (
    <>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__description">{description}</p>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="feature-card feature-card--link">
        {body}
      </Link>
    )
  }

  return <article className="feature-card">{body}</article>
}
