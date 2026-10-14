import { describe, expect, test } from 'vitest'
import { formatAge, getAge, pluralize, shuffle } from './helpers'

describe('helpers', () => {
  describe('pluralize', () => {
    const ageForms: [string, string, string] = ['год', 'года', 'лет']

    test('корректно выбирает форму слова для всех контрольных чисел', () => {
      expect(pluralize(1, ageForms)).toBe('год')
      expect(pluralize(2, ageForms)).toBe('года')
      expect(pluralize(5, ageForms)).toBe('лет')
      expect(pluralize(11, ageForms)).toBe('лет')
      expect(pluralize(12, ageForms)).toBe('лет')
      expect(pluralize(14, ageForms)).toBe('лет')
      expect(pluralize(21, ageForms)).toBe('год')
      expect(pluralize(22, ageForms)).toBe('года')
      expect(pluralize(25, ageForms)).toBe('лет')
      expect(pluralize(111, ageForms)).toBe('лет')
    })
  })

  describe('getAge', () => {
    const fixedNow = new Date('2026-10-04T12:00:00')

    test('день рождения в этом году уже был', () => {
      expect(getAge('2000-05-15', fixedNow)).toBe(26)
    })

    test('день рождения сегодня', () => {
      expect(getAge('2000-10-04', fixedNow)).toBe(26)
    })

    test('день рождения ещё не наступил', () => {
      expect(getAge('2000-12-20', fixedNow)).toBe(25)
    })

    test('день рождения 29 февраля в високосный и не високосный год', () => {
      expect(getAge('2004-02-29', new Date('2026-02-28T12:00:00'))).toBe(21)
      expect(getAge('2004-02-29', new Date('2026-03-01T12:00:00'))).toBe(22)
    })

    test('переданы невалидные данные - возвращает null', () => {
      expect(getAge('2026-10-05', fixedNow)).toBeNull()
      expect(getAge('2026-02-30', fixedNow)).toBeNull()
      expect(getAge('2023-13-01', fixedNow)).toBeNull()
      expect(getAge('02.02.1992', fixedNow)).toBeNull()
      expect(getAge('', fixedNow)).toBeNull()
    })
  })

  describe('formatAge', () => {
    test('корректно форматирует возраст с числом', () => {
      expect(formatAge(21)).toBe('21 год')
      expect(formatAge(34)).toBe('34 года')
      expect(formatAge(25)).toBe('25 лет')
    })
  })

  describe('shuffle', () => {
    const items = [1, 2, 3, 4, 5]

    test('содержит тот же набор элементов, что и исходный массив', () => {
      const result = shuffle(items)

      expect(result).toHaveLength(items.length)
      expect([...result].sort((a, b) => a - b)).toEqual(items)
    })

    test('не меняет исходный массив и возвращает новый', () => {
      const original = [...items]
      const result = shuffle(items)

      expect(items).toEqual(original)
      expect(result).not.toBe(items)
    })

    test('при фиксированном random результат предсказуем', () => {
      expect(shuffle(items, () => 0)).toEqual([2, 3, 4, 5, 1])
      expect(shuffle(items, () => 0.99)).toEqual([1, 2, 3, 4, 5])
    })

    test('корректно работает с пустым массивом и массивом из одного элемента', () => {
      expect(shuffle([])).toEqual([])
      expect(shuffle(['a'])).toEqual(['a'])
    })
  })
})
