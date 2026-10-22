import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { SESSION_STORAGE_KEYS } from './constants'
import { clearSkillCreated, isSkillCreated, markSkillCreated } from './skill-created'

describe('[skillCreated]', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('без отметки - false', () => {
    expect(isSkillCreated()).toBe(false)
  })

  test('markSkillCreated ставит отметку в sessionStorage', () => {
    markSkillCreated()

    expect(isSkillCreated()).toBe(true)
    expect(sessionStorage.getItem(SESSION_STORAGE_KEYS.SKILL_CREATED)).not.toBeNull()
  })

  test('clearSkillCreated убирает отметку', () => {
    markSkillCreated()
    clearSkillCreated()

    expect(isSkillCreated()).toBe(false)
  })

  test('хранилище недоступно - ничего не падает, отметки нет', () => {
    const fail = () => {
      throw new Error('SecurityError')
    }
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(fail)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(fail)
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(fail)

    expect(() => markSkillCreated()).not.toThrow()
    expect(() => clearSkillCreated()).not.toThrow()
    expect(isSkillCreated()).toBe(false)
  })
})
