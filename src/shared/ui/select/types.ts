export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  label: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  searchable?: boolean
  className?: string
}

export interface SelectHandle {
  focus: () => void
}
