import { beforeEach, describe, expect, test, vi } from 'vitest'
import { setupStore } from '@/store'
import { fetchUsers } from '@/api/users'
import { addUser, loadUsers, usersReducer } from './users-slice'
import {
  selectNewestUsers,
  selectPopularUsers,
  selectUserById,
  selectUserBySkillId,
  selectUsers,
  selectUsersError,
  selectUsersStatus,
} from './selectors'
import type { User } from './types'

vi.mock('@/api/users', () => ({ fetchUsers: vi.fn() }))

const makeUser = (id: string, likesCount: number, createdAt: string): User => ({
  id,
  name: id,
  email: `${id}@test.dev`,
  avatarUrl: null,
  createdAt,
  birthDate: '1990-01-01',
  gender: 'male',
  cityId: 'moscow',
  about: '',
  likesCount,
  favorites: [],
  teachSkill: {
    id: `skill-${id}`,
    title: 'Навык',
    description: '',
    categoryId: 'creativity',
    subcategoryId: 'music',
    images: [],
  },
  learnSkills: ['english'],
})

const users = [
  makeUser('a', 10, '2026-03-01T00:00:00.000Z'),
  makeUser('b', 50, '2026-01-01T00:00:00.000Z'),
  makeUser('c', 30, '2026-02-01T00:00:00.000Z'),
]

describe('[usersSlice]', () => {
  beforeEach(() => {
    vi.mocked(fetchUsers).mockReset()
  })

  test('возвращает начальное состояние', () => {
    expect(usersReducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
      status: 'idle',
      error: null,
    })
  })

  describe('addUser', () => {
    const loaded = () => setupStore({ users: { items: users, status: 'succeeded', error: null } })

    test('добавляет пользователя в конец списка', () => {
      const store = loaded()
      const newUser = makeUser('new', 0, '2026-10-19T00:00:00.000Z')

      store.dispatch(addUser(newUser))

      expect(store.getState().users.items).toEqual([...users, newUser])
    })

    test('пользователя с тем же id второй раз не добавляет', () => {
      const store = loaded()

      store.dispatch(addUser({ ...users[0], name: 'Двойник' }))

      expect(store.getState().users.items).toEqual(users)
    })
  })

  describe('loadUsers', () => {
    test('загружает пользователей и обновляет состояние', async () => {
      vi.mocked(fetchUsers).mockResolvedValue(users)
      const store = setupStore()

      await store.dispatch(loadUsers())

      expect(store.getState().users.items).toEqual(users)
      expect(selectUsersStatus(store.getState())).toBe('succeeded')
      expect(selectUsersError(store.getState())).toBeNull()
      expect(fetchUsers).toHaveBeenCalledTimes(1)
    })

    test('сохраняет ошибку при неудачной загрузке', async () => {
      vi.mocked(fetchUsers).mockRejectedValue(new Error('Ошибка загрузки'))
      const store = setupStore()

      await store.dispatch(loadUsers())

      expect(selectUsersStatus(store.getState())).toBe('failed')
      expect(selectUsersError(store.getState())).toBe('Ошибка загрузки')
      expect(selectUsers(store.getState())).toEqual([])
    })

    test('не загружает пользователей повторно после успешной загрузки', async () => {
      vi.mocked(fetchUsers).mockResolvedValue(users)
      const store = setupStore()

      await store.dispatch(loadUsers())
      await store.dispatch(loadUsers())

      expect(fetchUsers).toHaveBeenCalledTimes(1)
    })

    test('позволяет повторить загрузку после ошибки', async () => {
      vi.mocked(fetchUsers)
        .mockRejectedValueOnce(new Error('Ошибка загрузки'))
        .mockResolvedValueOnce(users)

      const store = setupStore()

      await store.dispatch(loadUsers())
      expect(selectUsersStatus(store.getState())).toBe('failed')

      await store.dispatch(loadUsers())

      expect(selectUsersStatus(store.getState())).toBe('succeeded')
      expect(selectUsers(store.getState())).toEqual(users)
      expect(fetchUsers).toHaveBeenCalledTimes(2)
    })
  })

  describe('selectors', () => {
    const loaded = () => setupStore({ users: { items: users, status: 'succeeded', error: null } })

    test('selectUsers возвращает список пользователей', () => {
      const store = loaded()
      expect(selectUsers(store.getState())).toEqual(users)
    })

    test('selectUserById находит пользователя по id', () => {
      const store = loaded()
      expect(selectUserById(store.getState(), 'b')).toEqual(users[1])
    })

    test('selectUserBySkillId находит пользователя по id навыка', () => {
      const store = loaded()
      expect(selectUserBySkillId(store.getState(), 'skill-b')).toEqual(users[1])
    })

    test('selectPopularUsers сортирует по количеству лайков по убыванию', () => {
      const store = loaded()
      expect(selectPopularUsers(store.getState()).map((user) => user.id)).toEqual(['b', 'c', 'a'])
    })

    test('selectNewestUsers сортирует по дате создания от новых к старым', () => {
      const store = loaded()
      expect(selectNewestUsers(store.getState()).map((user) => user.id)).toEqual(['a', 'c', 'b'])
    })

    test('селекторы сортировки не изменяют исходный массив', () => {
      const store = loaded()
      const originalUsers = [...users]

      selectPopularUsers(store.getState())
      selectNewestUsers(store.getState())

      expect(store.getState().users.items).toEqual(originalUsers)
    })
  })
})
