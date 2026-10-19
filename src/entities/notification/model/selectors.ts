import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

export const selectItems = (state: RootState) => state.notifications.items
export const selectUserId = (_state: RootState, userId: string) => userId

export const selectUserNotifications = createSelector(
  [selectItems, selectUserId],
  (items, userId) =>
    items
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
)

export const selectUnreadNotifications = createSelector([selectUserNotifications], (items) =>
  items.filter((notification) => !notification.isRead),
)

export const selectReadNotifications = createSelector([selectUserNotifications], (items) =>
  items.filter((notification) => notification.isRead),
)

export const selectHasUnread = createSelector(
  [selectUnreadNotifications],
  (notifications) => notifications.length > 0,
)
