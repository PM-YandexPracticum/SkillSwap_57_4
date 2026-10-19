import { Suspense, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { loadUsers, selectUserById } from '@/entities/user'
import { logout, selectUser } from '@/entities/session'
import { seedNotifications } from '@/entities/notification'
import { ROUTES } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Loader } from '@/shared/ui/loader'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import styles from './main-layout.module.css'

export const MainLayout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const authUser = useAppSelector(selectUser)
  const user = useAppSelector((state) =>
    authUser ? selectUserById(state, authUser.id) : undefined,
  )

  useEffect(() => {
    dispatch(loadUsers())
  }, [dispatch])

  useEffect(() => {
    if (authUser) {
      dispatch(seedNotifications({ userId: authUser.id, now: new Date().toISOString() }))
    }
  }, [dispatch, authUser])

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.HOME)
  }

  return (
    <div className={styles.layout}>
      <Header
        user={authUser ? { name: authUser.name, avatarUrl: user?.avatarUrl ?? null } : null}
        onLogout={handleLogout}
      />
      <main className={styles.main}>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
