import type { AppNotification } from '@/entities/notification'

export interface NotificationsPanelProps {
  /** После нажатия "Перейти" */
  onNavigate: () => void
  id?: string
  className?: string
}

export interface NotificationsGroupProps {
  title: string
  actionLabel: string
  onAction: () => void
  notifications: AppNotification[]
  /** Есть только у новых уведомлений: под каждым выводится кнопка "Перейти" */
  onNavigate?: () => void
}
