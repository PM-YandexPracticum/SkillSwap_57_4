// ─── Model ───────────────────────────────────────────────
export type * from './model/types'
export { loadUsers, usersReducer } from './model/users-slice'
export {
  selectUsers,
  selectUsersStatus,
  selectUsersError,
  selectUserById,
  selectUserBySkillId,
  selectPopularUsers,
  selectNewestUsers,
} from './model/selectors'

// ─── UI ──────────────────────────────────────────────────
export { UserInfo } from './ui/user-info/user-info'
export type { UserInfoProps } from './ui/user-info/types'
