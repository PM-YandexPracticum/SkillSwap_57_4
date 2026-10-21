import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectUser } from '@/entities/session'
import { ROUTES } from '@/shared/lib/constants'
import { toggleFavorite } from './favorites-slice'

export function useToggleFavorite() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector(selectUser)

  return useCallback(
    (targetId: string) => {
      if (!user) {
        navigate(ROUTES.LOGIN, { state: { from: location } })
        return
      }

      dispatch(toggleFavorite({ userId: user.id, targetId }))
    },
    [user, navigate, location, dispatch],
  )
}
