export interface RadioGroupOption<T extends string> {
  value: T
  label: string
}

export interface RadioGroupProps<T extends string> {
  name: string
  value: T
  onChange: (value: T) => void
  options: readonly RadioGroupOption<T>[]
  className?: string
}
