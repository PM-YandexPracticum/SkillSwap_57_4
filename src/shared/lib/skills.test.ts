import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'
import type { SkillCategory } from '@/shared/types'
import { findSubcategory } from './skills'

const categories: SkillCategory[] = JSON.parse(
  readFileSync(resolve(process.cwd(), 'public/db/skills.json'), 'utf-8'),
)

describe('findSubcategory', () => {
  test('находит подкатегорию по id и возвращает её категорию', () => {
    const result = findSubcategory('music-sound', categories)

    expect(result?.subcategory.id).toBe('music-sound')
    expect(result?.category.id).toBe('creativity')
  })

  test('возвращает undefined для неизвестного id', () => {
    expect(findSubcategory('unknown-id', categories)).toBeUndefined()
  })

  test('возвращает undefined, если передан id категории, а не подкатегории', () => {
    expect(findSubcategory('creativity', categories)).toBeUndefined()
  })
})