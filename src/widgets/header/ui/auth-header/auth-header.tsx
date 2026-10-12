import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'
import { CrossIcon } from '@/shared/assets/icons'
import { Logo } from '@/shared/ui/logo'
import { Button } from '@/shared/ui/button'

import styles from './auth-header.module.css'

export const AuthHeader = () => {
  const navigate = useNavigate()

  const handleClose = () => {
    const historyState = window.history.state as { idx?: number } | null

    if (typeof historyState?.idx === 'number' && historyState.idx > 0) {
      navigate(-1)
    } else {
      navigate(ROUTES.HOME, { replace: true })
    }
  }

  return (
    <header className={styles.header}>
      <Logo />

      <Button type="button" variant="tertiary" rightIcon={<CrossIcon />} onClick={handleClose}>
        Закрыть
      </Button>
    </header>
  )
}
