import { describe, expect, test } from 'vitest'
import { catalogSearchReducer, setSearch } from './catalog-search-slice'

const INITIAL_STATE = catalogSearchReducer(undefined, { type: 'unknown' })

describe('[catalogSearchSlice]', () => {
  test('начальное состояние - пустая строка', () => {
    expect(INITIAL_STATE).toEqual({ search: '' })
  })

  describe('setSearch', () => {
    test('кладёт текст поиска', () => {
      const state = catalogSearchReducer(INITIAL_STATE, setSearch('английский'))
      expect(state.search).toBe('английский')
    })

    test('хранит текст как есть', () => {
      const state = catalogSearchReducer(INITIAL_STATE, setSearch('игра '))
      expect(state.search).toBe('игра ')
    })

    test('заменяет прежний текст', () => {
      const typed = catalogSearchReducer(INITIAL_STATE, setSearch('англ'))
      const state = catalogSearchReducer(typed, setSearch('фото'))

      expect(state.search).toBe('фото')
    })

    test('пустая строка очищает поиск', () => {
      const typed = catalogSearchReducer(INITIAL_STATE, setSearch('англ'))
      const state = catalogSearchReducer(typed, setSearch(''))

      expect(state.search).toBe('')
    })
  })
})
