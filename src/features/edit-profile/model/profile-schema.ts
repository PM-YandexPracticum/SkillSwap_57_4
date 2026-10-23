import * as yup from 'yup'
import { birthDateRule, cityIdRule, emailRule, genderRule, nameRule } from '@/entities/user'

export const ABOUT_MAX_LENGTH = 500

export const profileSchema = yup.object({
  avatarUrl: yup.string().nullable().default(null),
  email: emailRule,
  name: nameRule,
  birthDate: birthDateRule,
  gender: genderRule,
  cityId: cityIdRule,
  about: yup
    .string()
    .trim()
    .max(ABOUT_MAX_LENGTH, `Не больше ${ABOUT_MAX_LENGTH} символов`)
    .default(''),
})

export type ProfileFormValues = yup.InferType<typeof profileSchema>
