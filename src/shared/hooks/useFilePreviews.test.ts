import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFilePreviews } from './useFilePreviews'

const createFile = (name: string) => new File(['x'], name)

const files1 = [createFile('a.png'), createFile('b.png')]
const files2 = [createFile('c.png')]

describe('useFilePreviews', () => {
  let createObjectURLMock: ReturnType<typeof vi.fn>
  let revokeObjectURLMock: ReturnType<typeof vi.fn>
  let counter = 0

  beforeEach(() => {
    counter = 0
    createObjectURLMock = vi.fn(() => `blob:${++counter}`)
    revokeObjectURLMock = vi.fn()

    const OriginalURL = globalThis.URL
    const MockedURL = Object.assign(OriginalURL, {
      createObjectURL: createObjectURLMock,
      revokeObjectURL: revokeObjectURLMock,
    })

    vi.stubGlobal('URL', MockedURL)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('на каждый файл объект { file, url }', () => {
    const { result } = renderHook(() => useFilePreviews(files1))

    expect(result.current).toHaveLength(2)
    expect(result.current[0].file).toBe(files1[0])
    expect(result.current[0].url).toBe('blob:1')
    expect(result.current[1].url).toBe('blob:2')
  })

  test('при смене списка старые адреса освобождаются', () => {
    const { rerender } = renderHook(({ files }) => useFilePreviews(files), {
      initialProps: { files: files1 },
    })

    rerender({ files: files2 })

    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:1')
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:2')
  })

  test('при размонтировании освобождаются адреса', () => {
    const { unmount } = renderHook(() => useFilePreviews(files1))

    unmount()

    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:1')
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:2')
  })
})