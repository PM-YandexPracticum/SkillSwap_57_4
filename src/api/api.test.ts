import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { fetchCities } from './cities'
import { fetchSkillCategories } from './skills'
import { fetchUsers } from './users'

const mockFetch = (body: unknown, ok = true) => {
  const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok,
    json: () => Promise.resolve(body),
  } as Response)
  return spy
}

describe('api', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchUsers', () => {
    test('возвращает данные и запрашивает нужный файл', async () => {
      const users = [{ id: '1', name: 'Test' }]
      const spy = mockFetch(users)

      const result = await fetchUsers()

      expect(spy).toHaveBeenCalledWith('/db/users.json')
      expect(result).toEqual(users)
    })

    test('при неуспешном ответе выбрасывает ошибку', async () => {
      mockFetch([], false)
      await expect(fetchUsers()).rejects.toThrow('Failed to fetch users')
    })
  })

  describe('fetchSkillCategories', () => {
    test('возвращает данные и запрашивает нужный файл', async () => {
      const categories = [{ id: 'creativity', name: 'Творчество' }]
      const spy = mockFetch(categories)

      const result = await fetchSkillCategories()

      expect(spy).toHaveBeenCalledWith('/db/skills.json')
      expect(result).toEqual(categories)
    })

    test('при неуспешном ответе выбрасывает ошибку', async () => {
      mockFetch([], false)
      await expect(fetchSkillCategories()).rejects.toThrow('Failed to fetch skill categories')
    })
  })

  describe('fetchCities', () => {
    test('возвращает данные и запрашивает нужный файл', async () => {
      const cities = [{ id: 'moscow', name: 'Москва' }]
      const spy = mockFetch(cities)

      const result = await fetchCities()

      expect(spy).toHaveBeenCalledWith('/db/cities.json')
      expect(result).toEqual(cities)
    })

    test('при неуспешном ответе выбрасывает ошибку', async () => {
      mockFetch([], false)
      await expect(fetchCities()).rejects.toThrow('Failed to fetch cities')
    })
  })
})