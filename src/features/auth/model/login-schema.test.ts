import { describe, expect, test } from 'vitest'
import { loginSchema } from './login-schema'

describe('loginSchema', () => {
  test('верные данные проходят, пробелы по краям email обрезаются', async () => {
    const values = { email: '  test@example.com  ', password: 'any' }
    const result = await loginSchema.validate(values)
    expect(result.email).toBe('test@example.com')
  })

  test('пустой email - "Введите email"', async () => {
    await expect(loginSchema.validateAt('email', { email: '', password: 'any' })).rejects.toThrow(
      'Введите email',
    )
  })

  test('не похоже на email - "Введите корректный email"', async () => {
    await expect(
      loginSchema.validateAt('email', { email: 'anna', password: 'any' }),
    ).rejects.toThrow('Введите корректный email')
  })

  test('пустой пароль - "Введите пароль"', async () => {
    await expect(
      loginSchema.validateAt('password', { email: 'test@example.com', password: '' }),
    ).rejects.toThrow('Введите пароль')
  })

  test('любой непустой пароль проходит', async () => {
    await expect(
      loginSchema.validate({ email: 'test@example.com', password: '1' }),
    ).resolves.toBeTruthy()
  })
})