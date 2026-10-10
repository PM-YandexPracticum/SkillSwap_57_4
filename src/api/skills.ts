import type { SkillCategory } from '@/shared/types'

const BASE_URL = '/db'

export async function fetchSkillCategories(): Promise<SkillCategory[]> {
  const response = await fetch(`${BASE_URL}/skills.json`)
  if (!response.ok) throw new Error('Failed to fetch skill categories')
  return response.json()
}
