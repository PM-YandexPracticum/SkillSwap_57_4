import { useState } from 'react'
import clsx from 'clsx'
import { UserCircleIcon } from '@/shared/assets/icons'
import { AvatarProps } from './types'
import styles from './avatar.module.css'

export const Avatar = ({ src, alt, size = 'm', className }: AvatarProps) => {
  const [hasError, setHasError] = useState(false)

  const showFallback = !src || hasError

  if (showFallback) {
    return (
      <UserCircleIcon
        className={clsx(styles.avatar, styles[size], styles.fallback, className)}
        role={alt ? 'img' : undefined}
        aria-label={alt ? alt : undefined}
        aria-hidden={!alt ? true : undefined}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={clsx(styles.avatar, styles[size], className)}
      onError={() => setHasError(true)}
    />
  )
}
