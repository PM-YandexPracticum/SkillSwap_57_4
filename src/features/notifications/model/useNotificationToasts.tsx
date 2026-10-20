import { useEffect } from 'react'
import { toast } from 'sonner'
import { selectUnreadNotifications } from '@/entities/notification'
import { selectUser } from '@/entities/session'
import { useAppSelector } from '@/store/hooks'
import { loadShownToastIds, saveShownToastIds } from './shown-toasts-storage'
import { NotificationToast } from '../ui/notification-toast/notification-toast'

/**
 * Показывает всплывашки о действиях других людей (incoming и accepted) - каждое
 * непрочитанное уведомление один раз за вкладку, и после перезагрузки тоже: после входа - моки,
 * потом каждое новое.
 * Свои предложения (sent) не всплывают: о них уже сообщило окно "Вы предложили обмен"
 */
export function useNotificationToasts(onNavigate: () => void) {
  const authUser = useAppSelector(selectUser)
  const unread = useAppSelector((state) => selectUnreadNotifications(state, authUser?.id))

  useEffect(() => {
    const shownIds = loadShownToastIds()
    const fresh = unread.filter(
      (notification) => notification.kind !== 'sent' && !shownIds.has(notification.id),
    )
    if (fresh.length === 0) return

    fresh.forEach((notification) => shownIds.add(notification.id))
    saveShownToastIds(shownIds)

    fresh.forEach((notification) => {
      toast.custom(
        (toastId) => (
          <NotificationToast
            notification={notification}
            onClose={() => toast.dismiss(toastId)}
            onNavigate={() => {
              toast.dismiss(toastId)
              onNavigate()
            }}
          />
        ),
        { id: notification.id },
      )
    })
  }, [unread, onNavigate])
}
