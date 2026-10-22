import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { EMAIL_TAKEN_ERROR, registerAccount } from '@/api/accounts'
import { loadSkillCategories, selectSkillCategories, SkillDetails } from '@/entities/skill'
import { addUser } from '@/entities/user'
import { login } from '@/entities/session'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useFilePreviews } from '@/shared/hooks/useFilePreviews'
import { findSubcategory } from '@/shared/lib/skills'
import { ROUTES } from '@/shared/lib/constants'
import { markSkillCreated } from '@/shared/lib/skill-created'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { Textarea } from '@/shared/ui/textarea'
import { ImageDropZone } from '@/shared/ui/image-drop-zone'
import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal'
import { EditIcon } from '@/shared/assets/icons'
import {
  DESCRIPTION_MAX_LENGTH,
  type SkillFormValues,
  skillSchema,
  TITLE_MAX_LENGTH,
} from '../../model/skill-schema'
import { getSubcategoryOptions } from '../../model/learn-skills'
import { clearDraft, loadDraft } from '../../model/draft'
import { buildRegisteredUser } from '../../model/build-registered-user'
import styles from './skill-step.module.css'

const NO_FILES: File[] = []

export const SkillStep = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const categories = useAppSelector(selectSkillCategories)

  const [preview, setPreview] = useState<SkillFormValues | null>(null)
  const previewImages = useFilePreviews(preview?.images ?? NO_FILES)

  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [doneError, setDoneError] = useState<string | null>(null)

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<SkillFormValues>({
    resolver: yupResolver(skillSchema),
    defaultValues: { title: '', subcategoryId: '', description: '', images: [] },
  })

  const categoryId = useWatch({ control, name: 'categoryId' })

  useEffect(() => {
    dispatch(loadSkillCategories())
  }, [dispatch])

  const handleCategoryChange = (id: string) => {
    const category = categories.find((item) => item.id === id)
    if (!category) return

    setValue('categoryId', category.id, { shouldValidate: isSubmitted })
    const subcategoryId = getValues('subcategoryId')
    if (!category.subcategories.some((item) => item.id === subcategoryId)) {
      setValue('subcategoryId', '', { shouldValidate: isSubmitted })
    }
  }

  const handleSubcategoryChange = (id: string) => {
    const found = findSubcategory(id, categories)
    if (!found) return

    setValue('subcategoryId', id, { shouldValidate: isSubmitted })
    setValue('categoryId', found.category.id, { shouldValidate: isSubmitted })
  }

  const handleBack = () => {
    navigate(ROUTES.REGISTER_USER, { replace: true })
  }

  const handlePreviewClose = () => {
    setPreview(null)
    setDoneError(null)
  }

  const handleDone = async (skill: SkillFormValues) => {
    const draft = loadDraft()
    setDoneError(null)
    setIsSaving(true)

    try {
      const user = buildRegisteredUser(draft, skill)
      await registerAccount(user, draft.password ?? '')
      dispatch(addUser(user))
      clearDraft()
      markSkillCreated()
      dispatch(login({ id: user.id, name: user.name, email: user.email }))
    } catch (error) {
      setDoneError(
        error instanceof Error && error.message === EMAIL_TAKEN_ERROR
          ? EMAIL_TAKEN_ERROR
          : 'Не удалось завершить регистрацию. Попробуйте ещё раз',
      )
      setIsSaving(false)
    }
  }

  const previewNames = preview ? findSubcategory(preview.subcategoryId, categories) : undefined

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(setPreview)} noValidate>
        <Input
          label="Название навыка"
          placeholder="Введите название вашего навыка"
          maxLength={TITLE_MAX_LENGTH}
          error={errors.title?.message}
          {...register('title')}
        />

        <Controller
          control={control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              label="Категория навыка"
              options={categories.map((category) => ({ value: category.id, label: category.name }))}
              value={field.value ?? ''}
              onChange={handleCategoryChange}
              placeholder="Выберите категорию навыка"
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="subcategoryId"
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              label="Подкатегория навыка"
              options={getSubcategoryOptions(categories, categoryId ? [categoryId] : [])}
              value={field.value}
              onChange={handleSubcategoryChange}
              placeholder="Выберите подкатегорию навыка"
              error={fieldState.error?.message}
            />
          )}
        />

        <Textarea
          label="Описание"
          placeholder="Коротко опишите, чему можете научить"
          rows={3}
          maxLength={DESCRIPTION_MAX_LENGTH}
          error={errors.description?.message}
          {...register('description')}
        />

        <Controller
          control={control}
          name="images"
          render={({ field, fieldState }) => (
            <ImageDropZone
              ref={field.ref}
              files={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <div className={styles.actions}>
          <Button variant="secondary" fullWidth onClick={handleBack}>
            Назад
          </Button>
          <Button type="submit" fullWidth>
            Продолжить
          </Button>
        </div>
      </form>

      <Modal
        className={styles.preview}
        isOpen={preview !== null}
        onClose={handlePreviewClose}
        title="Ваше предложение"
      >
        {preview && (
          <>
            <p className={styles.subtitle}>
              Пожалуйста, проверьте и подтвердите правильность данных
            </p>
            <SkillDetails
              className={styles.details}
              title={preview.title}
              categoryName={previewNames?.category.name ?? ''}
              subcategoryName={previewNames?.subcategory.name ?? ''}
              description={preview.description}
              images={previewImages.map(({ url }) => url)}
              variant="preview"
              titleAs="h3"
              actions={
                <>
                  <Button
                    variant="secondary"
                    fullWidth
                    rightIcon={<EditIcon />}
                    onClick={handlePreviewClose}
                  >
                    Редактировать
                  </Button>
                  <Button fullWidth disabled={isSaving} onClick={() => handleDone(preview)}>
                    Готово
                  </Button>
                </>
              }
            />
            {doneError && (
              <p className={styles.error} role="alert">
                {doneError}
              </p>
            )}
          </>
        )}
      </Modal>
    </>
  )
}
