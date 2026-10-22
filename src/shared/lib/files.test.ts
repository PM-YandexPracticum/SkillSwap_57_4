import { describe, expect, test } from 'vitest'
import { readFileAsDataUrl } from './files'

describe('[readFileAsDataUrl]', () => {
  test('возвращает содержимое файла в виде data URL', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })

    await expect(readFileAsDataUrl(file)).resolves.toBe('data:image/png;base64,aGVsbG8=')
  })
})
