import { describe, expect, test } from 'vitest'
import { ABOUT_MAX_LENGTH, profileSchema } from './profile-schema'

const VALUES = {
  avatarUrl: null,
  email: 'ivan@skillswap.com',
  name: 'Иван',
  birthDate: '2002-04-12',
  gender: 'male',
  cityId: 'moscow',
  about: 'Люблю путешествовать',
}

describe('[profileSchema]', () => {
  test('верные данны проходят', async () => {
    await expect(profileSchema.validate(VALUES)).resolves.toEqual(VALUES)
  })

  test('"О себе" длиннее максимума - ошибка', async () => {
    await expect(
      profileSchema.validateAt('about', { ...VALUES, about: 'a'.repeat(ABOUT_MAX_LENGTH + 1) }),
    ).rejects.toThrow(`Не больше ${ABOUT_MAX_LENGTH} символов`)
  })

  test('общие правила полей подключены', async () => {
    await expect(profileSchema.validateAt('name', { ...VALUES, name: '' })).rejects.toThrow(
      'Введите имя',
    )
    await expect(profileSchema.validateAt('email', { ...VALUES, email: 'anna' })).rejects.toThrow(
      'Введите корректный email',
    )
  })
})
