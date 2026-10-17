import { describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCarouselState, type CarouselApi } from './useCarouselState'

type Handler = (api: CarouselApi) => void

function createFakeApi() {
  const state = { canScrollPrev: false, canScrollNext: true, selectedIndex: 0 }
  const handlers: Record<string, Handler[]> = {}
  const fake = {
    canScrollPrev: () => state.canScrollPrev,
    canScrollNext: () => state.canScrollNext,
    selectedScrollSnap: () => state.selectedIndex,

    on: vi.fn((e: string, handler: Handler) => {
      handlers[e] = [...(handlers[e] ?? []), handler]
      return fake
    }),
    off: vi.fn((e: string, handler: Handler) => {
      handlers[e] = (handlers[e] ?? []).filter((item) => item !== handler)
      return fake
    }),
  }

  const api = fake as unknown as CarouselApi
  const emit = (e: string) => handlers[e]?.forEach((handler) => handler(api))

  return { api, fake, state, handlers, emit }
}

describe('[useCarouselState]', () => {
  test('без карусели листать нельзя, выбран первый слайд', () => {
    const { result } = renderHook(() => useCarouselState(undefined))

    expect(result.current).toEqual({ canScrollPrev: false, canScrollNext: false, selectedIndex: 0 })
  })

  test('сразу считывает значения из карусели', () => {
    const { api } = createFakeApi()
    const { result } = renderHook(() => useCarouselState(api))

    expect(result.current).toEqual({ canScrollPrev: false, canScrollNext: true, selectedIndex: 0 })
  })

  test('после select возвращает новые значения', () => {
    const { api, state, emit } = createFakeApi()
    const { result } = renderHook(() => useCarouselState(api))

    state.canScrollPrev = true
    state.selectedIndex = 2
    act(() => emit('select'))

    expect(result.current).toEqual({ canScrollPrev: true, canScrollNext: true, selectedIndex: 2 })
  })

  test('после reInit возвращает новые значения', () => {
    const { api, state, emit } = createFakeApi()
    const { result } = renderHook(() => useCarouselState(api))

    state.canScrollNext = false
    act(() => emit('reInit'))

    expect(result.current).toEqual({ canScrollPrev: false, canScrollNext: false, selectedIndex: 0 })
  })

  test('при размонтировании отписывается от событий', () => {
    const { api, fake, handlers } = createFakeApi()
    const { unmount } = renderHook(() => useCarouselState(api))

    unmount()

    expect(fake.off).toHaveBeenCalledWith('select', expect.any(Function))
    expect(fake.off).toHaveBeenCalledWith('reInit', expect.any(Function))
    expect(handlers.select).toEqual([])
    expect(handlers.reInit).toEqual([])
  })
})
