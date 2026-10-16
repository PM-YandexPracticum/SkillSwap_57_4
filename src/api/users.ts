import type { User } from '@/shared/types'
import { getRegisteredUsers } from './accounts'

const BASE_URL = '/db'

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users.json`)
  if (!response.ok) throw new Error('Failed to fetch users')
  const users = (await response.json()) as User[]
  return [...users, ...getRegisteredUsers()]
}

export async function fetchUserById(id: string): Promise<User | undefined> {
  const users = await fetchUsers()
  return users.find((user) => user.id === id)
}
