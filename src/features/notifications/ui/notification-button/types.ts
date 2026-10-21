import type { IconButtonProps } from '@/shared/ui/icon-button'

export interface NotificationButtonProps extends Omit<IconButtonProps, 'icon' | 'aria-label'> {
  hasUnread?: boolean
}
