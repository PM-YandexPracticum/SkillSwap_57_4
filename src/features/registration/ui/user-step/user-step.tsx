import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loadCities, selectCities } from '@/entities/city'
import { loadSkillCategories, selectSkillCategories } from '@/entities/skill'
import { GENDER_OPTIONS } from '@/entities/user'
import { ROUTES } from '@/shared/lib/constants'
import { readFileAsDataUrl } from '@/shared/lib/files'
import { AvatarInput } from '@/shared/ui/avatar-input'
import { Button } from '@/shared/ui/button'
import { DateInput } from '@/shared/ui/date-input'
import { Input } from '@/shared/ui/input'
import { MultiSelect } from '@/shared/ui/multi-select'
import { Select } from '@/shared/ui/select'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  addCategoriesOfSkills,
  getSubcategoryOptions,
  keepSkillsOfCategories,
} from '../../model/learn-skills'
import { loadDraft, saveDraft } from '../../model/draft'
import { userSchema, type UserFormValues } from '../../model/user-schema'
import styles from './user-step.module.css'

export const UserStep = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const cities = useAppSelector(selectCities)
  const categories = useAppSelector(selectSkillCategories)
  const [draft] = useState(loadDraft)

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitted, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: draft.name ?? '',
      birthDate: draft.birthDate ?? '',
      gender: draft.gender,
      cityId: draft.cityId ?? '',
      avatarUrl: draft.avatarUrl ?? null,
      learnCategories: draft.learnCategories ?? [],
      learnSkills: draft.learnSkills ?? [],
    },
  })

  const learnCategories = useWatch({ control, name: 'learnCategories' }) ?? []

  useEffect(() => {
    dispatch(loadCities())
    dispatch(loadSkillCategories())
  }, [dispatch])

  const cityOptions = cities.map((city) => ({ value: city.id, label: city.name }))
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }))
  const subcategoryOptions = getSubcategoryOptions(categories, learnCategories)

  const validateChangedLists = { shouldValidate: isSubmitted }

  const handleCategoriesChange = (categoryIds: string[]) => {
    const skillIds = keepSkillsOfCategories(categories, categoryIds, getValues('learnSkills'))
    setValue('learnCategories', categoryIds, validateChangedLists)
    setValue('learnSkills', skillIds, validateChangedLists)
  }

  const handleSkillsChange = (skillIds: string[]) => {
    const categoryIds = addCategoriesOfSkills(categories, getValues('learnCategories'), skillIds)
    setValue('learnCategories', categoryIds, validateChangedLists)
    setValue('learnSkills', skillIds, validateChangedLists)
  }

  const handleAvatarChange = async (file: File) => {
    setValue('avatarUrl', await readFileAsDataUrl(file), { shouldValidate: isSubmitted })
  }

  const handleBack = () => {
    saveDraft(getValues())
    navigate(ROUTES.REGISTER_ACCOUNT, { replace: true })
  }

  const onSubmit: SubmitHandler<UserFormValues> = (values) => {
    saveDraft(values)
    navigate(ROUTES.REGISTER_SKILL, { replace: true })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Controller
        name="avatarUrl"
        control={control}
        render={({ field, fieldState }) => (
          <AvatarInput
            ref={field.ref}
            src={field.value}
            onChange={handleAvatarChange}
            error={fieldState.error?.message}
            className={styles.avatar}
          />
        )}
      />

      <Input
        {...register('name')}
        label="Имя"
        placeholder="Введите ваше имя"
        autoComplete="name"
        error={errors.name?.message}
      />

      <div className={styles.row}>
        <Controller
          name="birthDate"
          control={control}
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
          name="gender"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              label="Пол"
              options={GENDER_OPTIONS}
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="Не указан"
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <Controller
        name="cityId"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            ref={field.ref}
            label="Город"
            options={cityOptions}
            value={field.value}
            onChange={field.onChange}
            placeholder="Не указан"
            error={fieldState.error?.message}
            searchable
          />
        )}
      />

      <Controller
        name="learnCategories"
        control={control}
        render={({ field, fieldState }) => (
          <MultiSelect
            ref={field.ref}
            label="Категория навыка, которому хотите научиться"
            options={categoryOptions}
            value={field.value}
            onChange={handleCategoriesChange}
            placeholder="Выберите категорию"
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="learnSkills"
        control={control}
        render={({ field, fieldState }) => (
          <MultiSelect
            ref={field.ref}
            label="Подкатегория навыка, которому хотите научиться"
            options={subcategoryOptions}
            value={field.value}
            onChange={handleSkillsChange}
            placeholder="Выберите подкатегорию"
            error={fieldState.error?.message}
          />
        )}
      />

      <div className={styles.actions}>
        <Button type="button" variant="secondary" fullWidth onClick={handleBack}>
          Назад
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          Продолжить
        </Button>
      </div>
    </form>
  )
}
