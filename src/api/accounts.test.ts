import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { User } from '@/shared/types'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import {
  EMAIL_TAKEN_ERROR,
  LOGIN_ERROR,
  getRegisteredUsers,
  isEmailTaken,
  loginAccount,
  registerAccount,
  updateAccountUser,
} from './accounts'
import { fetchUsers } from './users'

const mockUser: User = {
  id: 'user-1',
  name: 'Test',
  email: 'test@example.com',
  avatarUrl: null,
  createdAt: '2024-01-01',
  birthDate: '1990-01-01',
  gender: 'male',
  cityId: 'city-1',
  about: '',
  likesCount: 0,
  favorites: [],
  teachSkill: {
    id: 'skill-1',
    title: 'Test Skill',
    description: '',
    categoryId: 'creativity',
    subcategoryId: 'music-sound',
    images: [],
  },
  learnSkills: [],
}

const mockFetch = (body: unknown, ok = true) =>
  vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue({ ok, json: () => Promise.resolve(body) } as Response)

describe('accounts', () => {
  beforeEach(() => {
    localStorage.clear()
    mockFetch([{ ...mockUser, id: 'mock-user', email: 'mock@example.com' }])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getRegisteredUsers', () => {
    test('без аккаунтов - пустой массив', () => {
      expect(getRegisteredUsers()).toEqual([])
    })

    test('после registerAccount - этот пользователь (без пароля)', async () => {
      await registerAccount(mockUser, 'password')
      const users = getRegisteredUsers()
      expect(users).toHaveLength(1)
      expect(users[0]).toEqual(mockUser)
      expect('password' in users[0]).toBe(false)
    })

    test.each([
      ['не JSON', 'not-json'],
      ['не массив', '{}'],
    ])('испорченное значение (%s) - пустой массив', (_, raw) => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCOUNTS, raw)
      expect(getRegisteredUsers()).toEqual([])
    })
  })

  describe('registerAccount', () => {
    test('возвращает пользователя', async () => {
      const user = await registerAccount(mockUser, 'password')
      expect(user).toEqual(mockUser)
    })

    test('тот же email в другом регистре и с пробелами - ошибка', async () => {
      await registerAccount(mockUser, 'password')
      const sameEmail = { ...mockUser, id: 'user-2', email: '  TEST@Example.com ' }
      await expect(registerAccount(sameEmail, 'password')).rejects.toThrow(EMAIL_TAKEN_ERROR)
      expect(getRegisteredUsers()).toHaveLength(1)
    })

    test('email из users.json тоже занят', async () => {
      const newUser = { ...mockUser, id: 'user-2', email: 'mock@example.com' }
      await expect(registerAccount(newUser, 'password')).rejects.toThrow(EMAIL_TAKEN_ERROR)
      expect(getRegisteredUsers()).toHaveLength(0)
    })
  })

  describe('isEmailTaken', () => {
    test('true для email из users.json и зарегистрированного, без учёта регистра и пробелов', async () => {
      await registerAccount({ ...mockUser, id: 'user-2', email: 'reg@example.com' }, 'password')
      expect(await isEmailTaken(' MOCK@EXAMPLE.COM ')).toBe(true)
      expect(await isEmailTaken(' REG@EXAMPLE.COM ')).toBe(true)
    })

    test('false для нового', async () => {
      expect(await isEmailTaken('new@example.com')).toBe(false)
    })
  })

  describe('loginAccount', () => {
    test('верные данные - пользователь', async () => {
      await registerAccount({ ...mockUser, email: 'reg@example.com' }, 'password')
      const user = await loginAccount('reg@example.com', 'password')
      expect(user.email).toBe('reg@example.com')
    })

    test('email в другом регистре - вход проходит', async () => {
      await registerAccount({ ...mockUser, email: 'reg@example.com' }, 'password')
      const user = await loginAccount(' REG@EXAMPLE.COM ', 'password')
      expect(user.email).toBe('reg@example.com')
    })

    test('неверный пароль и неизвестный email - ошибка', async () => {
      await registerAccount({ ...mockUser, email: 'reg@example.com' }, 'password')
      await expect(loginAccount('reg@example.com', 'wrong')).rejects.toThrow(LOGIN_ERROR)
      await expect(loginAccount('unknown@example.com', 'password')).rejects.toThrow(LOGIN_ERROR)
    })
  })

  describe('updateAccountUser', () => {
    test('сохраняет изменения: видны в getRegisteredUsers и при следующем входе', async () => {
      const otherUser = { ...mockUser, id: 'user-2', email: 'other@example.com' }
      await registerAccount(mockUser, 'password')
      await registerAccount(otherUser, 'password')
      const updatedUser = { ...mockUser, name: 'Updated' }
      await updateAccountUser(updatedUser)

      expect(getRegisteredUsers()).toEqual([updatedUser, otherUser])
      const user = await loginAccount(mockUser.email, 'password')
      expect(user.name).toBe('Updated')
    })

    test('неизвестный id - ошибка "Аккаунт не найден"', async () => {
      await expect(updateAccountUser({ ...mockUser, id: 'unknown' })).rejects.toThrow(
        'Аккаунт не найден',
      )
    })
  })

  describe('fetchUsers', () => {
    test('возвращает моки и зарегистрированных вместе', async () => {
      await registerAccount({ ...mockUser, id: 'user-2', email: 'reg@example.com' }, 'password')
      const result = await fetchUsers()
      expect(result).toHaveLength(2)
      expect(result.map((u) => u.id)).toEqual(['mock-user', 'user-2'])
    })
  })
})
