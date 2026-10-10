import type { ComponentPropsWithoutRef } from 'react'

export interface LikeButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  isLiked?: boolean
  count?: number
}
