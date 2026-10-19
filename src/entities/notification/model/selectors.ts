import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

const selectItems = (state: RootState) => state.notifications.items
const selectUserId = (_state: RootState, userId: string | undefined) => userId

const selectUserNotifications = createSelector([selectItems, selectUserId], (items, userId) =>
  items
    .filter((notification) => notification.userId === userId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
)

export const selectUnreadNotifications = createSelector([selectUserNotifications], (items) =>
  items.filter((notification) => !notification.isRead),
)

export const selectReadNotifications = createSelector([selectUserNotifications], (items) =>
  items.filter((notification) => notification.isRead),
)

export const selectHasUnread = (state: RootState, userId: string | undefined) =>
  selectUnreadNotifications(state, userId).length > 0
