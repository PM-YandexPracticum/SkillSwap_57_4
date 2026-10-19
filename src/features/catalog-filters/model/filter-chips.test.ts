import { describe, expect, test } from 'vitest'
import type { City, SkillCategory } from '@/shared/types'
import { DEFAULT_FILTERS, type CatalogFilters } from './filters'
import { getFilterChips } from './filter-chips'

const categories: SkillCategory[] = [
  {
    id: 'languages',
    name: 'Иностранные языки',
    subcategories: [
      { id: 'english', name: 'Английский' },
      { id: 'german', name: 'Немецкий' },
    ],
  },
  {
    id: 'home',
    name: 'Дом и уют',
    subcategories: [{ id: 'cooking', name: 'Приготовление еды' }],
  },
]

const cities: City[] = [
  { id: 'moscow', name: 'Москва' },
  { id: 'kazan', name: 'Казань' },
]

const getChips = (filters: Partial<CatalogFilters>) =>
  getFilterChips({ ...DEFAULT_FILTERS, ...filters }, categories, cities)

describe('[getFilterChips]', () => {
  test('возвращает пустой массив, если ни один фильтр не выбран', () => {
    expect(getChips({})).toEqual([])
  })

  test('показывает режимы по подписям из предложенных фильтров', () => {
    expect(getChips({ mode: 'learn' }).map((chip) => chip.label)).toEqual(['Хочу научиться'])
    expect(getChips({ mode: 'teach' }).map((chip) => chip.label)).toEqual(['Могу научить'])
  })

  test('показывает пол по подписям из предложенных фильтров', () => {
    expect(getChips({ gender: 'male' }).map((chip) => chip.label)).toEqual(['Мужской'])
    expect(getChips({ gender: 'female' }).map((chip) => chip.label)).toEqual(['Женский'])
  })

  test('показывает подкатегории и города по подписям из предложенных фильтров', () => {
    expect(
      getChips({ subcategoryIds: ['german'], cityIds: ['moscow'] }).map((chip) => chip.label),
    ).toEqual(['Немецкий', 'Москва'])
  })

  test('выстраивает плашки по порядку: режим - пол - подкатегории - города', () => {
    const chips = getChips({
      mode: 'learn',
      gender: 'male',
      subcategoryIds: ['english', 'cooking'],
      cityIds: ['kazan'],
    })

    expect(chips.map((chip) => chip.key)).toEqual([
      'mode',
      'gender',
      'subcategory:english',
      'subcategory:cooking',
      'city:kazan',
    ])
    expect(chips.map((chip) => chip.label)).toEqual([
      'Хочу научиться',
      'Мужской',
      'Английский',
      'Приготовление еды',
      'Казань',
    ])
  })

  test('подкатегории и города идут в порядке выбора', () => {
    expect(
      getChips({ subcategoryIds: ['cooking', 'english'], cityIds: ['kazan', 'moscow'] }).map(
        (chip) => chip.label,
      ),
    ).toEqual(['Приготовление еды', 'Английский', 'Казань', 'Москва'])
  })

  test('пропускает подкатегории и города, которых нет в исходном наборе фильтров', () => {
    expect(
      getChips({ subcategoryIds: ['unknown', 'english'], cityIds: ['unknown'] }).map(
        (chip) => chip.key,
      ),
    ).toEqual(['subcategory:english'])
  })

  describe('filtersWithout', () => {
    test('у плашки режима сбрасывает только режим', () => {
      const filters: CatalogFilters = {
        mode: 'learn',
        gender: 'male',
        subcategoryIds: ['english'],
        cityIds: ['moscow'],
      }
      const [chip] = getFilterChips(filters, categories, cities)
      expect(chip.filtersWithout).toEqual({ ...filters, mode: 'all' })
    })

    test('у плашки пола сбрасывает только пол', () => {
      const filters: CatalogFilters = {
        mode: 'teach',
        gender: 'male',
        subcategoryIds: ['english'],
        cityIds: ['moscow'],
      }
      const chip = getFilterChips(filters, categories, cities).find((item) => item.key === 'gender')
      expect(chip?.filtersWithout).toEqual({ ...filters, gender: 'any' })
    })

    test('у плашки подкатегории сбрасывает только конкретную подкатегорию', () => {
      const filters: CatalogFilters = {
        ...DEFAULT_FILTERS,
        subcategoryIds: ['english', 'german', 'cooking'],
      }
      const chip = getFilterChips(filters, categories, cities).find(
        (item) => item.key === 'subcategory:german',
      )
      expect(chip?.filtersWithout.subcategoryIds).toEqual(['english', 'cooking'])
    })

    test('у плашки города сбрасывает только конкретный город', () => {
      const filters: CatalogFilters = { ...DEFAULT_FILTERS, cityIds: ['moscow', 'kazan'] }
      const chip = getFilterChips(filters, categories, cities).find(
        (item) => item.key === 'city:moscow',
      )
      expect(chip?.filtersWithout.cityIds).toEqual(['kazan'])
    })

    test('не меняет исходные фильтры', () => {
      const filters: CatalogFilters = {
        mode: 'learn',
        gender: 'female',
        subcategoryIds: ['english'],
        cityIds: ['kazan'],
      }
      const snapshot = structuredClone(filters)
      getFilterChips(filters, categories, cities)
      expect(filters).toEqual(snapshot)
    })
  })
})
