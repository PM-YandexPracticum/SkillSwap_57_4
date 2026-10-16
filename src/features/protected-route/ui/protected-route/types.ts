import type { ReactNode } from 'react'

export interface ProtectedRouteProps {
  onlyUnAuth?: boolean
  children: ReactNode
}