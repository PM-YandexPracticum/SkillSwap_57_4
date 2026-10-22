import { CrossIcon, IdeaIcon } from '@/shared/assets/icons'
import { IconButton } from '@/shared/ui/icon-button'
import type { NotificationToastProps } from './types'
import styles from './notification-toast.module.css'

export const NotificationToast = ({
  notification,
  onClose,
  onNavigate,
}: NotificationToastProps) => {
  return (
    <div className={styles.toast}>
      <IdeaIcon className={styles.icon} aria-hidden="true" />
      <p className={styles.title}>{notification.title}</p>
      <IconButton
        className={styles.close}
        icon={<CrossIcon />}
        aria-label="Закрыть уведомление"
        onClick={onClose}
      />
      <button className={styles.go} type="button" onClick={onNavigate}>
        Перейти
      </button>
    </div>
  )
}
