import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fetchUsers } from '@/api/users'
import type { User } from './types'
import { setupStore } from '@/store'
import { addUser } from './users-slice'

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
})
