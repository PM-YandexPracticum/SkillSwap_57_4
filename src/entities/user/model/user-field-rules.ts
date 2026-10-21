import { format } from 'date-fns'
import * as yup from 'yup'
import type { Gender } from '@/shared/types'

export const PASSWORD_MIN_LENGTH = 8

export const emailRule = yup
  .string()
  .trim()
  .required('Введите email')
  .email('Введите корректный email')

export const passwordRule = yup
  .string()
  .required('Придумайте пароль')
  .min(PASSWORD_MIN_LENGTH, `Пароль - не менее ${PASSWORD_MIN_LENGTH} знаков`)
  .matches(/\d/, 'Добавьте в пароль цифру')
  .matches(/\p{Ll}/u, 'Добавьте в пароль строчную букву')
  .matches(/\p{Lu}/u, 'Добавьте в пароль заглавную букву')
  .matches(/[^\p{L}\d\s]/u, 'Добавьте в пароль спецсимвол')

export const nameRule = yup.string().trim().required('Введите имя')

export const birthDateRule = yup
  .string()
  .required('Укажите дату рождения')
  .test(
    'not-in-future',
    'Дата рождения не может быть в будущем',
    (value) => !value || value <= format(new Date(), 'yyyy-MM-dd'),
  )

export const genderRule = yup
  .mixed<Gender>()
  .oneOf(['male', 'female'], 'Укажите пол')
  .required('Укажите пол')

export const cityIdRule = yup.string().required('Выберите город')
