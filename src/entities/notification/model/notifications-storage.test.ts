import { beforeEach, describe, expect, test, vi } from 'vitest'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { loadNotifications, saveNotifications } from './notifications-storage'
import type { StoredNotifications } from './notifications-storage'

const validNotification = {
  id: '1',
  userId: 'user-1',
  kind: 'incoming' as const,
  title: 'Test',
  createdAt: '2026-01-01T00:00:00.000Z',
  isRead: false,
}

describe('notifications-storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('loadNotifications', () => {
    test('без данных - пустое состояние', () => {
      expect(loadNotifications()).toEqual({ items: [], seededUserIds: [] })
    })

    test('читает записанное saveNotifications', () => {
      const data: StoredNotifications = {
        items: [validNotification],
        seededUserIds: ['user-1'],
      }
      saveNotifications(data)
      expect(loadNotifications()).toEqual(data)
    })

    test('читает уведомление без description', () => {
      const data = { items: [validNotification], seededUserIds: [] }
      localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(data))
      expect(loadNotifications()).toEqual(data)
    })

    test.each([
      ['не JSON', 'not-json'],
      ['массив', '[]'],
      ['items не массив', '{"items":{},"seededUserIds":[]}'],
      ['нет seededUserIds', '{"items":[]}'],
      ['seededUserIds не из строк', '{"items":[],"seededUserIds":[1,2]}'],
      [
        'неизвестный kind',
        '{"items":[{"id":"1","userId":"u","kind":"unknown","title":"t","createdAt":"d","isRead":false}],"seededUserIds":[]}',
      ],
      [
        'нет isRead',
        '{"items":[{"id":"1","userId":"u","kind":"incoming","title":"t","createdAt":"d"}],"seededUserIds":[]}',
      ],
    ])('испорченные данные (%s) - пустое состояние', (_, raw) => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, raw)
      expect(loadNotifications()).toEqual({ items: [], seededUserIds: [] })
    })
  })

  describe('saveNotifications', () => {
    test('сохраняет данные в localStorage', () => {
      const data: StoredNotifications = { items: [validNotification], seededUserIds: ['u'] }
      saveNotifications(data)
      expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS) ?? '')).toEqual(
        data,
      )
    })

    test('не падает, если запись не удалась', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceeded')
      })
      expect(() => saveNotifications({ items: [], seededUserIds: [] })).not.toThrow()
    })
  })
})