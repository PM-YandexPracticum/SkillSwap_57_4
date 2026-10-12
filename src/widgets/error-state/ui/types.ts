export type ErrorCode = 404 | 500

export interface ErrorStateProps {
  code: ErrorCode
  onReport?: () => void
}
