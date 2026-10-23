import { describe, expect, beforeEach, test } from 'vitest'
import { setupStore, store } from '@/store'
import { toggleFavorite } from './favorites-slice'
import { selectFavoriteIds, selectLocalLikes } from './selectors'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { AuthUser } from '@/shared/types'

const AUTH_USER: AuthUser = {
  id: 'user1',
  name: 'Иван',
  email: 'user1@skillswap.com',
  token: 'mock_token_user1',
}

describe('favorites-slice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('добавляет и убирает targetId из списка пользователя', () => {
    const testStore = setupStore()

    testStore.dispatch(toggleFavorite({ userId: 'user1', targetId: 'targetA' }))
    expect(testStore.getState().favorites.byUser).toEqual({ user1: ['targetA'] })

    testStore.dispatch(toggleFavorite({ userId: 'user1', targetId: 'targetA' }))
    expect(testStore.getState().favorites.byUser).toEqual({ user1: [] })
  })

  test('списки разных пользователей не смешиваются', () => {
    const testStore = setupStore()

    testStore.dispatch(toggleFavorite({ userId: 'user1', targetId: 'targetA' }))
    testStore.dispatch(toggleFavorite({ userId: 'user2', targetId: 'targetA' }))

    testStore.dispatch(toggleFavorite({ userId: 'user1', targetId: 'targetA' }))

    expect(testStore.getState().favorites.byUser).toEqual({
      user1: [],
      user2: ['targetA'],
    })
  })

  test('читает начальное состояние из localStorage при создании стора', () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify({ user1: ['targetX'] }))
    const testStore = setupStore()
    expect(testStore.getState().favorites.byUser).toEqual({ user1: ['targetX'] })
  })

  test('сохраняет изменения главного стора в localStorage', () => {
    store.dispatch(toggleFavorite({ userId: 'persistUser', targetId: 'persistTarget' }))
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES) ?? '{}')
    expect(saved).toEqual({ persistUser: ['persistTarget'] })
  })
})

describe('favorites selectors', () => {
  test('selectFavoriteIds возвращает пустой массив для гостя', () => {
    const testStore = setupStore()
    expect(selectFavoriteIds(testStore.getState())).toEqual([])
  })

  test('selectFavoriteIds возвращает пустой массив для пользователя без избранного', () => {
    const testStore = setupStore({
      session: { user: AUTH_USER },
    })
    expect(selectFavoriteIds(testStore.getState())).toEqual([])
  })

  test('selectFavoriteIds возвращает избранное для авторизованного пользователя', () => {
    const testStore = setupStore({
      session: { user: AUTH_USER },
      favorites: { byUser: { user1: ['target1', 'target2'] } },
    })
    expect(selectFavoriteIds(testStore.getState())).toEqual(['target1', 'target2'])
  })

  test('selectFavoriteIds возвращает один и тот же массив для гостя при разных состояниях', () => {
    const state1 = setupStore().getState()
    const state2 = setupStore().getState()

    expect(selectFavoriteIds(state1)).toBe(selectFavoriteIds(state2))
  })

  test('selectFavoriteIds возвращает один и тот же массив для вошедшего без избранного', () => {
    const state1 = setupStore({ session: { user: AUTH_USER } }).getState()
    const state2 = setupStore({ session: { user: AUTH_USER } }).getState()

    expect(selectFavoriteIds(state1)).toBe(selectFavoriteIds(state2))
  })

  test('selectLocalLikes считает лайки всех аккаунтов браузера, не только вошедшего', () => {
    const state = setupStore({
      session: { user: AUTH_USER },
      favorites: { byUser: { user1: ['target1', 'target2'], user2: ['target1'], user3: [] } },
    }).getState()

    expect(selectLocalLikes(state)).toEqual({ target1: 2, target2: 1 })
  })

  test('selectLocalLikes без лайков - пустой объект', () => {
    const state = setupStore({ favorites: { byUser: {} } }).getState()

    expect(selectLocalLikes(state)).toEqual({})
  })
})
