import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { AppNotification, NotificationKind } from './types'

export interface StoredNotifications {
  items: AppNotification[]
  seededUserIds: string[]
}

const EMPTY: StoredNotifications = {
  items: [],
  seededUserIds: [],
}

const createEmptyNotifications = (): StoredNotifications => ({
  items: [...EMPTY.items],
  seededUserIds: [...EMPTY.seededUserIds],
})

const isNotificationKind = (value: unknown): value is NotificationKind =>
  value === 'incoming' || value === 'sent' || value === 'accepted'

const isAppNotification = (value: unknown): value is AppNotification => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const notification = value as Record<string, unknown>

  return (
    typeof notification.id === 'string' &&
    typeof notification.userId === 'string' &&
    isNotificationKind(notification.kind) &&
    typeof notification.title === 'string' &&
    (notification.description === undefined || typeof notification.description === 'string') &&
    typeof notification.createdAt === 'string' &&
    typeof notification.isRead === 'boolean'
  )
}

const isStoredNotifications = (value: unknown): value is StoredNotifications => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const notifications = value as Record<string, unknown>

  return (
    Array.isArray(notifications.items) &&
    notifications.items.every(isAppNotification) &&
    Array.isArray(notifications.seededUserIds) &&
    notifications.seededUserIds.every((id) => typeof id === 'string')
  )
}

export const loadNotifications = (): StoredNotifications => {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS) ?? 'null',
    )
    return isStoredNotifications(parsed) ? parsed : createEmptyNotifications()
  } catch {
    return createEmptyNotifications()
  }
}

export const saveNotifications = (notifications: StoredNotifications): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
  } catch {
    return
  }
}
