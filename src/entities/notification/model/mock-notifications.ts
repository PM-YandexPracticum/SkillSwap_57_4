import type { AppNotification } from './types'

export type MockNotification = Omit<AppNotification, 'id' | 'userId' | 'createdAt'> & {
  daysAgo: number
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    kind: 'accepted',
    title: 'Николай принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    isRead: false,
    daysAgo: 0,
  },
  {
    kind: 'incoming',
    title: 'Татьяна предложила вам обмен',
    description: 'Примите обмен, чтобы обсудить детали',
    isRead: false,
    daysAgo: 0,
  },
  {
    kind: 'incoming',
    title: 'Олег предложил вам обмен',
    description: 'Примите обмен, чтобы обсудить детали',
    isRead: true,
    daysAgo: 1,
  },
  {
    kind: 'accepted',
    title: 'Игорь принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    isRead: true,
    daysAgo: 10,
  },
  {
    kind: 'incoming',
    title: 'Константин предложил вам обмен',
    description: 'Примите обмен, чтобы обсудить детали',
    isRead: false,
    daysAgo: 1,
  },
  {
    kind: 'accepted',
    title: 'Анна-София-Виктория приняла ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    isRead: false,
    daysAgo: 2,
  },
]
