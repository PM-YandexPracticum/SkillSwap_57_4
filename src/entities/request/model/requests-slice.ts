import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { generateId } from '@/shared/lib/helpers'
import { loadRequests } from './requests-storage'
import type { SwapRequest } from './types'

export type RequestsState = {
  items: SwapRequest[]
}

type NewRequest = Pick<SwapRequest, 'skillId' | 'fromUserId' | 'toUserId'>

const requestsSlice = createSlice({
  name: 'requests',
  initialState: (): RequestsState => ({ items: loadRequests() }),
  reducers: {
    addRequest: {
      reducer: (state, action: PayloadAction<SwapRequest>) => {
        state.items.push(action.payload)
      },
      prepare: (request: NewRequest) => {
        const now = new Date().toISOString()

        return {
          payload: {
            ...request,
            id: generateId(),
            status: 'pending' as const,
            createdAt: now,
            updatedAt: now,
          },
        }
      },
    },
  },
})

export const { addRequest } = requestsSlice.actions
export const requestsReducer = requestsSlice.reducer
