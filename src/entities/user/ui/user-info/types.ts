type UserInfoAvatarSize = 's' | 'm' | 'l'
type UserInfoAvatarPosition = 'left' | 'right'
type UserInfoNameTag = 'h2' | 'h3' | 'span'

export interface UserInfoProps {
  name: string
  avatarUrl: string | null
  subtitle?: string
  avatarSize?: UserInfoAvatarSize
  avatarPosition?: UserInfoAvatarPosition
  nameAs?: UserInfoNameTag
  className?: string
}
