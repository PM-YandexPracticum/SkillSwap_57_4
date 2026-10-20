import { Toaster } from 'sonner'
import { useNotificationToasts } from '../../model/useNotificationToasts'
import type { NotificationToasterProps } from './types'

export const NotificationToaster = ({ onNavigate }: NotificationToasterProps) => {
  useNotificationToasts(onNavigate)

  return (
    <Toaster
      position="bottom-left"
      offset="var(--layout-padding)"
      visibleToasts={2}
      gap={28}
      expand
      containerAriaLabel="Уведомления"
      duration={10000}
    />
  )
}
