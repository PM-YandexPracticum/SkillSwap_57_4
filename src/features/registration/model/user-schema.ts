import * as yup from 'yup'
import { birthDateRule, cityIdRule, genderRule, nameRule } from '@/entities/user'

export const userSchema = yup.object({
  name: nameRule,
  birthDate: birthDateRule,
  gender: genderRule,
  cityId: cityIdRule,
  avatarUrl: yup.string().nullable().default(null),
  learnCategories: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Выберите хотя бы одну категорию')
    .required('Выберите хотя бы одну категорию'),
  learnSkills: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Выберите хотя бы одну подкатегорию')
    .required('Выберите хотя бы одну подкатегорию'),
})

export type UserFormValues = yup.InferType<typeof userSchema>
