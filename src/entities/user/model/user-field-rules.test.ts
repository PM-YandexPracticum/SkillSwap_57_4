import { describe, expect, test } from 'vitest'
import { addDays, format } from 'date-fns'
import {
  emailRule,
  passwordRule,
  PASSWORD_MIN_LENGTH,
  nameRule,
  birthDateRule,
  genderRule,
  cityIdRule,
} from './user-field-rules'

const DATE_FORMAT = 'yyyy-MM-dd'

describe('userFieldRules', () => {
  describe('emailRule', () => {
    test('пустое значение - ошибка "Введите email"', async () => {
      await expect(emailRule.validate('')).rejects.toThrow('Введите email')
    })

    test('некорректный email - ошибка "Введите корректный email"', async () => {
      await expect(emailRule.validate('anna')).rejects.toThrow('Введите корректный email')
    })

    test('корректный email проходит', async () => {
      await expect(emailRule.validate('test@example.com')).resolves.toBe('test@example.com')
    })

    test('пробелы по краям обрезаются', async () => {
      await expect(emailRule.validate('  test@example.com  ')).resolves.toBe('test@example.com')
    })
  })

  describe('passwordRule', () => {
    test.each([
      ['', 'Придумайте пароль'],
      ['Secre1!', `Пароль - не менее ${PASSWORD_MIN_LENGTH} знаков`],
      ['Secret!!', 'Добавьте в пароль цифру'],
      ['SECRET12!', 'Добавьте в пароль строчную букву'],
      ['secret12!', 'Добавьте в пароль заглавную букву'],
      ['Secret123', 'Добавьте в пароль спецсимвол'],
      ['Secret 12', 'Добавьте в пароль спецсимвол'],
    ])('пароль %s вызывает ошибку "%s"', async (password, errorText) => {
      await expect(passwordRule.validate(password)).rejects.toThrow(errorText)
    })

    test.each(['Secret1!', 'Secret12!', 'Пароль12!'])('пароль %s проходит', async (password) => {
      await expect(passwordRule.validate(password)).resolves.toBe(password)
    })
  })

  describe('nameRule', () => {
    test.each([
      ['пустое значение', ''],
      ['одни пробелы', '   '],
    ])('%s - ошибка "Введите имя"', async (_title, name) => {
      await expect(nameRule.validate(name)).rejects.toThrow('Введите имя')
    })

    test('пробелы по краям обрезаются', async () => {
      await expect(nameRule.validate('  Анна  ')).resolves.toBe('Анна')
    })
  })

  describe('birthDateRule', () => {
    test('пустое значение - ошибка "Укажите дату рождения"', async () => {
      await expect(birthDateRule.validate('')).rejects.toThrow('Укажите дату рождения')
    })

    test('завтрашняя дата - ошибка "Дата рождения не может быть в будущем"', async () => {
      const tomorrow = format(addDays(new Date(), 1), DATE_FORMAT)
      await expect(birthDateRule.validate(tomorrow)).rejects.toThrow(
        'Дата рождения не может быть в будущем',
      )
    })

    test.each([
      ['сегодняшняя дата', () => format(new Date(), DATE_FORMAT)],
      ['прошлая дата', () => '1995-06-14'],
    ])('%s проходит', async (_title, getDate) => {
      const date = getDate()
      await expect(birthDateRule.validate(date)).resolves.toBe(date)
    })
  })

  describe('genderRule', () => {
    test.each(['male', 'female'])('значение %s проходит', async (gender) => {
      await expect(genderRule.validate(gender)).resolves.toBe(gender)
    })

    test.each([
      ['другое значение', 'other'],
      ['undefined', undefined],
    ])('%s - ошибка "Укажите пол"', async (_title, gender) => {
      await expect(genderRule.validate(gender)).rejects.toThrow('Укажите пол')
    })
  })

  describe('cityIdRule', () => {
    test('пустое значение - ошибка "Выберите город"', async () => {
      await expect(cityIdRule.validate('')).rejects.toThrow('Выберите город')
    })
  })
})
