import { describe, expect, test } from 'vitest'
import type { User } from '@/shared/types'
import { sortByNewest } from './sort-by-newest'

const BASE_USER: User = {
  id: 'user-01',
  name: 'Иван',
  email: 'user01@skillswap.com',
  birthDate: '1992-02-02',
  gender: 'male',
  cityId: 'saint-petersburg',
  avatarUrl: null,
  about: '',
  likesCount: 0,
  favorites: [],
  teachSkill: {
    id: 'skill-01',
    title: 'Игра на барабанах',
    description: 'Научу основам техники',
    categoryId: 'creativity',
    subcategoryId: 'music-sound',
    images: [],
  },
  learnSkills: [],
  createdAt: '2025-01-01T00:00:00.000Z',
}

const makeUser = (id: string, createdAt: string): User => ({ ...BASE_USER, id, createdAt })

const OLD = makeUser('old', '2025-01-15T10:00:00.000Z')
const MIDDLE = makeUser('middle', '2025-06-01T12:00:00.000Z')
const NEW = makeUser('new', '2026-10-02T09:00:00.000Z')

const getIds = (users: User[]) => users.map((user) => user.id)

describe('[sort-by-newest]', () => {
  test('сортирует по дате регистрации - сначала новые', () => {
    expect(getIds(sortByNewest([MIDDLE, OLD, NEW]))).toEqual(['new', 'middle', 'old'])
  })

  test('учитывает время, а не только день', () => {
    const morning = makeUser('morning', '2026-10-02T09:00:00.000Z')
    const evening = makeUser('evening', '2026-10-02T18:30:00.000Z')

    expect(getIds(sortByNewest([morning, evening]))).toEqual(['evening', 'morning'])
  })

  test('не меняет исходный массив и возвращает новый', () => {
    const users = [MIDDLE, OLD, NEW]
    const result = sortByNewest(users)

    expect(result).not.toBe(users)
    expect(getIds(users)).toEqual(['middle', 'old', 'new'])
  })

  test('передача пустого массива возвращает пустой массив', () => {
    expect(sortByNewest([])).toEqual([])
  })
})
