import type { ReactNode } from 'react'
import { describe, expect, test } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, useLocation } from 'react-router-dom'

import { setupStore } from '@/store'
import { useAppSelector } from '@/store/hooks'
import { ROUTES } from '@/shared/lib/constants'
import type { AuthUser } from '@/shared/types'

import type { FavoritesByUser } from './favorites-storage'
import { selectFavoriteIds } from './selectors'
import { useToggleFavorite } from './useToggleFavorite'

const CURRENT_PATH = '/skill/skill-01'
const TARGET_ID = 'user-05'

const AUTH_USER: AuthUser = {
  id: 'user-01',
  name: 'Иван',
  email: 'user01@skillswap.com',
  token: 'mock_token_user-01',
}

function useTestHook() {
  return {
    toggleLike: useToggleFavorite(),
    location: useLocation(),
    favoriteIds: useAppSelector(selectFavoriteIds),
  }
}

function setup(user: AuthUser | null, byUser: FavoritesByUser = {}) {
  const store = setupStore({ session: { user }, favorites: { byUser } })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[CURRENT_PATH]}>{children}</MemoryRouter>
    </Provider>
  )

  return { store, ...renderHook(useTestHook, { wrapper }) }
}

describe('[useToggleFavorite]', () => {
  describe('гость', () => {
    test('переходит на вход и запоминает текущую страницу в state.from', () => {
      const { result } = setup(null)

      act(() => result.current.toggleLike(TARGET_ID))

      expect(result.current.location.pathname).toBe(ROUTES.LOGIN)
      expect(result.current.location.state).toEqual({
        from: expect.objectContaining({ pathname: CURRENT_PATH }),
      })
    })

    test('избранное не меняется', () => {
      const { result, store } = setup(null)

      act(() => result.current.toggleLike(TARGET_ID))

      expect(store.getState().favorites.byUser).toEqual({})
      expect(result.current.favoriteIds).toEqual([])
    })
  })

  describe('вошедший', () => {
    test('id появляется в его избранном, переход не происходит', () => {
      const { result } = setup(AUTH_USER)

      act(() => result.current.toggleLike(TARGET_ID))

      expect(result.current.favoriteIds).toEqual([TARGET_ID])
      expect(result.current.location.pathname).toBe(CURRENT_PATH)
    })

    test('повторный вызов убирает id из избранного', () => {
      const { result } = setup(AUTH_USER)

      act(() => result.current.toggleLike(TARGET_ID))
      act(() => result.current.toggleLike(TARGET_ID))

      expect(result.current.favoriteIds).toEqual([])
    })

    test('не трогает избранное других пользователей', () => {
      const { result, store } = setup(AUTH_USER, { 'user-02': ['user-09'] })

      act(() => result.current.toggleLike(TARGET_ID))

      expect(store.getState().favorites.byUser).toEqual({
        'user-01': [TARGET_ID],
        'user-02': ['user-09'],
      })
    })
  })
})
