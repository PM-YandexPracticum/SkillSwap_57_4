import type { ComponentType, SVGProps } from 'react'
import { useNavigate } from 'react-router-dom'
import { Error404Icon, Error500Icon } from '@/shared/assets/icons'
import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/button'
import type { ErrorCode, ErrorStateProps } from './types'
import styles from './error-state.module.css'

interface ErrorContent {
  image: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
}

const ERRORS: Record<ErrorCode, ErrorContent> = {
  404: {
    image: Error404Icon,
    title: 'Страница не найдена',
    description:
      'К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже',
  },
  500: {
    image: Error500Icon,
    title: 'На сервере произошла ошибка',
    description: 'Попробуйте позже или вернитесь на главную страницу',
  },
}

export const ErrorState = ({ code, onReport }: ErrorStateProps) => {
  const navigate = useNavigate()
  const { image: ErrorImage, title, description } = ERRORS[code]

  const handleHomeClick = () => {
    navigate(ROUTES.HOME)
  }

  return (
    <main className={styles.root}>
      <div className={styles.content}>
        <ErrorImage className={styles.image} aria-hidden="true" focusable="false" />
        <div className={styles.text}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" fullWidth onClick={onReport}>
            Сообщить об ошибке
          </Button>
          <Button fullWidth onClick={handleHomeClick}>
            На главную
          </Button>
        </div>
      </div>
    </main>
  )
}
