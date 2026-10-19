import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { subDays } from 'date-fns'
import { generateId } from '@/shared/lib/helpers'
import { MOCK_NOTIFICATIONS } from './mock-notifications'
import { loadNotifications, type StoredNotifications } from './notifications-storage'
import type { AppNotification } from './types'

type AddNotificationPayload = Pick<AppNotification, 'userId' | 'kind' | 'title' | 'description'>

type SeedNotificationsPayload = {
  userId: string
  now: string
}

type PreparedSeedNotifications = {
  userId: string
  items: AppNotification[]
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
      prepare: ({ userId, kind, title, description }: AddNotificationPayload) => ({
        payload: {
          id: generateId(),
          userId,
          kind,
          title,
          description,
          createdAt: new Date().toISOString(),
          isRead: false,
        },
      }),
    },
    seedNotifications: {
      reducer: (state, action: PayloadAction<PreparedSeedNotifications>) => {
        const { userId, items } = action.payload

        if (state.seededUserIds.includes(userId)) {
          return
        }

        state.items.push(...items)
        state.seededUserIds.push(userId)
      },
      prepare: ({ userId, now }: SeedNotificationsPayload) => {
        const currentDate = new Date(now)
        const items = MOCK_NOTIFICATIONS.map(({ daysAgo, ...notification }) => ({
          ...notification,
          id: generateId(),
          userId,
          createdAt: subDays(currentDate, daysAgo).toISOString(),
        }))

        return { payload: { userId, items } }
      },
    },
    markAllRead: (state, action: PayloadAction<string>) => {
      state.items.forEach((notification) => {
        if (notification.userId === action.payload) {
          notification.isRead = true
        }
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
