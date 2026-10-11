export interface UserMenuProps {
  name: string
  avatarUrl?: string | null
  onProfileClick: () => void
  onLogout: () => void
}
