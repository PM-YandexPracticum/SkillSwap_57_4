import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from '@/shared/lib/constants'
import { Loader } from '@/shared/ui/loader'
import { ProtectedRoute } from '@/features/auth'
import { MainLayout } from '../layouts/main-layout'
import { AuthLayout } from '../layouts/auth-layout'

// Lazy-загрузка страниц — каждая страница грузится только при переходе на неё
const CatalogPage = lazy(() => import('@/pages/catalog-page'))
const SkillPage = lazy(() => import('@/pages/skill-page'))
const ProfilePage = lazy(() => import('@/pages/profile-page'))
const FavoritesPage = lazy(() => import('@/pages/favorites-page'))
const CreateSkillPage = lazy(() => import('@/pages/create-skill-page'))
const LoginPage = lazy(() => import('@/pages/login-page'))
const RegisterPage = lazy(() => import('@/pages/register-page'))
const NotFoundPage = lazy(() => import('@/pages/not-found-page'))
const ServerErrorPage = lazy(() => import('@/pages/server-error-page'))

const AccountStep = lazy(() =>
  import('@/features/registration').then((module) => ({ default: module.AccountStep })),
)
const UserStep = lazy(() =>
  import('@/features/registration').then((module) => ({ default: module.UserStep })),
)
const SkillStep = lazy(() =>
  import('@/features/registration').then((module) => ({ default: module.SkillStep })),
)

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader fullPage />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<CatalogPage />} />
            <Route path={ROUTES.SKILL} element={<SkillPage />} />

            <Route
              path={ROUTES.FAVORITES}
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.CREATE}
              element={
                <ProtectedRoute>
                  <CreateSkillPage />
                </ProtectedRoute>
              }
            />

            <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route
              path={ROUTES.LOGIN}
              element={
                <ProtectedRoute onlyUnAuth>
                  <LoginPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.REGISTER}
              element={
                <ProtectedRoute onlyUnAuth>
                  <RegisterPage />
                </ProtectedRoute>
              }
            >
              <Route path={ROUTES.REGISTER_ACCOUNT} element={<AccountStep />} />
              <Route path={ROUTES.REGISTER_USER} element={<UserStep />} />
              <Route path={ROUTES.REGISTER_SKILL} element={<SkillStep />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
