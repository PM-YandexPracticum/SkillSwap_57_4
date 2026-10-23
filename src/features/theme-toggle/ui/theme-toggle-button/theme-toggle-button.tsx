import { MoonIcon, SunIcon } from '@/shared/assets/icons'
import { IconButton } from '@/shared/ui/icon-button'
import type { ThemeToggleButtonProps } from './types'

export const ThemeToggleButton = ({ theme = 'light', onToggle }: ThemeToggleButtonProps) => {
  const isDark = theme === 'dark'
  const Icon = isDark ? SunIcon : MoonIcon
  const label = isDark ? 'Включить светлую тему' : 'Включить тёмную тему'

  return (
    <IconButton
      icon={<Icon />}
      aria-label={label}
      aria-disabled={onToggle ? undefined : 'true'}
      onClick={onToggle}
    />
  )
}
