import { describe, expect, test } from 'vitest'
import { userSchema } from './user-schema'

const VALID_VALUES = {
  name: 'Анна',
  birthDate: '1995-06-14',
  gender: 'female',
  cityId: 'moscow',
  learnCategories: ['languages'],
  learnSkills: ['english'],
}

const AVATAR_URL = 'data:image/png;base64,aGVsbG8='

describe('[userSchema]', () => {
  test('полный набор проходит, фото по умолчанию null', async () => {
    await expect(userSchema.validate(VALID_VALUES)).resolves.toEqual({
      ...VALID_VALUES,
      avatarUrl: null,
    })
  })

  test('фото сохраняется как есть', async () => {
    const values = { ...VALID_VALUES, avatarUrl: AVATAR_URL }
    await expect(userSchema.validate(values)).resolves.toEqual(values)
  })

  test.each([
    ['без категорий', 'Выберите хотя бы одну категорию', { learnCategories: [] }],
    ['без подкатегорий', 'Выберите хотя бы одну подкатегорию', { learnSkills: [] }],
  ])('%s - ошибка "%s"', async (_title, errorText, change) => {
    await expect(userSchema.validate({ ...VALID_VALUES, ...change })).rejects.toThrow(errorText)
  })

  test('правила полей подключены, пустое имя - ошибка "Введите имя"', async () => {
    await expect(userSchema.validate({ ...VALID_VALUES, name: '' })).rejects.toThrow('Введите имя')
  })
})
