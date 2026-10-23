import { beforeEach, describe, expect, test } from 'vitest'
import { SESSION_STORAGE_KEYS } from '@/shared/lib/constants'
import {
  clearDraft,
  getFirstIncompleteStep,
  loadDraft,
  loadDraftImages,
  saveDraft,
  saveDraftImages,
  type RegistrationDraft,
} from './draft'

const ACCOUNT_STEP: RegistrationDraft = { email: 'anna@skillswap.com', password: 'Secret1234!' }

const USER_STEP: RegistrationDraft = {
  name: 'Анна',
  birthDate: '2000-05-15',
  gender: 'female',
  cityId: 'moscow',
  learnCategories: ['languages'],
  learnSkills: ['english'],
}

const SKILL: RegistrationDraft['skill'] = {
  title: 'Игра на гитаре',
  categoryId: 'creativity',
  subcategoryId: 'music-sound',
  description: 'Научу играть аккордами',
}

const PHOTO = new File(['x'], 'photo.png', { type: 'image/png' })
const SECOND_PHOTO = new File(['y'], 'second.png', { type: 'image/png' })

describe('[draft]', () => {
  beforeEach(() => {
    sessionStorage.clear()
    clearDraft()
  })

  test('без сохранённого черновика возвращает пустой объект', () => {
    expect(loadDraft()).toEqual({})
  })

  test('испорченное значение читается как пустой черновик', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.REGISTRATION_DRAFT, '{не json :)')

    expect(loadDraft()).toEqual({})
  })

  test('saveDraft сохраняет черновик, loadDraft читает его', () => {
    saveDraft(ACCOUNT_STEP)

    expect(loadDraft()).toEqual(ACCOUNT_STEP)
  })

  test('saveDraft дописывает поля к уже сохранённым', () => {
    saveDraft(ACCOUNT_STEP)
    saveDraft({ name: 'Анна' })

    expect(loadDraft()).toEqual({ ...ACCOUNT_STEP, name: 'Анна' })
  })

  test('saveDraft заменяет значение уже сохранённого поля', () => {
    saveDraft(ACCOUNT_STEP)
    saveDraft({ email: 'new@skillswap.com' })

    expect(loadDraft()).toEqual({ ...ACCOUNT_STEP, email: 'new@skillswap.com' })
  })

  test('clearDraft удаляет черновик', () => {
    saveDraft(ACCOUNT_STEP)
    clearDraft()

    expect(sessionStorage.getItem(SESSION_STORAGE_KEYS.REGISTRATION_DRAFT)).toBeNull()
    expect(loadDraft()).toEqual({})
  })

  test('поля навыка сохраняются рядом с полями шагов 1 и 2', () => {
    saveDraft({ ...ACCOUNT_STEP, ...USER_STEP })
    saveDraft({ skill: SKILL })

    expect(loadDraft()).toEqual({ ...ACCOUNT_STEP, ...USER_STEP, skill: SKILL })
  })

  describe('фото навыка', () => {
    test('без сохранённых фото - пустой список', () => {
      expect(loadDraftImages()).toEqual([])
    })

    test('saveDraftImages сохраняет фото, loadDraftImages возвращает те же файлы', () => {
      saveDraftImages([PHOTO, SECOND_PHOTO])
      const images = loadDraftImages()

      expect(images).toHaveLength(2)
      expect(images[0]).toBe(PHOTO)
      expect(images[1]).toBe(SECOND_PHOTO)
    })

    test('saveDraftImages заменяет прежние фото: удалённое не возвращается', () => {
      saveDraftImages([PHOTO, SECOND_PHOTO])
      saveDraftImages([SECOND_PHOTO])
      const images = loadDraftImages()

      expect(images).toHaveLength(1)
      expect(images[0]).toBe(SECOND_PHOTO)
    })

    test('clearDraft удаляет и фото', () => {
      saveDraftImages([PHOTO])
      clearDraft()

      expect(loadDraftImages()).toEqual([])
    })
  })

  describe('getFirstIncompleteStep', () => {
    test('пустой черновик - шаг account', () => {
      expect(getFirstIncompleteStep({})).toBe('account')
    })

    test('без пароля - шаг account', () => {
      expect(getFirstIncompleteStep({ email: ACCOUNT_STEP.email })).toBe('account')
    })

    test('после заполненного шага 1 - шаг user', () => {
      expect(getFirstIncompleteStep(ACCOUNT_STEP)).toBe('user')
    })

    test('после шага 2 - шаг skill', () => {
      expect(getFirstIncompleteStep({ ...ACCOUNT_STEP, ...USER_STEP })).toBe('skill')
    })

    test.each(['name', 'birthDate', 'gender', 'cityId'] as const)(
      'без поля %s - шаг user',
      (field) => {
        const draft = { ...ACCOUNT_STEP, ...USER_STEP, [field]: undefined }

        expect(getFirstIncompleteStep(draft)).toBe('user')
      },
    )

    test('без подкатегорий - шаг user', () => {
      const draft = { ...ACCOUNT_STEP, ...USER_STEP, learnSkills: [] }

      expect(getFirstIncompleteStep(draft)).toBe('user')
    })
  })
})
