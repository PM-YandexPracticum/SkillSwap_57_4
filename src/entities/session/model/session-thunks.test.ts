import { beforeEach, describe, expect, test } from 'vitest'
import { setupStore } from '@/store'
import { login, logout } from './session-thunks'
import { selectUser } from './selectors'
import { getAuthUser } from './auth-utils'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

const USER_ONE = { id: 'user-01', name: 'Иван', email: 'user01@skillswap.com' }
const USER_TWO = { id: 'user-02', name: 'Анна', email: 'user02@skillswap.com' }

describe("[thunk'и сессии]", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('login', () => {
    test('кладет пользователя с токеном в store', () => {
      const store = setupStore()
      store.dispatch(login(USER_ONE))
      expect(selectUser(store.getState())).toEqual({
        ...USER_ONE,
        token: `mock_token_${USER_ONE.id}`,
      })
    })

    test('сохраняет в localStorage того же пользователя, что и в store', () => {
      const store = setupStore()
      store.dispatch(login(USER_ONE))
      expect(getAuthUser()).toEqual(selectUser(store.getState()))
    })

    test('заменяет ранее вошедшего пользователя', () => {
      const store = setupStore()
      store.dispatch(login(USER_ONE))
      store.dispatch(login(USER_TWO))
      expect(selectUser(store.getState())?.id).toBe(USER_TWO.id)
      expect(getAuthUser()?.id).toBe(USER_TWO.id)
    })

    test('пользователь остается вошедшим после перезагрузки (нового store)', () => {
      const store = setupStore()
      store.dispatch(login(USER_ONE))
      const reloaded = setupStore()
      expect(selectUser(reloaded.getState())).toEqual(selectUser(store.getState()))
    })
  })

  describe('logout', () => {
    test('очищает store и localStorage', () => {
      const store = setupStore()
      store.dispatch(login(USER_ONE))
      store.dispatch(logout())
      expect(selectUser(store.getState())).toBeNull()
      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBeNull()
    })

    test('после выхода новый store стартует гостем', () => {
      const store = setupStore()
      store.dispatch(login(USER_ONE))
      store.dispatch(logout())
      const reloaded = setupStore()
      expect(selectUser(reloaded.getState())).toBeNull()
    })

    test('не падает, если никто не входил', () => {
      const store = setupStore()
      expect(() => store.dispatch(logout())).not.toThrow()
      expect(selectUser(store.getState())).toBeNull()
    })
  })
})
