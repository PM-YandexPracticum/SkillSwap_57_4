import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Loader } from '@/shared/ui/loader'
import { ProfileSidebar } from '@/widgets/profile-sidebar'

import styles from './profile-page.module.css'

export default function ProfilePage() {
  return (
    <>
      <h1 className="visually-hidden">Личный кабинет</h1>

      <div className={styles.layout}>
        <ProfileSidebar />

        <div className={styles.card}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </>
  )
}
