import type { User } from '@/shared/types'

export type HeaderUser = Pick<User, 'name' | 'avatarUrl'>

export interface HeaderProps {
  user: HeaderUser | null
  onLogout: () => void
}
