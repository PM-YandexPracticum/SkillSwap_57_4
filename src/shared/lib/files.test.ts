import { afterEach, describe, expect, test, vi } from 'vitest'
import type { FileRejection } from 'react-dropzone'
import { IMAGE_SIZE_ERROR, IMAGE_TYPE_ERROR, getRejectionError, readFileAsDataUrl } from './files'

const createRejection = (code: string, message: string): FileRejection => ({
  file: Object.assign(new File(['x'], 'photo.gif'), {
    path: './photo.gif',
    relativePath: './photo.gif',
  }),
  errors: [{ code, message }],
})

describe('[readFileAsDataUrl]', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('возвращает содержимое файла в виде data URL', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })

    await expect(readFileAsDataUrl(file)).resolves.toBe('data:image/png;base64,aGVsbG8=')
  })

  test('файл не прочитался - ошибка чтения', async () => {
    const readError = new DOMException('Файл недоступен', 'NotReadableError')
    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function (this: FileReader) {
      Object.defineProperty(this, 'error', { value: readError })
      this.dispatchEvent(new ProgressEvent('error'))
    })

    await expect(readFileAsDataUrl(new File(['x'], 'photo.png'))).rejects.toBe(readError)
  })
})

describe('[getRejectionError]', () => {
  test('пустой список - undefined', () => {
    expect(getRejectionError([])).toBeUndefined()
  })

  test('код file-invalid-type - IMAGE_TYPE_ERROR', () => {
    expect(getRejectionError([createRejection('file-invalid-type', 'bad type')])).toBe(
      IMAGE_TYPE_ERROR,
    )
  })

  test('код file-too-large - IMAGE_SIZE_ERROR', () => {
    expect(getRejectionError([createRejection('file-too-large', 'too large')])).toBe(
      IMAGE_SIZE_ERROR,
    )
  })

  test('другой код - message самой ошибки', () => {
    expect(getRejectionError([createRejection('unknown', 'custom message')])).toBe('custom message')
  })

  test('несколько отклонённых - текст по первому', () => {
    expect(
      getRejectionError([
        createRejection('file-too-large', 'too large'),
        createRejection('file-invalid-type', 'bad type'),
      ]),
    ).toBe(IMAGE_SIZE_ERROR)
  })
})
