import { SESSION_STORAGE_KEYS } from '@/shared/lib/constants'
import type { Gender } from '@/shared/types'

export type RegistrationStep = 'account' | 'user' | 'skill'

export interface RegistrationDraft {
  email?: string
  password?: string
  name?: string
  birthDate?: string
  gender?: Gender
  cityId?: string
  avatarUrl?: string | null
  learnCategories?: string[]
  learnSkills?: string[]
}

export const loadDraft = (): RegistrationDraft => {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEYS.REGISTRATION_DRAFT)
    return raw ? (JSON.parse(raw) as RegistrationDraft) : {}
  } catch {
    return {}
  }
}

export const saveDraft = (part: Partial<RegistrationDraft>): void => {
  const draft = { ...loadDraft(), ...part }
  sessionStorage.setItem(SESSION_STORAGE_KEYS.REGISTRATION_DRAFT, JSON.stringify(draft))
}

export const clearDraft = (): void => {
  sessionStorage.removeItem(SESSION_STORAGE_KEYS.REGISTRATION_DRAFT)
}

export const getFirstIncompleteStep = (draft: RegistrationDraft): RegistrationStep => {
  if (!draft.email || !draft.password) return 'account'

  const isUserStepDone =
    draft.name && draft.birthDate && draft.gender && draft.cityId && draft.learnSkills?.length
  if (!isUserStepDone) return 'user'

  return 'skill'
}
