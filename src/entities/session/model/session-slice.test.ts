import { beforeEach, describe, expect, test } from 'vitest'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { setupStore } from '@/store'
import { selectUser } from './selectors'
import { AuthUser } from '@/shared/types'
import { sessionReducer, setSessionUser } from './session-slice'

const AUTH_USER: AuthUser = {
  id: 'user-01',
  name: 'Иван',
  email: 'user01@skillswap.com',
  token: 'mock_token_user-01',
}

const saveToStorage = (user: AuthUser) =>
  localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(user))

describe('[слайс сессии]', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('initialState', () => {
    test('гость, если в localStorage никого нет', () => {
      const store = setupStore()
      expect(selectUser(store.getState())).toBeNull()
    })

    test('берёт пользователя из localStorage при создании store', () => {
      saveToStorage(AUTH_USER)
      const store = setupStore()
      expect(selectUser(store.getState())).toEqual(AUTH_USER)
    })

    test('гость, если в localStorage повреждённый JSON', () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, 'не json')
      const store = setupStore()
      expect(selectUser(store.getState())).toBeNull()
    })

    test('читает localStorage заново при создании каждого store', () => {
      const first = setupStore()
      saveToStorage(AUTH_USER)
      const second = setupStore()
      expect(selectUser(first.getState())).toBeNull()
      expect(selectUser(second.getState())).toEqual(AUTH_USER)
    })
  })

  describe('setSessionUser', () => {
    test('кладёт пользователя в состояние', () => {
      const state = sessionReducer({ user: null }, setSessionUser(AUTH_USER))
      expect(state).toEqual({ user: AUTH_USER })
    })

    test('очищает пользователя при null', () => {
      const state = sessionReducer({ user: AUTH_USER }, setSessionUser(null))
      expect(state).toEqual({ user: null })
    })

    test('не трогает localStorage', () => {
      sessionReducer({ user: null }, setSessionUser(AUTH_USER))
      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBeNull()
    })
  })
})
