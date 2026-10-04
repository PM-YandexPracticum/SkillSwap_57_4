import { ROUTES } from '@/shared/lib/constants'
import { Link } from 'react-router-dom'
import { LogoIcon } from '@/shared/assets/icons'
import styles from './logo.module.css'

export const Logo = () => {
  return (
    <Link to={ROUTES.HOME} className={styles.logo} aria-label="SkillSwap - на главную">
      <LogoIcon className={styles.icon} aria-hidden="true" />
      <span className={styles.title} aria-hidden="true">
        SkillSwap
      </span>
    </Link>
  )
}
