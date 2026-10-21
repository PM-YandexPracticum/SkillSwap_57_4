import type { ReactElement } from 'react'

export interface ProtectedRouteProps {
  onlyUnAuth?: boolean
  children: ReactElement
}
