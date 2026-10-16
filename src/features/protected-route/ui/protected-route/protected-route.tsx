import { Navigate, useLocation } from 'react-router-dom'

import { selectUser } from '@/entities/session'
import { useAppSelector } from '@/store/hooks'
import { ROUTES } from '@/shared/lib/constants'

import type { ProtectedRouteProps } from './types'

export const ProtectedRoute = ({ onlyUnAuth = false, children }: ProtectedRouteProps) => {
  const user = useAppSelector(selectUser)
  const location = useLocation()

  if (!onlyUnAuth && !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname ?? ROUTES.HOME
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}