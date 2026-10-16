import type { AvatarSize } from '@/shared/ui/avatar/types'

export interface AvatarInputProps {
  src: string | null
  onChange: (file: File) => void
  size?: AvatarSize
  error?: string
  className?: string
}
