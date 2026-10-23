import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  clearDraft,
  getFirstIncompleteStep,
  loadDraft,
  type RegistrationStep,
} from '@/features/registration'
import { ROUTES } from '@/shared/lib/constants'
import { LightBulbIcon, SchoolBoardIcon, UserInfoIcon } from '@/shared/assets/icons'
import { RegistrationSteps } from '@/widgets/registration-steps'
import { AuthFrame } from '@/shared/ui/auth-frame'
import styles from './register-page.module.css'

const STEPS: {
  step: RegistrationStep
  path: string
  Illustration: typeof LightBulbIcon
  title: string
  text: string
}[] = [
  {
    step: 'account',
    path: ROUTES.REGISTER_ACCOUNT,
    Illustration: LightBulbIcon,
    title: 'Добро пожаловать в SkillSwap!',
    text: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
  },
  {
    step: 'user',
    path: ROUTES.REGISTER_USER,
    Illustration: UserInfoIcon,
    title: 'Расскажите немного о себе',
    text: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  {
    step: 'skill',
    path: ROUTES.REGISTER_SKILL,
    Illustration: SchoolBoardIcon,
    title: 'Укажите, чем вы готовы поделиться',
    text: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
  },
]

export default function RegisterPage() {
  const { pathname } = useLocation()

  useEffect(() => {
    return () => {
      if (!window.location.pathname.startsWith(ROUTES.REGISTER)) clearDraft()
    }
  }, [])

  const currentIndex = STEPS.findIndex((item) => item.path === pathname)
  const firstIncomplete = getFirstIncompleteStep(loadDraft())
  const allowedIndex = STEPS.findIndex((item) => item.step === firstIncomplete)

  if (currentIndex === -1 || currentIndex > allowedIndex) {
    return <Navigate to={STEPS[allowedIndex].path} replace />
  }

  const { Illustration, title, text } = STEPS[currentIndex]

  return (
    <div className={styles.page}>
      <h1 className="visually-hidden">Регистрация</h1>
      <RegistrationSteps step={currentIndex + 1} total={STEPS.length} />
      <AuthFrame illustration={<Illustration />} title={title} text={text}>
        <Outlet />
      </AuthFrame>
    </div>
  )
}
