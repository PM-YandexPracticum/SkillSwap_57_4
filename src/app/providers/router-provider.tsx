import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from '@/shared/lib/constants'

// Lazy-загрузка страниц — каждая страница грузится только при переходе на неё
const CatalogPage = lazy(() => import('@/pages/catalog-page'))
const SkillPage = lazy(() => import('@/pages/skill-page'))
const ProfilePage = lazy(() => import('@/pages/profile-page'))
const FavoritesPage = lazy(() => import('@/pages/favorites-page'))
const CreateSkillPage = lazy(() => import('@/pages/create-skill-page'))
const LoginPage = lazy(() => import('@/pages/login-page'))
const NotFoundPage = lazy(() => import('@/pages/not-found-page'))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
          <Route path={ROUTES.HOME} element={<CatalogPage />} />
          <Route path={ROUTES.SKILL} element={<SkillPage />} />
          <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<LoginPage />} />

          {/* Защищённые маршруты — добавь PrivateRoute обёртку */}
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.CREATE} element={<CreateSkillPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
