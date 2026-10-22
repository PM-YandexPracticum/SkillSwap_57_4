import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'
import {
  addCategoriesOfSkills,
  getSubcategoryOptions,
  keepSkillsOfCategories,
} from './learn-skills'
import type { SkillCategory } from '@/shared/types'

const toOptions = (list: SkillCategory[]) =>
  list.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      value: subcategory.id,
      label: subcategory.name,
    })),
  )

const categories: SkillCategory[] = JSON.parse(
  readFileSync(resolve(process.cwd(), 'public/db/skills.json'), 'utf-8'),
)

describe('[getSubcategoryOptions]', () => {
  test('без категорий возвращает подкатегории всех категорий', () => {
    expect(getSubcategoryOptions(categories, [])).toEqual(toOptions(categories))
  })

  test('с категорией languages возвращает только её подкатегории в виде { value, label }', () => {
    const languages = categories.filter((category) => category.id === 'languages')
    const options = getSubcategoryOptions(categories, ['languages'])
    expect(options).toEqual(toOptions(languages))
    expect(options).toContainEqual({ value: 'english', label: 'Английский' })
    expect(options).not.toContainEqual({ value: 'music-sound', label: 'Музыка и звук' })
  })
})

describe('[addCategoriesOfSkills]', () => {
  test('дописывает категории выбранных подкатегорий', () => {
    const result = addCategoriesOfSkills(categories, ['business'], ['english', 'music-sound'])
    expect(result).toHaveLength(3)
    expect(result).toEqual(expect.arrayContaining(['business', 'creativity', 'languages']))
  })

  test('не дублирует уже выбранную категорию', () => {
    expect(addCategoriesOfSkills(categories, ['languages'], ['english', 'french'])).toEqual([
      'languages',
    ])
  })
})

describe('[keepSkillsOfCategories]', () => {
  test('убирает подкатегории других категорий', () => {
    expect(
      keepSkillsOfCategories(categories, ['languages'], ['english', 'music-sound', 'french']),
    ).toEqual(['english', 'french'])
  })

  test('без категорий подкатегорий не остаётся', () => {
    expect(keepSkillsOfCategories(categories, [], ['english', 'music-sound'])).toEqual([])
  })
})
