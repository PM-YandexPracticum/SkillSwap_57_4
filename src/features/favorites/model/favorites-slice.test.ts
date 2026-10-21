import { describe, it, expect, beforeEach } from 'vitest'
import { setupStore, store } from '@/store'
import { toggleFavorite } from './favorites-slice'
import { selectFavoriteIds } from './selectors'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

describe('favorites-slice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('toggles favorites correctly and keeps users isolated', () => {
    const testStore = setupStore()

    testStore.dispatch(toggleFavorite({ userId: 'user1', targetId: 'targetA' }))
    expect(testStore.getState().favorites.byUser).toEqual({ user1: ['targetA'] })

    testStore.dispatch(toggleFavorite({ userId: 'user1', targetId: 'targetA' }))
    expect(testStore.getState().favorites.byUser).toEqual({ user1: [] })

    testStore.dispatch(toggleFavorite({ userId: 'user1', targetId: 'targetA' }))
    testStore.dispatch(toggleFavorite({ userId: 'user2', targetId: 'targetB' }))
    expect(testStore.getState().favorites.byUser).toEqual({
      user1: ['targetA'],
      user2: ['targetB'],
    })
  })

  it('reads initial state from localStorage on store creation', () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify({ user1: ['targetX'] }))
    const testStore = setupStore()
    expect(testStore.getState().favorites.byUser).toEqual({ user1: ['targetX'] })
  })

  it('persists main store changes to localStorage', () => {
    store.dispatch(toggleFavorite({ userId: 'persistUser', targetId: 'persistTarget' }))
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES) || '{}')
    expect(saved).toEqual({ persistUser: ['persistTarget'] })
  })
})

describe('favorites selectors', () => {
  it('selectFavoriteIds returns empty array for guest', () => {
    const testStore = setupStore()
    expect(selectFavoriteIds(testStore.getState())).toEqual([])
  })

  it('selectFavoriteIds returns empty array for user with no favorites', () => {
    const testStore = setupStore({
      session: { user: { id: 'user1' } } as any
    })
    expect(selectFavoriteIds(testStore.getState())).toEqual([])
  })

  it('selectFavoriteIds returns favorites for logged in user', () => {
    const testStore = setupStore({
      session: { user: { id: 'user1' } } as any,
      favorites: { byUser: { user1: ['target1', 'target2'] } }
    })
    expect(selectFavoriteIds(testStore.getState())).toEqual(['target1', 'target2'])
  })

  it('selectFavoriteIds returns the same instance if state is unchanged', () => {
    const testStore = setupStore({
      session: { user: { id: 'user1' } } as any,
      favorites: { byUser: { user1: ['target1'] } }
    })
    
    const firstCall = selectFavoriteIds(testStore.getState())
    const secondCall = selectFavoriteIds(testStore.getState())
    
    expect(firstCall).toBe(secondCall)
  })
})