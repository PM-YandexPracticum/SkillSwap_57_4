import type { ComponentPropsWithoutRef } from 'react'

export interface DateInputProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'type'
> {
  label: string
  /** Дата в формате `'YYYY-MM-DD'` или `''` */
  value: string
  /** Получает `'YYYY-MM-DD'`, а пока дата не набрана полностью или не существует — `''` */
  onChange: (value: string) => void
  error?: string
}
