import { Link } from 'react-router-dom'

import { LoginForm } from '@/features/auth'
import { ROUTES } from '@/shared/lib/constants'
import { LightBulbIcon } from '@/shared/assets/icons'
import { AuthFrame } from '@/shared/ui/auth-frame'
import { SocialAuth } from '@/shared/ui/social-auth'

import styles from './login-page.module.css'

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Вход</h1>
      <AuthFrame
        illustration={<LightBulbIcon />}
        title="С возвращением в SkillSwap!"
        text="Обменивайтесь знаниями и навыками с другими людьми"
      >
        <SocialAuth />
        <div className={styles.form}>
          <LoginForm />
          <Link to={ROUTES.REGISTER} replace className={styles.registerLink}>
            Зарегистрироваться
          </Link>
        </div>
      </AuthFrame>
    </div>
  )
}
