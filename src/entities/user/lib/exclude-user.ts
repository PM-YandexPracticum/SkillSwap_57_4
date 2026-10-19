import type { User } from '@/shared/types'

export function excludeUser(users: User[], userId: string | undefined): User[] {
  if (!userId) {
    return users
  }

  return users.filter((user) => user.id !== userId)
}