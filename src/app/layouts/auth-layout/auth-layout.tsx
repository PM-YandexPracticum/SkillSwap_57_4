import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Loader } from '@/shared/ui/loader'
import { AuthHeader } from '@/widgets/header'
import styles from './auth-layout.module.css'

export const AuthLayout = () => {
  return (
    <>
      <AuthHeader />
      <main className={styles.main}>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  )
}
