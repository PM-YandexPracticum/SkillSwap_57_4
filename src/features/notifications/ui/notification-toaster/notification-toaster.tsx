import { Toaster } from 'sonner'
import { MAX_VISIBLE_TOASTS, useNotificationToasts } from '../../model/useNotificationToasts'
import type { NotificationToasterProps } from './types'

export const NotificationToaster = ({ onNavigate }: NotificationToasterProps) => {
  useNotificationToasts(onNavigate)

  return (
    <Toaster
      position="bottom-left"
      offset="var(--layout-padding)"
      visibleToasts={MAX_VISIBLE_TOASTS}
      gap={28}
      expand
      containerAriaLabel="Уведомления"
      duration={5000}
    />
  )
}
