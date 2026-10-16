export type AvatarSize = 's' | 'm' | 'l' | 'form'

export interface AvatarProps {
  src?: string | null
  alt: string
  size?: AvatarSize
  className?: string
}
