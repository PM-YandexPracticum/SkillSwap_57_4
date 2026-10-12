import { forwardRef, useState } from 'react'
import { PasswordInputProps } from './types'
import { Input } from '@/shared/ui/input'
import { IconButton } from '@/shared/ui/icon-button'
import EyeIcon from '@/shared/assets/icons/eye.svg?react'
import EyeSlashIcon from '@/shared/assets/icons/eye-slash.svg?react'

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
          type="button"
        />
      }
    />
  )
})

PasswordInput.displayName = 'PasswordInput'
