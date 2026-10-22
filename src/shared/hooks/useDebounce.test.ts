import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useDebounce } from './useDebounce'

const DELAY = 300

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('сразу возвращает начальное значение', () => {
    const { result } = renderHook(() => useDebounce('initial', DELAY))
    expect(result.current).toBe('initial')
  })

  test('после смены значения до конца задержки - старое, после - новое', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, DELAY), {
      initialProps: { value: 'first' },
    })

    rerender({ value: 'second' })
    act(() => {
      vi.advanceTimersByTime(DELAY - 1)
    })
    expect(result.current).toBe('first')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('second')
  })

  test('несколько смен подряд дают только последнее значение', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, DELAY), {
      initialProps: { value: 'first' },
    })

    rerender({ value: 'second' })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    rerender({ value: 'third' })
    act(() => {
      vi.advanceTimersByTime(DELAY - 100)
    })
    expect(result.current).toBe('first')

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('third')
  })
})
