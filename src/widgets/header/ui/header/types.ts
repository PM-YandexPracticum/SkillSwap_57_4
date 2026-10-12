export type HeaderUser = {
  name: string
  avatarUrl: string | null
}

export interface HeaderProps {
  user: HeaderUser | null
  onLogout: () => void
}
