import type { AppNotification } from '@/entities/notification'

export interface NotificationToastProps {
  notification: AppNotification
  onClose: () => void
  onNavigate: () => void
}
