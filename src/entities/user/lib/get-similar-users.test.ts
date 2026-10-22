import { describe, expect, test } from 'vitest'
import type { SkillCategoryId, User } from '@/shared/types'
import { getSimilarUsers } from './get-similar-users'

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

const makeUser = (id: string, categoryId: SkillCategoryId, subcategoryId: string): User => ({
  ...BASE_USER,
  id,
  teachSkill: { ...BASE_USER.teachSkill, id: `skill-${id}`, categoryId, subcategoryId },
})

const AUTHOR = makeUser('author', 'creativity', 'music-sound')
const DRUMS = makeUser('drums', 'creativity', 'music-sound')
const GUITAR = makeUser('guitar', 'creativity', 'music-sound')
const PAINTER = makeUser('painter', 'creativity', 'drawing-illustration')
const ENGLISH = makeUser('english', 'languages', 'english')

const getIds = (users: User[]) => users.map((user) => user.id)

describe('[getSimilarUsers]', () => {
  test('сначала та же подкатегория, потом другие подкатегории той же категории', () => {
    const users = [PAINTER, DRUMS, ENGLISH, AUTHOR, GUITAR]

    expect(getIds(getSimilarUsers(users, AUTHOR))).toEqual(['drums', 'guitar', 'painter'])
  })

  test('автора и пользователей других категорий в результате нет', () => {
    const ids = getIds(getSimilarUsers([AUTHOR, DRUMS, ENGLISH], AUTHOR))

    expect(ids).not.toContain('author')
    expect(ids).not.toContain('english')
  })

  test('если в категории автора больше никого нет - пустой массив', () => {
    expect(getSimilarUsers([AUTHOR, ENGLISH], AUTHOR)).toEqual([])
  })
})
