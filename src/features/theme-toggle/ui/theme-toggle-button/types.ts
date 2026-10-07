export type Theme = 'light' | 'dark'

export interface ThemeToggleButtonProps {
  theme?: Theme
  onToggle?: () => void
}
