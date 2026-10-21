import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { setupStore, store as appStore } from '@/store'
import { addNotification, seedNotifications, markAllRead, clearRead } from './notifications-slice'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
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

const NOW = '2026-01-10T12:00:00.000Z'
const DAY = 24 * 60 * 60 * 1000

describe('notifications-slice', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-01-10T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('addNotification добавляет с id, датой и isRead: false', () => {
    const store = setupStore()
    store.dispatch(addNotification({ userId: 'user-1', kind: 'incoming', title: 'Test' }))

    const items = store.getState().notifications.items
    expect(items).toHaveLength(1)
    expect(items[0].id).toBeTruthy()
    expect(items[0].createdAt).toBe('2026-01-10T12:00:00.000Z')
    expect(items[0].isRead).toBe(false)
  })

  test('у двух уведомлений разные id', () => {
    const store = setupStore()
    store.dispatch(addNotification({ userId: 'user-1', kind: 'incoming', title: 'A' }))
    store.dispatch(addNotification({ userId: 'user-1', kind: 'incoming', title: 'B' }))

    const items = store.getState().notifications.items
    expect(items[0].id).not.toBe(items[1].id)
  })

  test('seedNotifications добавляет 6 моков с правильными id, датами и isRead', () => {
    const store = setupStore()
    store.dispatch(seedNotifications({ userId: 'user-1', now: NOW }))

    const { items, seededUserIds } = store.getState().notifications
    expect(items).toHaveLength(6)
    expect(items.map((n) => n.id)).toEqual([
      'user-1-mock-0',
      'user-1-mock-1',
      'user-1-mock-2',
      'user-1-mock-3',
      'user-1-mock-4',
      'user-1-mock-5',
    ])
    expect(items.every((n) => n.userId === 'user-1')).toBe(true)
    expect(items.map((n) => (Date.parse(NOW) - Date.parse(n.createdAt)) / DAY)).toEqual([
      0, 0, 1, 10, 1, 2,
    ])
    expect(items.filter((n) => !n.isRead)).toHaveLength(4)
    expect(seededUserIds).toEqual(['user-1'])
  })

  test('повторный seedNotifications ничего не меняет', () => {
    const store = setupStore()
    store.dispatch(seedNotifications({ userId: 'user-1', now: NOW }))
    store.dispatch(seedNotifications({ userId: 'user-1', now: NOW }))

    expect(store.getState().notifications.items).toHaveLength(6)
  })

  test('другой пользователь получает свои моки', () => {
    const store = setupStore()
    store.dispatch(seedNotifications({ userId: 'user-1', now: NOW }))
    store.dispatch(seedNotifications({ userId: 'user-2', now: NOW }))

    const { items, seededUserIds } = store.getState().notifications
    expect(items.filter((n) => n.userId === 'user-2')).toHaveLength(6)
    expect(seededUserIds).toEqual(['user-1', 'user-2'])
  })

  test('markAllRead и clearRead меняют только уведомления этого пользователя', () => {
    const items = [
      createNotification({ id: '1', userId: 'user-1', isRead: false }),
      createNotification({ id: '2', userId: 'user-1', isRead: true }),
      createNotification({ id: '3', userId: 'user-2', isRead: false }),
      createNotification({ id: '4', userId: 'user-2', isRead: true }),
    ]
    const store = setupStore({ notifications: { items, seededUserIds: [] } })

    store.dispatch(markAllRead('user-1'))
    expect(store.getState().notifications.items.find((n) => n.id === '1')?.isRead).toBe(true)
    expect(store.getState().notifications.items.find((n) => n.id === '3')?.isRead).toBe(false)

    store.dispatch(clearRead('user-1'))
    const remaining = store.getState().notifications.items
    expect(remaining.map((n) => n.id)).toEqual(['3', '4'])
  })

  test('store, созданный после записи в localStorage, читает уведомления оттуда', () => {
    const stored = { items: [createNotification({ id: 'stored' })], seededUserIds: [] }
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(stored))

    const store = setupStore()
    expect(store.getState().notifications.items).toHaveLength(1)
    expect(store.getState().notifications.items[0].id).toBe('stored')
  })

  test('изменения в store приложения сохраняются в localStorage', () => {
    appStore.dispatch(
      addNotification({ userId: 'user-persist', kind: 'incoming', title: 'Persist' }),
    )
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS) ?? '{}')
    expect(saved.items).toHaveLength(1)
    expect(saved.items[0].title).toBe('Persist')
  })
})
