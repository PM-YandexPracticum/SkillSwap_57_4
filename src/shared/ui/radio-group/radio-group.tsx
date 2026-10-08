import { clsx } from 'clsx'

import { Radio } from '@/shared/ui/radio'

import styles from './radio-group.module.css'
import type { RadioGroupProps } from './types'

export const RadioGroup = <T extends string>({
  name,
  value,
  onChange,
  options,
  className,
  ...groupProps
}: RadioGroupProps<T>) => (
  <div {...groupProps} role="radiogroup" className={clsx(styles.group, className)}>
    {options.map((option) => (
      <label key={option.value} className={styles.option}>
        <Radio
          name={name}
          value={option.value}
          state={option.value === value ? 'checked' : 'unchecked'}
          onChange={() => onChange(option.value)}
        />
        <span>{option.label}</span>
      </label>
    ))}
  </div>
)
