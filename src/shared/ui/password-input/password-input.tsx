import { forwardRef, useState } from 'react'
import { Input } from '@/shared/ui/input'
import { IconButton } from '@/shared/ui/icon-button'
import { EyeIcon, EyeSlashIcon } from '@/shared/assets/icons'
import type { PasswordInputProps } from './types'

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev)
  }

  return (
    <Input
      {...props}
      ref={ref}
      type={isVisible ? 'text' : 'password'}
      endAdornment={
        <IconButton
          icon={isVisible ? <EyeSlashIcon /> : <EyeIcon />}
          aria-label={isVisible ? 'Скрыть пароль' : 'Показать пароль'}
          onClick={toggleVisibility}
        />
      }
    />
  )
})

PasswordInput.displayName = 'PasswordInput'
