import { Outlet } from 'react-router-dom'
import { ProfileSidebar } from '@/widgets/profile-sidebar'

import styles from './profile-page.module.css'

export default function ProfilePage() {
  return (
    <>
      <h1 className="visually-hidden">Личный кабинет</h1>

      <div className={styles.layout}>
        <ProfileSidebar />

        <div className={styles.card}>
          <Outlet />
        </div>
      </div>
    </>
  )
}
