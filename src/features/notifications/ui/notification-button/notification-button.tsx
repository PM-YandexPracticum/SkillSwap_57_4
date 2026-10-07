import { NotificationIcon } from '@/shared/assets/icons'
import { IconButton } from '@/shared/ui/icon-button'
import type { NotificationButtonProps } from './types'
import styles from './notification-button.module.css'

export const NotificationButton = ({ hasUnread = false, onClick }: NotificationButtonProps) => {
  const label = hasUnread ? 'Уведомления, есть непрочитанные' : 'Уведомления'

  return (
    <IconButton
      icon={
        <>
          <NotificationIcon />
          {hasUnread && <span className={styles.dot} />}
        </>
      }
      aria-label={label}
      onClick={onClick}
    />
  )
}
