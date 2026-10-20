import { describe, expect, test } from 'vitest'
import { emailRule, passwordRule, PASSWORD_MIN_LENGTH } from './user-field-rules'

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
      ['Ab1!', `Пароль - не менее ${PASSWORD_MIN_LENGTH} знаков`],
      ['Secret!!', 'Добавьте в пароль цифру'],
      ['SECRET12!', 'Добавьте в пароль строчную букву'],
      ['secret12!', 'Добавьте в пароль заглавную букву'],
      ['Secret123', 'Добавьте в пароль спецсимвол'],
      ['Secret 12', 'Добавьте в пароль спецсимвол'],
    ])('пароль %s вызывает ошибку "%s"', async (password, errorText) => {
      await expect(passwordRule.validate(password)).rejects.toThrow(errorText)
    })

    test.each([
      ['Secret12!'],
      ['Пароль12!'],
    ])('пароль %s проходит', async (password) => {
      await expect(passwordRule.validate(password)).resolves.toBe(password)
    })
  })
})