import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().trim().required('Введите email').email('Введите корректный email'),
  password: yup.string().required('Введите пароль'),
})

export type LoginFormValues = yup.InferType<typeof loginSchema>
