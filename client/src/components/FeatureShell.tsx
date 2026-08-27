import { comingSoon, type SectionCopy } from '../content/siteCopy'
import { FeatureCard } from './FeatureCard'

type FeatureShellProps = {
  copy: SectionCopy
  showComingSoon?: boolean
}

export function FeatureShell({ copy, showComingSoon = true }: FeatureShellProps) {
  return (
    <main className="page">
      <header className="page__intro">
        <p className="page__eyebrow">{copy.eyebrow}</p>
        <div className="page__title-row">
          <h1 className="page__title">{copy.title}</h1>
          {showComingSoon ? <span className="badge badge--soon">{comingSoon}</span> : null}
        </div>
        <p className="page__lede">{copy.lede}</p>
      </header>

      <section className="feature-grid" aria-label={copy.title}>
        {copy.features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </section>
    </main>
  )
}
