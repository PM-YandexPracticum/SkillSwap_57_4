import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { SESSION_STORAGE_KEYS } from '@/shared/lib/constants'
import { loadShownToastIds, saveShownToastIds } from './shown-toasts-storage'

describe('[shown-toasts-storage]', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('без данных - пустой набор', () => {
    expect(loadShownToastIds()).toEqual(new Set())
  })

  test('saveShownToastIds записывает набор массивом, loadShownToastIds читает его обратно', () => {
    saveShownToastIds(new Set(['user-01-mock-0', 'user-01-mock-1']))

    expect(sessionStorage.getItem(SESSION_STORAGE_KEYS.SHOWN_TOASTS)).toBe(
      '["user-01-mock-0","user-01-mock-1"]',
    )

    expect(loadShownToastIds()).toEqual(new Set(['user-01-mock-0', 'user-01-mock-1']))
  })

  test.each([
    ['не JSON', '{не JSON :)'],
    ['не массив', '{"id": "user-01-mock-0"}'],
    ['массив не из строк', '[1, 2]'],
  ])('испорченные данные (%s) - пустой набор', (_, raw) => {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.SHOWN_TOASTS, raw)

    expect(loadShownToastIds()).toEqual(new Set())
  })

  test('saveShownToastIds не падает, если записать не удалось', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    expect(() => saveShownToastIds(new Set(['user-01-mock-0']))).not.toThrow()
  })
})
