import { describe, expect, test } from 'vitest'
import type { User } from '@/shared/types'
import { filterUsers } from './filter-users'
import { DEFAULT_FILTERS, type CatalogFilters } from './filters'

const ivan: User = {
  id: 'user-01',
  name: 'Иван',
  email: 'user01@skillswap.com',
  birthDate: '1992-02-02',
  gender: 'male',
  cityId: 'saint-petersburg',
  avatarUrl: 'https://randomuser.me/api/portraits/men/10.jpg',
  about: 'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое.',
  likesCount: 48,
  favorites: ['user-05', 'user-16'],
  teachSkill: {
    id: 'skill-01',
    title: 'Игра на барабанах',
    description: 'Привет! Я играю на барабанах уже больше 10 лет.',
    categoryId: 'creativity',
    subcategoryId: 'music-sound',
    images: [],
  },
  learnSkills: ['cooking', 'spanish'],
  createdAt: '2025-10-24T00:00:00.000Z',
}

const anna: User = {
  id: 'user-02',
  name: 'Анна',
  email: 'user02@skillswap.com',
  birthDate: '1995-06-14',
  gender: 'female',
  cityId: 'moscow',
  avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
  about: 'Переводчица и путешественница.',
  likesCount: 73,
  favorites: ['user-08'],
  teachSkill: {
    id: 'skill-02',
    title: 'Английский для путешествий',
    description: 'Разберём фразы для аэропорта, отеля и кафе.',
    categoryId: 'languages',
    subcategoryId: 'english',
    images: [],
  },
  learnSkills: ['photography', 'yoga-meditation'],
  createdAt: '2025-08-11T14:20:00.000Z',
}

const dmitry: User = {
  id: 'user-03',
  name: 'Дмитрий',
  email: 'user03@skillswap.com',
  birthDate: '1987-11-03',
  gender: 'male',
  cityId: 'novosibirsk',
  avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
  about: 'Руковожу отделом продаж в B2B.',
  likesCount: 31,
  favorites: ['user-20'],
  teachSkill: {
    id: 'skill-03',
    title: 'Переговоры с клиентами',
    description: 'Покажу, как готовиться к встрече.',
    categoryId: 'business',
    subcategoryId: 'sales',
    images: [],
  },
  learnSkills: ['german', 'physical-training', 'home-finance'],
  createdAt: '2025-09-02T09:15:00.000Z',
}

const maria: User = {
  id: 'user-04',
  name: 'Мария',
  email: 'user04@skillswap.com',
  birthDate: '1998-03-21',
  gender: 'female',
  cityId: 'yekaterinburg',
  avatarUrl: 'https://randomuser.me/api/portraits/women/25.jpg',
  about: 'Иллюстратор детских книг.',
  likesCount: 64,
  favorites: [],
  teachSkill: {
    id: 'skill-04',
    title: 'Акварельные скетчи',
    description: 'Научу работать с акварелью.',
    categoryId: 'creativity',
    subcategoryId: 'drawing-illustration',
    images: [],
  },
  learnSkills: ['french', 'creative-writing'],
  createdAt: '2025-07-19T18:40:00.000Z',
}

const ekaterina: User = {
  id: 'user-06',
  name: 'Екатерина',
  email: 'user06@skillswap.com',
  birthDate: '1990-12-17',
  gender: 'female',
  cityId: 'samara',
  avatarUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
  about: 'Сертифицированный инструктор йоги.',
  likesCount: 87,
  favorites: [],
  teachSkill: {
    id: 'skill-06',
    title: 'Хатха-йога для начинающих',
    description: 'Освоим базовые асаны.',
    categoryId: 'health',
    subcategoryId: 'yoga-meditation',
    images: [],
  },
  learnSkills: ['cooking', 'houseplants'],
  createdAt: '2025-06-03T07:00:00.000Z',
}

const users: User[] = [ivan, anna, dmitry, maria, ekaterina]

describe('filterUsers', () => {
  const yoga: CatalogFilters = { ...DEFAULT_FILTERS, subcategoryIds: ['yoga-meditation'] }

  test('режим "learn" ищет по teachSkill.subcategoryId', () => {
    const result = filterUsers(users, { ...yoga, mode: 'learn' })
    expect(result.map((u) => u.id)).toEqual(['user-06'])
  })

  test('режим "teach" ищет по learnSkills', () => {
    const result = filterUsers(users, { ...yoga, mode: 'teach' })
    expect(result.map((u) => u.id)).toEqual(['user-02'])
  })

  test('режим "all" ищет и по teachSkill, и по learnSkills', () => {
    const result = filterUsers(users, { ...yoga, mode: 'all' })
    expect(result.map((u) => u.id)).toEqual(['user-02', 'user-06'])
  })

  test('поиск без учёта регистра и пробелов по краям, только по teachSkill.title', () => {
    expect(filterUsers(users, DEFAULT_FILTERS, '  БАРАБАНАХ  ').map((u) => u.id)).toEqual([
      'user-01',
    ])
    expect(filterUsers(users, DEFAULT_FILTERS, 'Иван')).toEqual([])
    expect(filterUsers(users, DEFAULT_FILTERS, 'аэропорта')).toEqual([])
    expect(filterUsers(users, DEFAULT_FILTERS, 'english')).toEqual([])
  })

  test('пустая строка поиска и строка из пробелов не отбрасывают никого', () => {
    expect(filterUsers(users, DEFAULT_FILTERS, '')).toEqual(users)
    expect(filterUsers(users, DEFAULT_FILTERS, '   ')).toEqual(users)
  })

  test('фильтр по полу (без строки поиска работают только фильтры)', () => {
    const filters: CatalogFilters = {
      ...DEFAULT_FILTERS,
      gender: 'female',
    }
    const result = filterUsers(users, filters)
    expect(result.map((u) => u.id)).toEqual(['user-02', 'user-04', 'user-06'])
  })

  test('фильтр по городам', () => {
    const filters: CatalogFilters = {
      ...DEFAULT_FILTERS,
      cityIds: ['moscow', 'samara'],
    }
    const result = filterUsers(users, filters)
    expect(result.map((u) => u.id)).toEqual(['user-02', 'user-06'])
  })

  test('несколько условий работают как "И"', () => {
    const filters: CatalogFilters = {
      ...DEFAULT_FILTERS,
      gender: 'female',
      subcategoryIds: ['cooking'],
    }
    const result = filterUsers(users, filters)
    expect(result.map((u) => u.id)).toEqual(['user-06'])
  })

  test('исходный массив не меняется', () => {
    const original = structuredClone(users)
    filterUsers(users, { ...DEFAULT_FILTERS, gender: 'female' }, 'барабанах')
    expect(users).toEqual(original)
  })

  test('если никто не подошёл, возвращает пустой массив', () => {
    const filters: CatalogFilters = {
      ...DEFAULT_FILTERS,
      gender: 'female',
      subcategoryIds: ['music-sound'],
      mode: 'learn',
    }
    expect(filterUsers(users, filters)).toEqual([])
  })
})
