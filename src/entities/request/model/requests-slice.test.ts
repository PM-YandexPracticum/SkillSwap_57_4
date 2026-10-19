import { beforeEach, describe, expect, test } from 'vitest'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { setupStore } from '@/store'
import { addRequest } from './requests-slice'
import { selectProposedSkillIds } from './selectors'
import { loadRequests } from './requests-storage'

const REQUEST = { skillId: 'skill-01', fromUserId: 'user-02', toUserId: 'user-01' }

describe('[слайс заявок]', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('addRequest добавляет заявку со статусом pending, id и датами', () => {
    const store = setupStore()
    store.dispatch(addRequest(REQUEST))

    const [request] = store.getState().requests.items
    expect(request).toMatchObject({ ...REQUEST, status: 'pending' })
    expect(request.id).toEqual(expect.any(String))
    expect(request.createdAt).toBe(request.updatedAt)
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
