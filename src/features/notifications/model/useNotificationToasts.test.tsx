import type { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { toast, type ToastT } from 'sonner'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { addNotification, type AppNotification } from '@/entities/notification'
import type { AuthUser } from '@/shared/types'
import { setupStore } from '@/store'
import { TOAST_STAGGER, useNotificationToasts } from './useNotificationToasts'

vi.mock('sonner', () => ({ toast: { custom: vi.fn(), dismiss: vi.fn() } }))

const AUTH_USER: AuthUser = {
  id: 'user-01',
  name: 'Иван',
  email: 'user01@skillswap.com',
  token: 'mock_token_user-01',
}

const makeNotification = (
  id: string,
  kind: AppNotification['kind'],
  isRead = false,
  userId = AUTH_USER.id,
): AppNotification => ({
  id,
  userId,
  kind,
  title: 'Уведомление',
  createdAt: '2026-10-20T10:00:00.000Z',
  isRead,
})

const ITEMS = [
  makeNotification('incoming', 'incoming'),
  makeNotification('accepted', 'accepted'),
  makeNotification('sent', 'sent'),
  makeNotification('read', 'incoming', true),
  makeNotification('other-user', 'incoming', false, 'user-02'),
]

const renderToasts = (user: AuthUser | null = AUTH_USER) => {
  const store = setupStore({
    session: { user },
    notifications: { items: ITEMS, seededUserIds: [] },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  renderHook(() => useNotificationToasts(() => {}), { wrapper })
  return store
}

const shownIds = () => vi.mocked(toast.custom).mock.calls.map(([, options]) => options?.id)
const waitStagger = () => act(() => vi.advanceTimersByTime(TOAST_STAGGER))
const closeToast = (index: number) => {
  const options = vi.mocked(toast.custom).mock.calls[index][1]
  act(() => options?.onAutoClose?.({} as ToastT))
}

describe('[useNotificationToasts]', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.clear()
    localStorage.clear()
    vi.mocked(toast.custom).mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('всплывают только непрочитанные incoming и accepted вошедшего', () => {
    renderToasts()
    waitStagger()

    expect(shownIds()).toEqual(['incoming', 'accepted'])
  })

  test('вторая всплывашка появляется с паузой после первой', () => {
    renderToasts()

    expect(shownIds()).toEqual(['incoming'])

    waitStagger()
    expect(shownIds()).toEqual(['incoming', 'accepted'])
  })

  test('у гостя уведомления не всплывают', () => {
    renderToasts(null)
    waitStagger()

    expect(toast.custom).not.toHaveBeenCalled()
  })

  test('после перезагрузки страницы те же уведомления не всплывают снова', () => {
    renderToasts()
    waitStagger()
    renderToasts()
    waitStagger()

    expect(shownIds()).toEqual(['incoming', 'accepted'])
  })

  test('новое уведомление ждёт свободного места и занимает его сразу, один раз', () => {
    const store = renderToasts()
    waitStagger()

    act(() => {
      store.dispatch(
        addNotification({ userId: AUTH_USER.id, kind: 'accepted', title: 'Олег принял ваш обмен' }),
      )
    })
    waitStagger()
    expect(shownIds()).toEqual(['incoming', 'accepted'])

    closeToast(0)

    const { items } = store.getState().notifications
    expect(shownIds()).toEqual(['incoming', 'accepted', items[items.length - 1].id])
  })
})
