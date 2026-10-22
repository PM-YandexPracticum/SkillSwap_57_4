import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { subDays } from 'date-fns'
import { generateId } from '@/shared/lib/helpers'
import { MOCK_NOTIFICATIONS } from './mock-notifications'
import { loadNotifications, type StoredNotifications } from './notifications-storage'
import type { AppNotification } from './types'

type NewNotification = Pick<AppNotification, 'userId' | 'kind' | 'title' | 'description'>

type SeedNotificationsPayload = {
  userId: string
  now: string
}

const initialState = (): StoredNotifications => loadNotifications()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: {
      reducer: (state, action: PayloadAction<AppNotification>) => {
        state.items.push(action.payload)
      },
      prepare: (notification: NewNotification) => ({
        payload: {
          ...notification,
          id: generateId(),
          createdAt: new Date().toISOString(),
          isRead: false,
        },
      }),
    },
    seedNotifications: (state, action: PayloadAction<SeedNotificationsPayload>) => {
      const { userId, now } = action.payload

      if (state.seededUserIds.includes(userId)) return

      state.seededUserIds.push(userId)
      MOCK_NOTIFICATIONS.forEach(({ daysAgo, ...notification }, index) => {
        state.items.push({
          ...notification,
          id: `${userId}-mock-${index}`,
          userId,
          createdAt: subDays(new Date(now), daysAgo).toISOString(),
        })
      })
    },
    markAllRead: (state, action: PayloadAction<string>) => {
      state.items.forEach((notification) => {
        if (notification.userId === action.payload) notification.isRead = true
      })
    },
    clearRead: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (notification) => notification.userId !== action.payload || !notification.isRead,
      )
    },
  },
})

export const { addNotification, seedNotifications, markAllRead, clearRead } =
  notificationsSlice.actions
export const notificationsReducer = notificationsSlice.reducer
