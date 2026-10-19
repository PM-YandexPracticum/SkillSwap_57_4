export type NotificationKind = 'incoming' | 'sent' | 'accepted'

export interface AppNotification {
  id: string
  userId: string
  kind: NotificationKind
  title: string
  description?: string
  createdAt: string
  isRead: boolean
}
