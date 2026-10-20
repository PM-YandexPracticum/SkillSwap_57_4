import * as yup from 'yup'
import { emailRule, passwordRule, PASSWORD_MIN_LENGTH } from '@/entities/user'

export const PASSWORD_HINT = `Не менее ${PASSWORD_MIN_LENGTH} знаков: заглавная и строчная буквы, цифра и спецсимвол`

export const accountSchema = yup.object({
  email: emailRule,
  password: passwordRule,
})

export type AccountFormValues = yup.InferType<typeof accountSchema>
