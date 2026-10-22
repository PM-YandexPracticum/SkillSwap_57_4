import { describe, expect, beforeEach, vi, afterEach, test } from 'vitest'
import { loadFavorites, saveFavorites } from './favorites-storage'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

describe('favorites-storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('loadFavorites', () => {
    test('возвращает пустой объект, если данных нет', () => {
      expect(loadFavorites()).toEqual({})
    })

    test.each([
      ['не JSON', 'invalid json {'],
      ['массив вместо объекта', JSON.stringify([['user-02']])],
      ['null', 'null'],
      ['список не из строк', JSON.stringify({ user1: [1, 2, 3] })],
      ['строка вместо списка', JSON.stringify({ user1: 'target' })],
    ])('возвращает пустой объект, если данные %s', (_, invalidData) => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, invalidData)
      expect(loadFavorites()).toEqual({})
    })

    test('корректно читает валидные данные', () => {
      const data = { user1: ['target1', 'target2'] }
      localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(data))
      expect(loadFavorites()).toEqual(data)
    })
  })

  describe('saveFavorites', () => {
    test('сохраняет данные в localStorage по ключу LOCAL_STORAGE_KEYS.FAVORITES', () => {
      const data = { user1: ['target1'] }
      saveFavorites(data)
      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)).toBe(JSON.stringify(data))
      expect(loadFavorites()).toEqual(data)
    })

    test('не падает, если при записи возникает ошибка', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      expect(() => saveFavorites({ user1: ['target1'] })).not.toThrow()
    })
  })
})
