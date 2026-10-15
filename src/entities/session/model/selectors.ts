import type { RootState } from '@/store'

export const selectUser = (state: RootState) => state.session.user
