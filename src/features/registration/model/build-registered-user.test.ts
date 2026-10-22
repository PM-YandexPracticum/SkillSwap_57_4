import { describe, expect, test } from 'vitest'
import { buildRegisteredUser } from './build-registered-user'
import type { RegistrationDraft } from './draft'
import type { SkillFormValues } from './skill-schema'

const NOW = new Date('2026-10-21T10:00:00.000Z')

const DRAFT: RegistrationDraft = {
  email: 'anna@skillswap.com',
  password: 'Secret12!',
  name: 'Анна',
  birthDate: '2002-04-12',
  gender: 'female',
  cityId: 'kazan',
  avatarUrl: 'data:image/png;base64,aGVsbG8=',
  learnCategories: ['languages'],
  learnSkills: ['english', 'german'],
}

const makePhotos = (count: number) =>
  Array.from({ length: count }, (_, index) => new File(['x'], `photo-${index}.png`))

const SKILL: SkillFormValues = {
  title: 'Игра на гитаре',
  categoryId: 'creativity',
  subcategoryId: 'music-sound',
  description: 'Научу играть аккордами и перебором',
  images: makePhotos(2),
}

describe('[buildRegisteredUser]', () => {
  test('собирает пользователя из черновика и формы шага 3', () => {
    expect(buildRegisteredUser(DRAFT, SKILL, NOW)).toEqual({
      id: expect.any(String),
      name: 'Анна',
      email: 'anna@skillswap.com',
      avatarUrl: DRAFT.avatarUrl,
      createdAt: NOW.toISOString(),
      birthDate: '2002-04-12',
      gender: 'female',
      cityId: 'kazan',
      about: '',
      likesCount: 0,
      favorites: [],
      teachSkill: {
        id: expect.any(String),
        title: 'Игра на гитаре',
        description: 'Научу играть аккордами и перебором',
        categoryId: 'creativity',
        subcategoryId: 'music-sound',
        images: ['/db/images/placeholder-1.jpg', '/db/images/placeholder-2.jpg'],
      },
      learnSkills: ['english', 'german'],
    })
  })

  test('у пользователя и навыка разные id, у двух пользователей - тоже', () => {
    const first = buildRegisteredUser(DRAFT, SKILL, NOW)
    const second = buildRegisteredUser(DRAFT, SKILL, NOW)

    expect(first.id).not.toBe(first.teachSkill.id)
    expect(first.teachSkill.id).not.toBe(second.teachSkill.id)
    expect(first.id).not.toBe(second.id)
  })

  test('фото больше, чем заглушек, - заглушек 7', () => {
    const user = buildRegisteredUser(DRAFT, { ...SKILL, images: makePhotos(9) }, NOW)

    expect(user.teachSkill.images).toEqual(
      Array.from({ length: 7 }, (_, index) => `/db/images/placeholder-${index + 1}.jpg`),
    )
  })

  test('без фото и подкатегорий в черновике - avatarUrl null, learnSkills пустой', () => {
    const user = buildRegisteredUser(
      { ...DRAFT, avatarUrl: undefined, learnSkills: undefined },
      SKILL,
      NOW,
    )

    expect(user.avatarUrl).toBeNull()
    expect(user.learnSkills).toEqual([])
  })

  test.each(['email', 'name', 'birthDate', 'gender', 'cityId'])(
    'черновик без %s - ошибка',
    (field) => {
      expect(() => buildRegisteredUser({ ...DRAFT, [field]: undefined }, SKILL, NOW)).toThrow()
    },
  )

  test('черновик без данных шагов 1-2 - ошибка', () => {
    expect(() => buildRegisteredUser({}, SKILL, NOW)).toThrow()
  })
})
