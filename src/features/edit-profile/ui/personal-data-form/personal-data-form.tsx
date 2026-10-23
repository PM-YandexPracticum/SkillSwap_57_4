import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { EMAIL_TAKEN_ERROR, isEmailTaken, updateAccountUser } from '@/api/accounts'
import { loadCities, selectCities } from '@/entities/city'
import { login, selectUser } from '@/entities/session'
import { GENDER_OPTIONS, loadUsers, selectUserById, updateUser } from '@/entities/user'
import { EditIcon } from '@/shared/assets/icons'
import { readFileAsDataUrl } from '@/shared/lib/files'
import type { User } from '@/shared/types'
import { Input } from '@/shared/ui/input'
import { DateInput } from '@/shared/ui/date-input'
import { Select } from '@/shared/ui/select'
import { Textarea } from '@/shared/ui/textarea'
import { AvatarInput } from '@/shared/ui/avatar-input'
import { Button } from '@/shared/ui/button'
import { Loader } from '@/shared/ui/loader'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { ABOUT_MAX_LENGTH, profileSchema, type ProfileFormValues } from '../../model/profile-schema'
import type { PersonalDataFormProps } from './types'
import styles from './personal-data-form.module.css'

const toFormValues = (user: User): ProfileFormValues => ({
  avatarUrl: user.avatarUrl,
  email: user.email,
  name: user.name,
  birthDate: user.birthDate,
  gender: user.gender,
  cityId: user.cityId,
  about: user.about,
})

type FieldsProps = {
  user: User
  className?: string
}

const PersonalDataFields = ({ user, className }: FieldsProps) => {
  const dispatch = useAppDispatch()
  const cities = useAppSelector(selectCities)
  const cityOptions = cities.map((city) => ({ value: city.id, label: city.name }))

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: toFormValues(user),
  })

  const handleAvatarChange = async (file: File) => {
    setValue('avatarUrl', await readFileAsDataUrl(file), { shouldDirty: true })
  }

  const onSubmit = async (values: ProfileFormValues) => {
    if (
      values.email.toLowerCase() !== user.email.toLowerCase() &&
      (await isEmailTaken(values.email))
    ) {
      setError('email', { message: EMAIL_TAKEN_ERROR }, { shouldFocus: true })
      return
    }

    try {
      const updated = await updateAccountUser({ ...user, ...values })
      dispatch(updateUser(updated))
      dispatch(login({ id: updated.id, name: updated.name, email: updated.email }))
      reset(toFormValues(updated))
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Не удалось сохранить данные',
      })
    }
  }

  const editIcon = <EditIcon aria-hidden="true" />

  return (
    <form className={clsx(styles.form, className)} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.fields}>
        <div className={styles.email}>
          <Input
            label="Почта"
            type="email"
            autoComplete="email"
            endAdornment={editIcon}
            error={errors.email?.message}
            {...register('email')}
          />
          <button className={styles.password} type="button" aria-disabled="true">
            Изменить пароль
          </button>
        </div>

        <Input
          label="Имя"
          autoComplete="name"
          endAdornment={editIcon}
          error={errors.name?.message}
          {...register('name')}
        />

        <div className={styles.row}>
          <Controller
            control={control}
            name="birthDate"
            render={({ field, fieldState }) => (
              <DateInput
                ref={field.ref}
                name={field.name}
                onBlur={field.onBlur}
                label="Дата рождения"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field, fieldState }) => (
              <Select
                ref={field.ref}
                label="Пол"
                options={GENDER_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="cityId"
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              label="Город"
              options={cityOptions}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              searchable
            />
          )}
        />

        <Textarea
          label="О себе"
          rows={4}
          maxLength={ABOUT_MAX_LENGTH}
          endAdornment={editIcon}
          error={errors.about?.message}
          {...register('about')}
        />

        {errors.root && (
          <p className={styles.error} role="alert">
            {errors.root.message}
          </p>
        )}

        <Button
          className={styles.submit}
          type="submit"
          fullWidth
          disabled={!isDirty || isSubmitting}
        >
          Сохранить
        </Button>
      </div>

      <Controller
        control={control}
        name="avatarUrl"
        render={({ field }) => (
          <AvatarInput
            ref={field.ref}
            className={styles.avatar}
            src={field.value}
            size="l"
            onChange={handleAvatarChange}
          />
        )}
      />
    </form>
  )
}

export const PersonalDataForm = ({ className }: PersonalDataFormProps) => {
  const dispatch = useAppDispatch()
  const authUser = useAppSelector(selectUser)
  const user = useAppSelector((state) =>
    authUser ? selectUserById(state, authUser.id) : undefined,
  )

  useEffect(() => {
    dispatch(loadUsers())
    dispatch(loadCities())
  }, [dispatch])

  if (!user) return <Loader size="l" className={className} />

  return <PersonalDataFields key={user.id} user={user} className={className} />
}
