import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { setupStore, store as appStore } from '@/store'
import { addRequest } from './requests-slice'
import { selectProposedSkillIds } from './selectors'
import { loadRequests, saveRequests } from './requests-storage'

const REQUEST = { skillId: 'skill-01', fromUserId: 'user-02', toUserId: 'user-01' }

const SAVED_REQUEST = {
  ...REQUEST,
  id: 'request-1',
  status: 'pending',
  createdAt: '2026-10-19T10:00:00.000Z',
  updatedAt: '2026-10-19T10:00:00.000Z',
}

describe('[слайс заявок]', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('addRequest добавляет заявку со статусом pending, id и датами', () => {
    const store = setupStore()
    store.dispatch(addRequest(REQUEST))

    const [request] = store.getState().requests.items
    expect(request).toMatchObject({ ...REQUEST, status: 'pending' })
    expect(request.id).toEqual(expect.any(String))
    expect(request.createdAt).toBe(request.updatedAt)
  })

  test('у двух заявок разные id', () => {
    const store = setupStore()
    store.dispatch(addRequest(REQUEST))
    store.dispatch(addRequest(REQUEST))

    const [first, second] = store.getState().requests.items
    expect(first.id).not.toBe(second.id)
  })

  test('новый store читает заявки, сохранённые в localStorage', () => {
    const store = setupStore()
    store.dispatch(addRequest(REQUEST))
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.REQUESTS,
      JSON.stringify(store.getState().requests.items),
    )

    expect(setupStore().getState().requests.items).toEqual(store.getState().requests.items)
  })

  test('мусор в localStorage даёт пустой список', () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, 'не json')
    expect(loadRequests()).toEqual([])

    localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify([{ id: 1 }]))
    expect(loadRequests()).toEqual([])
  })

  test.each([
    ['неизвестный статус', { status: 'unknown' }],
    ['нет toUserId', { toUserId: undefined }],
  ])('заявка с ошибкой (%s) - пустой список', (_, change) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.REQUESTS,
      JSON.stringify([{ ...SAVED_REQUEST, ...change }]),
    )

    expect(loadRequests()).toEqual([])
  })

  test('правильная заявка читается как есть', () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify([SAVED_REQUEST]))

    expect(loadRequests()).toEqual([SAVED_REQUEST])
  })

  test('saveRequests не падает, если записать не удалось', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    expect(() => saveRequests([])).not.toThrow()
  })

  test('изменения в store приложения сохраняются в localStorage', () => {
    appStore.dispatch(addRequest(REQUEST))

    expect(loadRequests()).toEqual(appStore.getState().requests.items)
  })

  describe('selectProposedSkillIds', () => {
    test('возвращает навыки, которым пользователь предложил обмен', () => {
      const store = setupStore()
      store.dispatch(addRequest(REQUEST))
      store.dispatch(addRequest({ ...REQUEST, skillId: 'skill-03', fromUserId: 'user-05' }))

      expect(selectProposedSkillIds(store.getState(), 'user-02')).toEqual(['skill-01'])
    })

    test('у гостя всегда один и тот же пустой массив', () => {
      const store = setupStore()
      store.dispatch(addRequest(REQUEST))
      const first = selectProposedSkillIds(store.getState(), undefined)

      store.dispatch(addRequest({ ...REQUEST, skillId: 'skill-02' }))
      expect(first).toEqual([])
      expect(selectProposedSkillIds(store.getState(), undefined)).toBe(first)
    })
  })
})
