import * as yup from 'yup'
import type { SkillCategoryId } from '@/shared/types'

export const TITLE_MIN_LENGTH = 3
export const TITLE_MAX_LENGTH = 50
export const DESCRIPTION_MAX_LENGTH = 500

const TITLE_LENGTH_ERROR = `Название - от ${TITLE_MIN_LENGTH} до ${TITLE_MAX_LENGTH} символов`

export const skillSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Введите название навыка')
    .min(TITLE_MIN_LENGTH, TITLE_LENGTH_ERROR)
    .max(TITLE_MAX_LENGTH, TITLE_LENGTH_ERROR),
  categoryId: yup.string<SkillCategoryId>().required('Выберите категорию'),
  subcategoryId: yup.string().required('Выберите подкатегорию'),
  description: yup
    .string()
    .trim()
    .required('Опишите, чему можете научить')
    .max(DESCRIPTION_MAX_LENGTH, `Описание - не больше ${DESCRIPTION_MAX_LENGTH} символов`),
  images: yup
    .array(yup.mixed<File>().required())
    .required()
    .min(1, 'Добавьте хотя бы одно изображение'),
})

export type SkillFormValues = yup.InferType<typeof skillSchema>
