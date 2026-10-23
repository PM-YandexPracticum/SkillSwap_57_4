import { SESSION_STORAGE_KEYS } from '@/shared/lib/constants'
import type { Gender } from '@/shared/types'
import type { SkillFormValues } from './skill-schema'

export type RegistrationStep = 'account' | 'user' | 'skill'
export type SkillDraft = Partial<Omit<SkillFormValues, 'images'>>

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
  skill?: SkillDraft
}

let draftImages: File[] = []

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
  draftImages = []
}

export const loadDraftImages = (): File[] => draftImages

export const saveDraftImages = (images: File[]): void => {
  draftImages = images
}

export const getFirstIncompleteStep = (draft: RegistrationDraft): RegistrationStep => {
  if (!draft.email || !draft.password) return 'account'

  const isUserStepDone =
    draft.name && draft.birthDate && draft.gender && draft.cityId && draft.learnSkills?.length
  if (!isUserStepDone) return 'user'

  return 'skill'
}
