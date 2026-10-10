export type { AuthUser, Gender, User } from '@/shared/types'

export interface CardTag {
  id: string
  label: string
  category: string | 'more'
}

export interface UserCardData {
  id: string
  skillId: string
  name: string
  avatarUrl: string | null
  subtitle: string
  about: string
  likesCount: number
  teachTag: CardTag
  learnTags: CardTag[]
}
