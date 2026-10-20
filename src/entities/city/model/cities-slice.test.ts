import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fetchCities } from '@/api/cities'
import { setupStore } from '@/store'
import { loadCities } from './cities-slice'
import { selectCities, selectCitiesStatus } from './selectors'
import type { City } from '@/shared/types'

vi.mock('@/api/cities', () => ({
  fetchCities: vi.fn(),
}))

const cities: City[] = [{ id: 'moscow', name: 'Москва' }]

describe('citiesSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('данные сохраняются после загрузки', async () => {
    vi.mocked(fetchCities).mockResolvedValue(cities)
    const store = setupStore()

    await store.dispatch(loadCities())

    expect(selectCities(store.getState())).toEqual(cities)
    expect(selectCitiesStatus(store.getState())).toBe('succeeded')
  })

  test('при ошибке статус failed и текст ошибки в состоянии', async () => {
    vi.mocked(fetchCities).mockRejectedValue(new Error('Network error'))
    const store = setupStore()

    await store.dispatch(loadCities())

    expect(selectCitiesStatus(store.getState())).toBe('failed')
    expect(store.getState().cities.error).toBe('Network error')
  })

  test('повторный loadCities не вызывает fetchCities второй раз', async () => {
    vi.mocked(fetchCities).mockResolvedValue(cities)
    const store = setupStore()

    await store.dispatch(loadCities())
    await store.dispatch(loadCities())

    expect(vi.mocked(fetchCities)).toHaveBeenCalledTimes(1)
  })
})
