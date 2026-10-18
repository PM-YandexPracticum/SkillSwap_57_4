import type { User } from '@/shared/types'

export const sortByNewest = (users: User[]): User[] => {
  return [...users].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}
