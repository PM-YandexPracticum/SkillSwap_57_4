import { forwardRef } from 'react'
import { NotificationIcon } from '@/shared/assets/icons'
import { IconButton } from '@/shared/ui/icon-button'
import type { NotificationButtonProps } from './types'
import styles from './notification-button.module.css'

export const NotificationButton = forwardRef<HTMLButtonElement, NotificationButtonProps>(
  function NotificationButton({ hasUnread = false, ...props }, ref) {
    const label = hasUnread ? 'Уведомления, есть непрочитанные' : 'Уведомления'

    return (
      <IconButton
        {...props}
        ref={ref}
        icon={
          <>
            <NotificationIcon />
            {hasUnread && <span className={styles.dot} />}
          </>
        }
        aria-label={label}
      />
    )
  },
)
