import { ROUTES } from '@/shared/lib/constants'
import { Link } from 'react-router-dom'
import { LogoIcon } from '@/shared/assets/icons'
import Styles from './logo.module.css'

export const LogoUI = () => {
  return (
    <Link to={ROUTES.HOME} className={Styles.logo} aria-label="SkillSwap - на главную">
      <LogoIcon aria-hidden="true" />
      <span className={Styles.logo__title}>SkillSwap</span>
    </Link>
  )
}
