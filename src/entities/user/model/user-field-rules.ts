import * as yup from 'yup'

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
