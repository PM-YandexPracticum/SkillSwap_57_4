import { useEffect, useReducer, useRef } from 'react'
import { toast } from 'sonner'
import { selectUnreadNotifications } from '@/entities/notification'
import { selectUser } from '@/entities/session'
import { useAppSelector } from '@/store/hooks'
import { loadShownToastIds, saveShownToastIds } from './shown-toasts-storage'
import { NotificationToast } from '../ui/notification-toast/notification-toast'

export const MAX_VISIBLE_TOASTS = 2
export const TOAST_STAGGER = 1000

/**
 * Показывает всплывашки о действиях других людей (incoming и accepted) - каждое
 * непрочитанное уведомление один раз за вкладку, и после перезагрузки тоже: после входа - моки,
 * потом каждое новое. На экране не больше MAX_VISIBLE_TOASTS, следующая всплывает, когда одна закрылась.
 * Свои предложения (sent) не всплывают: о них уже сообщило окно "Вы предложили обмен"
 */
export function useNotificationToasts(onNavigate: () => void) {
  const authUser = useAppSelector(selectUser)
  const unread = useAppSelector((state) => selectUnreadNotifications(state, authUser?.id))

  const visibleIdsRef = useRef<string[]>([])
  const lastShownAtRef = useRef(0)
  const [queueTick, nextQueueTick] = useReducer((tick: number) => tick + 1, 0)

  useEffect(() => {
    if (visibleIdsRef.current.length >= MAX_VISIBLE_TOASTS) return

    const shownIds = loadShownToastIds()

    const next = unread.find(
      (notification) => notification.kind !== 'sent' && !shownIds.has(notification.id),
    )
    if (!next) return

    const handleToastClose = () => {
      visibleIdsRef.current = visibleIdsRef.current.filter((id) => id !== next.id)
      nextQueueTick()
    }

    const showToast = () => {
      shownIds.add(next.id)
      saveShownToastIds(shownIds)
      visibleIdsRef.current = [...visibleIdsRef.current, next.id]
      lastShownAtRef.current = Date.now()

      toast.custom(
        (toastId) => (
          <NotificationToast
            notification={next}
            onClose={() => toast.dismiss(toastId)}
            onNavigate={() => {
              toast.dismiss(toastId)
              onNavigate()
            }}
          />
        ),
        { id: next.id, onDismiss: handleToastClose, onAutoClose: handleToastClose },
      )
      nextQueueTick()
    }

    const delay = lastShownAtRef.current + TOAST_STAGGER - Date.now()
    if (delay <= 0) {
      showToast()
      return
    }

    const timeoutId = setTimeout(showToast, delay)
    return () => clearTimeout(timeoutId)
  }, [unread, queueTick, onNavigate])
}
