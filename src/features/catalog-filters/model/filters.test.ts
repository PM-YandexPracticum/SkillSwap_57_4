import { describe, expect, test } from 'vitest'
import { countActiveFilters, DEFAULT_FILTERS, type CatalogFilters } from './filters'

const withFilters = (added: Partial<CatalogFilters>): CatalogFilters => ({
  ...DEFAULT_FILTERS,
  ...added,
})

describe('[countAvtiveFilters]', () => {
  test('по умолчанию возвращает 0', () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0)
  })

  test('считает режим, отличный от "all" за 1', () => {
    expect(countActiveFilters(withFilters({ mode: 'learn' }))).toBe(1)
    expect(countActiveFilters(withFilters({ mode: 'teach' }))).toBe(1)
  })

  test('считает пол, отличный от "any" за 1', () => {
    expect(countActiveFilters(withFilters({ gender: 'female' }))).toBe(1)
    expect(countActiveFilters(withFilters({ gender: 'male' }))).toBe(1)
  })

  test('добавляет по 1 за каждую выбранную подкатегорию', () => {
    expect(countActiveFilters(withFilters({ subcategoryIds: ['spanish', 'music-sound'] }))).toBe(2)
  })

  test('добавляет по 1 за каждый выбранный город', () => {
    expect(countActiveFilters(withFilters({ cityIds: ['moscow', 'kazan', 'samara'] }))).toBe(3)
  })

  test('суммирует все поля - "Хочу научиться" и два выбранных города дают 3', () => {
    expect(countActiveFilters(withFilters({ mode: 'learn', cityIds: ['moscow', 'kazan'] }))).toBe(3)
  })

  test('суммирует все поля вместе', () => {
    const filters: CatalogFilters = {
      mode: 'teach',
      subcategoryIds: ['marketing', 'photography'],
      gender: 'male',
      cityIds: ['moscow', 'yekaterinburg', 'saint-petersburg'],
    }

    expect(countActiveFilters(filters)).toBe(7)
  })
})
