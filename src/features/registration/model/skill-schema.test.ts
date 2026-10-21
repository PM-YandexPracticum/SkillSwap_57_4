import { describe, expect, test } from 'vitest'
import {
  DESCRIPTION_MAX_LENGTH,
  skillSchema,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  type SkillFormValues,
} from './skill-schema'

const TITLE_LENGTH_ERROR = `Название - от ${TITLE_MIN_LENGTH} до ${TITLE_MAX_LENGTH} символов`

const VALUES: SkillFormValues = {
  title: 'Игра на гитаре',
  categoryId: 'creativity',
  subcategoryId: 'music-sound',
  description: 'Научу играть аккордами и перебором',
  images: [new File(['x'], 'photo.png', { type: 'image/png' })],
}

const validateField = (field: keyof SkillFormValues, value: unknown) =>
  skillSchema.validateAt(field, { ...VALUES, [field]: value })

describe('[skillSchema]', () => {
  test('верные данные проходят, пробелы по краям названия и описания обрезаются', async () => {
    await expect(
      skillSchema.validate({ ...VALUES, title: '  Игра на гитаре   ', description: ' Научу   ' }),
    ).resolves.toEqual({ ...VALUES, description: 'Научу' })
  })

  describe('название', () => {
    test('пусто = "Введите название навыка"', async () => {
      await expect(validateField('title', '')).rejects.toThrow('Введите название навыка')
    })

    test.each([
      ['короче минимума', 'a'.repeat(TITLE_MIN_LENGTH - 1)],
      ['длиннее максимума', 'a'.repeat(TITLE_MAX_LENGTH + 1)],
    ])('%s - одна и та же ошибка длины', async (_, title) => {
      await expect(validateField('title', title)).rejects.toThrow(TITLE_LENGTH_ERROR)
    })

    test('границы длины проходят', async () => {
      await expect(validateField('title', 'a'.repeat(TITLE_MIN_LENGTH))).resolves.toBeTruthy()
      await expect(validateField('title', 'a'.repeat(TITLE_MAX_LENGTH))).resolves.toBeTruthy()
    })
  })

  test('без категории - ошибка "Выберите категорию"', async () => {
    await expect(validateField('categoryId', '')).rejects.toThrow('Выберите категорию')
  })

  test('без подкатегории - ошибка "Выберите подкатегорию"', async () => {
    await expect(validateField('subcategoryId', '')).rejects.toThrow('Выберите подкатегорию')
  })

  describe('описание', () => {
    test.each(['', '       '])('%j - "Опишите, чему можете научить"', async (description) => {
      await expect(validateField('description', description)).rejects.toThrow(
        'Опишите, чему можете научить',
      )
    })

    test('длиннее максимума - ошибка "Описание - не больше 500 символов"', async () => {
      await expect(
        validateField('description', 'a'.repeat(DESCRIPTION_MAX_LENGTH + 1)),
      ).rejects.toThrow(`Описание - не больше ${DESCRIPTION_MAX_LENGTH} символов`)
    })
  })

  test('без фото - ошибка "Добавьте хотя бы одно изображение"', async () => {
    await expect(validateField('images', [])).rejects.toThrow('Добавьте хотя бы одно изображение')
  })
})
