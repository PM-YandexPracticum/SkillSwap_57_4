import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fetchSkillCategories } from '@/api/skills'
import { setupStore } from '@/store'
import { loadSkillCategories } from './skill-categories-slice'
import { selectSkillCategories, selectSkillCategoriesStatus, selectSkillCategoriesError } from './selectors'
import type { SkillCategory } from '@/shared/types'

vi.mock('@/api/skills', () => ({
  fetchSkillCategories: vi.fn(),
}))

const categories: SkillCategory[] = [
  { id: 'creativity', name: 'Творчество', subcategories: [] },
]

describe('skillCategoriesSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('данные сохраняются после загрузки', async () => {
    vi.mocked(fetchSkillCategories).mockResolvedValue(categories)
    const store = setupStore()

    await store.dispatch(loadSkillCategories())

    expect(selectSkillCategories(store.getState())).toEqual(categories)
    expect(selectSkillCategoriesStatus(store.getState())).toBe('succeeded')
  })

  test('при ошибке статус failed и текст ошибки в состоянии', async () => {
    vi.mocked(fetchSkillCategories).mockRejectedValue(new Error('Network error'))
    const store = setupStore()

    await store.dispatch(loadSkillCategories())

    expect(selectSkillCategoriesStatus(store.getState())).toBe('failed')
    expect(selectSkillCategoriesError(store.getState())).toBe('Network error')
  })

  test('повторный loadSkillCategories не вызывает fetchSkillCategories второй раз', async () => {
    vi.mocked(fetchSkillCategories).mockResolvedValue(categories)
    const store = setupStore()

    await store.dispatch(loadSkillCategories())
    await store.dispatch(loadSkillCategories())

    expect(vi.mocked(fetchSkillCategories)).toHaveBeenCalledTimes(1)
  })
})