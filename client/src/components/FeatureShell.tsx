import { comingSoon, type SectionCopy } from '../content/siteCopy'
import { FeatureCard } from './FeatureCard'
import { PageIntro, PageIntroTitle } from './motion/PageIntro'
import { StaggerGrid } from './motion/StaggerGrid'

type FeatureShellProps = {
  copy: SectionCopy
  showComingSoon?: boolean
}

export function FeatureShell({ copy, showComingSoon = true }: FeatureShellProps) {
  return (
    <main className="page">
      <PageIntro
        eyebrow={copy.eyebrow}
        title={
          <>
            <PageIntroTitle>{copy.title}</PageIntroTitle>
            {showComingSoon ? <span className="badge badge--soon">{comingSoon}</span> : null}
          </>
        }
        lede={copy.lede}
        titleRow
      />

      <StaggerGrid className="feature-grid" aria-label={copy.title}>
        {copy.features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </StaggerGrid>
    </main>
  )
}
