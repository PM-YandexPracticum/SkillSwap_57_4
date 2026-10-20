import { describe, expect, test } from 'vitest'
import { PASSWORD_MIN_LENGTH } from '@/entities/user'
import { accountSchema, getPasswordHint, PASSWORD_HINT } from './account-schema'

describe('accountSchema', () => {
  test('верные email и пароль проходят', async () => {
    const values = { email: 'test@example.com', password: 'Secret12!' }
    await expect(accountSchema.validate(values)).resolves.toEqual(values)
  })

  test('слабый пароль - ошибка в поле password', async () => {
    const values = { email: 'test@example.com', password: 'short' }
    await expect(accountSchema.validate(values)).rejects.toMatchObject({ path: 'password' })
  })

  test('неверный email - ошибка в поле email', async () => {
    const values = { email: 'anna', password: 'Secret12!' }
    await expect(accountSchema.validate(values)).rejects.toMatchObject({ path: 'email' })
  })

  test('PASSWORD_HINT упоминает минимальную длину', () => {
    expect(PASSWORD_HINT).toContain(String(PASSWORD_MIN_LENGTH))
  })
})

describe('getPasswordHint', () => {
  test.each([
    [''],
    ['short'],
    ['NoSpecial1'],
  ])('для некорректного пароля "%s" возвращает PASSWORD_HINT', (password) => {
    expect(getPasswordHint(password)).toBe(PASSWORD_HINT)
  })

  test.each([
    ['Secret12!'],
    ['Пароль12!'],
  ])('для корректного пароля "%s" возвращает "Надёжный"', (password) => {
    expect(getPasswordHint(password)).toBe('Надёжный')
  })
})