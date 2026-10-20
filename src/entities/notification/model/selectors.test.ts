import { describe, expect, test } from 'vitest'
import { setupStore } from '@/store'
import { selectUnreadNotifications, selectReadNotifications, selectHasUnread } from './selectors'
import type { AppNotification } from './types'

const createNotification = (overrides: Partial<AppNotification> = {}): AppNotification => ({
  id: '1',
  userId: 'user-1',
  kind: 'incoming',
  title: 'Test',
  createdAt: '2026-01-01T00:00:00.000Z',
  isRead: false,
  ...overrides,
})

describe('notifications selectors', () => {
  test('selectUnreadNotifications и selectReadNotifications с userId - только его, новые сверху', () => {
    const items = [
      createNotification({ id: '1', userId: 'user-1', createdAt: '2026-01-01T00:00:00.000Z', isRead: false }),
      createNotification({ id: '2', userId: 'user-1', createdAt: '2026-01-02T00:00:00.000Z', isRead: true }),
      createNotification({ id: '3', userId: 'user-2', createdAt: '2026-01-03T00:00:00.000Z', isRead: false }),
    ]
    const store = setupStore({ notifications: { items, seededUserIds: [] } })

    const unread = selectUnreadNotifications(store.getState(), 'user-1')
    expect(unread.map((n) => n.id)).toEqual(['1'])

    const read = selectReadNotifications(store.getState(), 'user-1')
    expect(read.map((n) => n.id)).toEqual(['2'])
  })

  test('у гостя (undefined) - пусто', () => {
    const items = [createNotification({ userId: 'user-1' })]
    const store = setupStore({ notifications: { items, seededUserIds: [] } })

    expect(selectUnreadNotifications(store.getState(), undefined)).toEqual([])
    expect(selectReadNotifications(store.getState(), undefined)).toEqual([])
  })

  test('selectHasUnread - true, пока есть непрочитанные, false после прочтения и у гостя', () => {
    const items = [createNotification({ id: '1', userId: 'user-1', isRead: false })]
    const store = setupStore({ notifications: { items, seededUserIds: [] } })

    expect(selectHasUnread(store.getState(), 'user-1')).toBe(true)
    expect(selectHasUnread(store.getState(), undefined)).toBe(false)
  })
})