import { describe, expect, test } from 'vitest'
import type { User } from '@/shared/types'
import { excludeUser } from './exclude-user'

const createUser = (id: string): User => ({
  id,
  name: `User ${id}`,
  email: `${id}@test.com`,
  avatarUrl: null,
  createdAt: '2024-01-01',
  birthDate: '1990-01-01',
  gender: 'male',
  cityId: 'city-1',
  about: '',
  likesCount: 0,
  favorites: [],
  teachSkill: {
    id: `skill-${id}`,
    title: 'Навык',
    description: '',
    categoryId: 'creativity',
    subcategoryId: 'music-sound',
    images: [],
  },
  learnSkills: [],
})

const users = [createUser('1'), createUser('2'), createUser('3')]

describe('excludeUser', () => {
  test('без вошедшего возвращает тот же массив (toBe)', () => {
    const result = excludeUser(users, undefined)
    expect(result).toBe(users)
  })

  test('с id убирает пользователя, остальные в прежнем порядке', () => {
    const result = excludeUser(users, '2')
    expect(result.map((u) => u.id)).toEqual(['1', '3'])
  })

  test('исходный массив не меняется', () => {
    const list = [createUser('1'), createUser('2')]

    excludeUser(list, '1')

    expect(list.map((u) => u.id)).toEqual(['1', '2'])
  })

  test('id, которого нет в списке, ничего не убирает', () => {
    const result = excludeUser(users, '999')
    expect(result.map((u) => u.id)).toEqual(['1', '2', '3'])
  })
})
