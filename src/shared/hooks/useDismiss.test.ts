import { beforeEach, describe, expect, test, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDismiss } from './useDismiss'

function createRef() {
  const element = document.createElement('div')
  document.body.appendChild(element)

  return { current: element }
}

function mousedDown(target: Element) {
  target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
}

function pressEscape() {
  document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
}

describe('[useDismiss]', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('вызывает onDismiss при клике вне элемента', () => {
    const ref = createRef()
    const onDismiss = vi.fn()

    renderHook(() => useDismiss({ ref, onDismiss, isActive: true }))
    mousedDown(document.body)

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  test('не вызывает onDismiss при клике внутри элемента', () => {
    const ref = createRef()
    const onDismiss = vi.fn()
    const childButton = document.createElement('button')
    ref.current.appendChild(childButton)

    renderHook(() => useDismiss({ ref, onDismiss, isActive: true }))
    mousedDown(childButton)

    expect(onDismiss).not.toHaveBeenCalled()
  })

  test('вызывает onDismiss по нажатию esc', () => {
    const ref = createRef()
    const onDismiss = vi.fn()

    renderHook(() => useDismiss({ ref, onDismiss, isActive: true }))
    pressEscape()

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  test('ничего не делает, если isActive === false', () => {
    const ref = createRef()
    const onDismiss = vi.fn()

    renderHook(() => useDismiss({ ref, onDismiss, isActive: false }))
    mousedDown(document.body)
    pressEscape()

    expect(onDismiss).not.toHaveBeenCalled()
  })

  test('снимает обработчики при размонтировании', () => {
    const ref = createRef()
    const onDismiss = vi.fn()

    const { unmount } = renderHook(() => useDismiss({ ref, onDismiss, isActive: false }))
    unmount()
    mousedDown(document.body)
    pressEscape()

    expect(onDismiss).not.toHaveBeenCalled()
  })
})
