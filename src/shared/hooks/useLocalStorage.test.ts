import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('без данных - initialValue', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  test('с сохранённым JSON - он', () => {
    localStorage.setItem('key', JSON.stringify('saved'))
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))
    expect(result.current[0]).toBe('saved')
  })

  test('не JSON - initialValue', () => {
    localStorage.setItem('key', 'not-json')
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  test('новое значение через сеттер видно в результате и записано в localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(JSON.parse(localStorage.getItem('key') ?? '')).toBe('updated')
  })

  test('запись не удалась - значение всё равно меняется, ошибка в консоли', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(consoleError).toHaveBeenCalledWith('Failed to save to localStorage: key')
  })
})
