import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { RequestStatus, SwapRequest } from './types'

const REQUEST_STATUSES: RequestStatus[] = ['pending', 'accepted', 'rejected', 'inProgress', 'done']

const isSwapRequest = (value: unknown): value is SwapRequest => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const request = value as Record<string, unknown>

  return (
    typeof request.id === 'string' &&
    typeof request.skillId === 'string' &&
    typeof request.fromUserId === 'string' &&
    typeof request.toUserId === 'string' &&
    REQUEST_STATUSES.includes(request.status as RequestStatus) &&
    typeof request.createdAt === 'string' &&
    typeof request.updatedAt === 'string'
  )
}

export const loadRequests = (): SwapRequest[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS) ?? '[]')
    return Array.isArray(parsed) && parsed.every(isSwapRequest) ? parsed : []
  } catch {
    return []
  }
}

export const saveRequests = (requests: SwapRequest[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify(requests))
  } catch {
    // Хранилище переполнено или недоступно: заявки останутся до перезагрузки
  }
}
