import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ProfileForm } from '../components/ProfileForm'
import { PageIntro, PageIntroTitle } from '../components/motion/PageIntro'
import { ScreenLoader } from '../components/ScreenLoader'
import { profilePage } from '../content/siteCopy'
import { useMotionVariants } from '../hooks/useReducedMotion'
import { fadeUp } from '../motion/variants'
import { pageTransition } from '../motion/transitions'

export function ProfilePage() {
  const { profile, refreshProfile } = useAuth()
  const panelVariants = useMotionVariants(fadeUp)

  if (!profile) {
    return <ScreenLoader />
  }

  return (
    <main className="page page--narrow">
      <PageIntro
        eyebrow={<Link to="/dashboard">{profilePage.backLabel}</Link>}
        title={<PageIntroTitle>{profilePage.title}</PageIntroTitle>}
        lede={profilePage.lede}
      />

      <motion.div
        className="panel"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        transition={pageTransition}
      >
        <ProfileForm profile={profile} onSaved={() => refreshProfile()} />
      </motion.div>
    </main>
  )
}
