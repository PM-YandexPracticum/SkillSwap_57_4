import { describe, it, expect, beforeEach, vi, afterEach, test } from 'vitest'
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
    it('returns empty object when no data', () => {
      expect(loadFavorites()).toEqual({})
    })

    test.each([
      ['not JSON', 'invalid json {'],
      ['array instead of object', '["user1"]'],
      ['null', 'null'],
      ['list of not strings', JSON.stringify({ user1: [1, 2, 3] })],
      ['string instead of list', JSON.stringify({ user1: 'target' })],
    ])('returns empty object when data is %s', (_: string, invalidData: string) => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, invalidData)
      expect(loadFavorites()).toEqual({})
    })

    it('reads valid data correctly', () => {
      const data = { user1: ['target1', 'target2'] }
      localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(data))
      expect(loadFavorites()).toEqual(data)
    })
  })

  describe('saveFavorites', () => {
    it('saves data to localStorage and can be loaded back', () => {
      const data = { user1: ['target1'] }
      saveFavorites(data)
      expect(loadFavorites()).toEqual(data)
    })

    it('does not crash if setting item throws an error', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })
      
      expect(() => saveFavorites({ user1: ['target1'] })).not.toThrow()
    })
  })
})