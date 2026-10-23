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
  test('верные данные проходят, пробелы по краям "О себе" обрезаются', async () => {
    await expect(
      profileSchema.validate({ ...VALUES, about: '  Люблю путешествовать  ' }),
    ).resolves.toEqual(VALUES)
  })

  test('без фото и "О себе" проходит: фото - null, "О себе" - пустая строка', async () => {
    await expect(
      profileSchema.validate({ ...VALUES, avatarUrl: undefined, about: undefined }),
    ).resolves.toEqual({ ...VALUES, avatarUrl: null, about: '' })
  })

  test('"О себе" ровно максимум символов проходит', async () => {
    const longest = 'a'.repeat(ABOUT_MAX_LENGTH)

    await expect(profileSchema.validateAt('about', { ...VALUES, about: longest })).resolves.toBe(
      longest,
    )
  })

  test('"О себе" длиннее максимума - ошибка', async () => {
    await expect(
      profileSchema.validateAt('about', { ...VALUES, about: 'a'.repeat(ABOUT_MAX_LENGTH + 1) }),
    ).rejects.toThrow(`Не больше ${ABOUT_MAX_LENGTH} символов`)
  })

  test.each([
    ['name', '', 'Введите имя'],
    ['email', 'anna', 'Введите корректный email'],
    ['birthDate', '', 'Укажите дату рождения'],
    ['gender', '', 'Укажите пол'],
    ['cityId', '', 'Выберите город'],
  ])('общие правила подключены: %s = %j - "%s"', async (field, value, message) => {
    await expect(profileSchema.validateAt(field, { ...VALUES, [field]: value })).rejects.toThrow(
      message,
    )
  })
})
