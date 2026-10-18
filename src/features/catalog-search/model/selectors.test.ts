import { describe, expect, test } from 'vitest'
import type { RootState } from '@/store'
import { catalogSearchReducer, setSearch, type CatalogSearchState } from './catalog-search-slice'
import { selectSearch } from './selectors'

const INITIAL_STATE = catalogSearchReducer(undefined, { type: 'unknown' })

const toRootState = (catalogSearch: CatalogSearchState) => ({ catalogSearch }) as RootState

describe('[selectSearch]', () => {
  test('сначала пустая строка', () => {
    expect(selectSearch(toRootState(INITIAL_STATE))).toBe('')
  })

  test('возвращает текст после setSearch', () => {
    const state = toRootState(catalogSearchReducer(INITIAL_STATE, setSearch('английский')))
    expect(selectSearch(state)).toBe('английский')
  })
})
