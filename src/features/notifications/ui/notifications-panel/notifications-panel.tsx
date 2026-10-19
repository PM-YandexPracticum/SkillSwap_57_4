import { useId } from 'react'
import clsx from 'clsx'
import {
  clearRead,
  markAllRead,
  selectReadNotifications,
  selectUnreadNotifications,
} from '@/entities/notification'
import { selectUser } from '@/entities/session'
import { IdeaIcon } from '@/shared/assets/icons'
import { formatRelativeDate } from '@/shared/lib/helpers'
import { Button } from '@/shared/ui/button'
import { Dropdown } from '@/shared/ui/dropdown'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { NotificationsGroupProps, NotificationsPanelProps } from './types'
import styles from './notifications-panel.module.css'

const NotificationsGroup = ({
  title,
  actionLabel,
  onAction,
  notifications,
  onNavigate,
}: NotificationsGroupProps) => {
  const titleId = useId()

  if (notifications.length === 0) return null

  return (
    <section className={styles.group} aria-labelledby={titleId}>
      <div className={styles.groupHeader}>
        <h2 id={titleId}>{title}</h2>
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      </div>

      <ul className={styles.list}>
        {notifications.map((notification) => (
          <li key={notification.id} className={styles.item}>
            <IdeaIcon className={styles.icon} aria-hidden="true" />
            <div className={styles.content}>
              <p className={styles.title}>{notification.title}</p>
              {notification.description && (
                <p className={styles.description}>{notification.description}</p>
              )}
            </div>
            <time className={styles.date} dateTime={notification.createdAt}>
              {formatRelativeDate(notification.createdAt)}
            </time>
            {onNavigate && (
              <Button className={styles.navigateButton} onClick={onNavigate}>
                Перейти
              </Button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export const NotificationsPanel = ({ onNavigate, id, className }: NotificationsPanelProps) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const unread = useAppSelector((state) => selectUnreadNotifications(state, user?.id))
  const read = useAppSelector((state) => selectReadNotifications(state, user?.id))

  const handleMarkAllRead = () => {
    if (user) dispatch(markAllRead(user.id))
  }

  const handleClearRead = () => {
    if (user) dispatch(clearRead(user.id))
  }

  const isEmpty = unread.length === 0 && read.length === 0

  return (
    <Dropdown id={id} className={clsx(styles.panel, className)}>
      {isEmpty ? (
        <p className={styles.empty}>У вас пока нет уведомлений</p>
      ) : (
        <>
          <NotificationsGroup
            title="Новые уведомления"
            actionLabel="Прочитать все"
            onAction={handleMarkAllRead}
            notifications={unread}
            onNavigate={onNavigate}
          />
          <NotificationsGroup
            title="Просмотренные"
            actionLabel="Очистить"
            onAction={handleClearRead}
            notifications={read}
          />
        </>
      )}
    </Dropdown>
  )
}
