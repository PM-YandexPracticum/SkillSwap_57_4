// ─── City ────────────────────────────────────────────────
export interface City {
  id: string
  name: string
}

// ─── Skill ───────────────────────────────────────────────
export type SkillType = 'teach' | 'learn'

export type SkillCategoryId =
  'business' | 'creativity' | 'languages' | 'education' | 'health' | 'home'

export interface SkillSubcategory {
  id: string
  name: string
}

export interface SkillCategory {
  id: SkillCategoryId
  name: string
  subcategories: SkillSubcategory[]
}

export interface Skill {
  id: string
  title: string
  description: string
  categoryId: SkillCategoryId
  subcategoryId: string
  images: string[]
}

// ─── User ────────────────────────────────────────────────
export type Gender = 'male' | 'female'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  createdAt: string
  birthDate: string
  gender: Gender
  cityId: string
  about: string
  likesCount: number
  favorites: string[]
  teachSkill: Skill
  learnSkills: string[]
}

// ─── Request ─────────────────────────────────────────────
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done'

export interface SwapRequest {
  id: string
  skillId: string
  fromUserId: string
  toUserId: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
}

// ─── Auth ────────────────────────────────────────────────
export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
}

// ─── Loading ─────────────────────────────────────────────
export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
