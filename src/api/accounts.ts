import type { User } from '@/shared/types'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

const BASE_URL = '/db'
const ACCOUNT_NOT_FOUND_ERROR = 'Аккаунт не найден'

export const LOGIN_ERROR = 'Email или пароль введён неверно'
export const EMAIL_TAKEN_ERROR = 'Этот email уже зарегистрирован'

interface Account {
  user: User
  password: string
}

function readAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCOUNTS)
    if (!raw) return []

    const accounts: unknown = JSON.parse(raw)
    return Array.isArray(accounts) ? (accounts as Account[]) : []
  } catch {
    return []
  }
}

function writeAccounts(accounts: Account[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts))
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

async function fetchMockUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users.json`)
  if (!response.ok) throw new Error('Failed to fetch users')
  return response.json()
}

export function getRegisteredUsers(): User[] {
  return readAccounts().map(({ user }) => user)
}

export async function isEmailTaken(email: string): Promise<boolean> {
  const normalizedEmail = normalizeEmail(email)
  const mockUsers = await fetchMockUsers()
  const registeredUsers = getRegisteredUsers()

  return [...mockUsers, ...registeredUsers].some(
    (user) => normalizeEmail(user.email) === normalizedEmail,
  )
}

export async function registerAccount(user: User, password: string): Promise<User> {
  if (await isEmailTaken(user.email)) {
    throw new Error(EMAIL_TAKEN_ERROR)
  }

  const accounts = readAccounts()
  writeAccounts([...accounts, { user, password }])

  return user
}

export async function loginAccount(email: string, password: string): Promise<User> {
  const normalizedEmail = normalizeEmail(email)
  const account = readAccounts().find(
    ({ user, password: accountPassword }) =>
      normalizeEmail(user.email) === normalizedEmail && accountPassword === password,
  )

  if (!account) {
    throw new Error(LOGIN_ERROR)
  }

  return account.user
}

export async function updateAccountUser(user: User): Promise<User> {
  const accounts = readAccounts()
  const accountIndex = accounts.findIndex((account) => account.user.id === user.id)

  if (accountIndex === -1) {
    throw new Error(ACCOUNT_NOT_FOUND_ERROR)
  }

  const updatedAccounts = accounts.map((account, index) =>
    index === accountIndex ? { ...account, user } : account,
  )

  writeAccounts(updatedAccounts)
  return user
}
