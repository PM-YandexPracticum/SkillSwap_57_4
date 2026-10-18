import { clsx } from 'clsx'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { loginAccount, LOGIN_ERROR } from '@/api/accounts'
import { login } from '@/entities/session'
import { useAppDispatch } from '@/store/hooks'

import { Input } from '@/shared/ui/input'
import { PasswordInput } from '@/shared/ui/password-input'
import { Button } from '@/shared/ui/button'

import {
  loginSchema,
  type LoginFormValues,
} from '../../model/login-schema'

import type { LoginFormProps } from './types'
import styles from './login-form.module.css'

export const LoginForm = ({ className }: LoginFormProps) => {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    shouldFocusError: true,
  })

  const onSubmit: SubmitHandler<LoginFormValues> = async ({
    email,
    password,
  }) => {
    try {
      const user = await loginAccount(email, password)

      dispatch(
        login({
          id: user.id,
          name: user.name,
          email: user.email,
        }),
      )
    } catch {
      setError('root', {
        message: LOGIN_ERROR,
      })
    }
  }

  return (
    <form
      className={clsx(styles.form, className)}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.fields}>
        <Input
          {...register('email')}
          label="Email"
          type="email"
          placeholder="Введите email"
          autoComplete="email"
          error={errors.email?.message}
          invalid={Boolean(errors.root?.message)}
        />

        <PasswordInput
          {...register('password')}
          label="Пароль"
          placeholder="Введите ваш пароль"
          autoComplete="current-password"
          error={errors.password?.message}
          invalid={Boolean(errors.root?.message)}
        />
      </div>

      {errors.root?.message && (
        <p className={styles.submitError} role="alert">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" fullWidth disabled={isSubmitting}>
        Войти
      </Button>
    </form>
  )
}
