import type { AvatarSize } from '@/shared/ui/avatar'

type UserInfoAvatarPosition = 'left' | 'right'
type UserInfoNameTag = 'h2' | 'h3' | 'span'

export interface UserInfoProps {
  name: string
  avatarUrl?: string | null
  subtitle?: string
  avatarSize?: AvatarSize
  avatarPosition?: UserInfoAvatarPosition
  nameAs?: UserInfoNameTag
  className?: string
}
