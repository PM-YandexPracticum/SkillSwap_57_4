export const ROUTES = {
  HOME: '/',
  SKILL: '/skill/:id',
  PROFILE: '/profile',
  PROFILE_REQUESTS: '/profile/requests',
  PROFILE_EXCHANGES: '/profile/exchanges',
  PROFILE_SKILLS: '/profile/skills',
  FAVORITES: '/favorites',
  CREATE: '/create',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_ACCOUNT: '/register/account',
  REGISTER_USER: '/register/user',
  REGISTER_SKILL: '/register/skill',
  SERVER_ERROR: '/500',
} as const

export const STUB_ROUTES = {
  ABOUT: '/about',
  CONTACTS: '/contacts',
  BLOG: '/blog',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const

export const SKILL_CATEGORIES = [
  'Программирование',
  'Дизайн',
  'Языки',
  'Музыка',
  'Спорт',
  'Кулинария',
  'Фото и видео',
  'Бизнес',
  'Другое',
] as const

export const LOCAL_STORAGE_KEYS = {
  AUTH_USER: 'skillswap_auth_user',
  ACCOUNTS: 'skillswap_accounts',
  FAVORITES: 'skillswap_favorites',
  NOTIFICATIONS: 'skillswap_notifications',
  REQUESTS: 'skillswap_requests',
  THEME: 'skillswap_theme',
} as const

export const SESSION_STORAGE_KEYS = {
  REGISTRATION_DRAFT: 'skillswap_registration_draft',
} as const
