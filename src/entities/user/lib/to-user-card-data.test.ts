import { describe, expect, test } from 'vitest'
import type { City, SkillCategory, User } from '@/shared/types'
import { toUserCardData } from './to-user-card-data'

const CATEGORIES: SkillCategory[] = [
  {
    id: 'creativity',
    name: 'Творчество и искусство',
    subcategories: [
      { id: 'music-sound', name: 'Музыка и звук' },
      { id: 'drawing-illustration', name: 'Рисование и иллюстрация' },
    ],
  },
  {
    id: 'languages',
    name: 'Иностранные языки',
    subcategories: [{ id: 'english', name: 'Английский' }],
  },
]

const CITIES: City[] = [{ id: 'saint-petersburg', name: 'Санкт-Петербург' }]

const NOW = new Date(2026, 1, 1)

const USER: User = {
  id: 'user-01',
  name: 'Иван',
  email: 'user01@skillswap.com',
  birthDate: '1992-02-02',
  gender: 'male',
  cityId: 'saint-petersburg',
  avatarUrl: '/avatar.jpg',
  about: 'Люблю ритм и кофе по утрам',
  likesCount: 48,
  favorites: [],
  teachSkill: {
    id: 'skill-01',
    title: 'Игра на барабанах',
    description: 'Научу основам техники',
    categoryId: 'creativity',
    subcategoryId: 'music-sound',
    images: [],
  },
  learnSkills: ['english', 'drawing-illustration'],
  createdAt: '2025-10-24T00:00:00.000Z',
}

describe('[toUserCardData]', () => {
  test('собирает данные карточки', () => {
    expect(toUserCardData(USER, CATEGORIES, CITIES, NOW)).toEqual({
      id: 'user-01',
      skillId: 'skill-01',
      name: 'Иван',
      avatarUrl: '/avatar.jpg',
      subtitle: 'Санкт-Петербург, 33 года',
      about: 'Люблю ритм и кофе по утрам',
      likesCount: 48,
      teachTag: { id: 'skill-01', label: 'Игра на барабанах', category: 'creativity' },
      learnTags: [
        { id: 'english', label: 'Английский', category: 'languages' },
        { id: 'drawing-illustration', label: 'Рисование и иллюстрация', category: 'creativity' },
      ],
    })
  })

  test('неизвестные подкатегории пропускаются', () => {
    const user = { ...USER, learnSkills: ['english', 'unknown'] }

    expect(toUserCardData(user, CATEGORIES, CITIES, NOW).learnTags).toEqual([
      { id: 'english', label: 'Английский', category: 'languages' },
    ])
  })

  test('город не найден - в подписи только возраст', () => {
    const user = { ...USER, cityId: 'kazan' }

    expect(toUserCardData(user, CATEGORIES, CITIES, NOW).subtitle).toBe('33 года')
  })

  test('некорректная дата рождения - в подписи только город', () => {
    const user = { ...USER, birthDate: '1992-02-30' }

    expect(toUserCardData(user, CATEGORIES, CITIES, NOW).subtitle).toBe('Санкт-Петербург')
  })

  test('нет ни города, ни даты - пустая подпись', () => {
    const user = { ...USER, cityId: 'kazan', birthDate: '' }

    expect(toUserCardData(user, CATEGORIES, CITIES, NOW).subtitle).toBe('')
  })
})
