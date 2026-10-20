import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { EMAIL_TAKEN_ERROR, isEmailTaken } from '@/api/accounts'
import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { PasswordInput } from '@/shared/ui/password-input'
import { SocialAuth } from '@/shared/ui/social-auth'
import { accountSchema, PASSWORD_HINT, type AccountFormValues } from '../../model/account-schema'
import { loadDraft, saveDraft } from '../../model/draft'
import styles from './account-step.module.css'

export const AccountStep = () => {
  const navigate = useNavigate()
  const [draft] = useState(loadDraft)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: yupResolver(accountSchema),
    defaultValues: {
      email: draft.email ?? '',
      password: draft.password ?? '',
    },
  })

  const onSubmit: SubmitHandler<AccountFormValues> = async ({ email, password }) => {
    if (await isEmailTaken(email)) {
      setError('email', { message: EMAIL_TAKEN_ERROR }, { shouldFocus: true })
      return
    }

    saveDraft({ email, password })
    navigate(ROUTES.REGISTER_USER, { replace: true })
  }

  return (
    <div className={styles.step}>
      <SocialAuth />

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.fields}>
          <Input
            {...register('email')}
            label="Email"
            type="email"
            placeholder="Введите email"
            autoComplete="email"
            error={errors.email?.message}
          />

          <PasswordInput
            {...register('password')}
            label="Пароль"
            placeholder="Придумайте надёжный пароль"
            autoComplete="new-password"
            hint={PASSWORD_HINT}
            error={errors.password?.message}
          />
        </div>

        <div className={styles.actions}>
          <Button type="submit" fullWidth disabled={isSubmitting}>
            Далее
          </Button>

          <p className={styles.loginText}>
            Уже есть аккаунт?{' '}
            <Link to={ROUTES.LOGIN} replace className={styles.loginLink}>
              Войти
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
