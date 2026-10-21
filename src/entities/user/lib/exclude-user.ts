import type { User } from '@/shared/types'

export function excludeUser(users: User[], userId: string | undefined): User[] {
  return userId ? users.filter((user) => user.id !== userId) : users
}
