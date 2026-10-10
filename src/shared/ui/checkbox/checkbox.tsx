import { forwardRef, useEffect, useRef } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { clsx } from 'clsx'
import { CheckboxDoneIcon, CheckboxEmptyIcon, CheckboxRemoveIcon } from '@/shared/assets/icons'
import type { CheckboxProps } from './types'
import styles from './checkbox.module.css'

const ICONS = {
  unchecked: CheckboxEmptyIcon,
  checked: CheckboxDoneIcon,
  indeterminate: CheckboxRemoveIcon,
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { state = 'unchecked', className, ...inputProps },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = state === 'indeterminate'
    }
  }, [state])

  const Icon = ICONS[state]

  return (
    <span className={clsx(styles.checkbox, className)}>
      <input
        {...inputProps}
        ref={mergeRefs([inputRef, ref])}
        type="checkbox"
        checked={state === 'checked'}
        className={styles.input}
      />

      <Icon
        className={clsx(styles.icon, state !== 'unchecked' && styles.active)}
        aria-hidden="true"
      />
    </span>
  )
})
