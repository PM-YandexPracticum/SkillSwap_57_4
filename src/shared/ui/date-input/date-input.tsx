import { forwardRef, useId, useRef, useState, type ChangeEvent } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { clsx } from 'clsx'
import { format, isValid, parse, startOfDay } from 'date-fns'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import 'react-day-picker/style.css'
import { Button } from '@/shared/ui/button'
import { IconButton } from '@/shared/ui/icon-button'
import { CalendarIcon } from '@/shared/assets/icons'
import { useDismiss } from '@/shared/hooks/useDismiss'
import type { DateInputProps } from './types'
import styles from './date-input.module.css'

const VALUE_FORMAT = 'yyyy-MM-dd'
const DISPLAY_FORMAT = 'dd.MM.yyyy'
const MIN_DATE = new Date(1900, 0, 1)

const defaultClassNames = getDefaultClassNames()

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const formatters = {
  formatMonthDropdown: (month: Date) => capitalize(format(month, 'LLLL', { locale: ru })),
  formatWeekdayName: (weekday: Date) => capitalize(format(weekday, 'EEEEEE', { locale: ru })),
}

/** Оставляет только цифры и расставляет точки: `02021992` → `02.02.1992` */
const applyMask = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('.')
}

/** Дата из строки в формате `pattern`, если она существует и не выходит за допустимые границы */
const parseDate = (text: string, pattern: string) => {
  if (text.length !== pattern.length) return undefined
  const date = parse(text, pattern, new Date())
  if (!isValid(date) || date < MIN_DATE || date > startOfDay(new Date())) return undefined
  return date
}

const toValue = (text: string) => {
  const date = parseDate(text, DISPLAY_FORMAT)
  return date ? format(date, VALUE_FORMAT) : ''
}

const toText = (value: string) => {
  const date = parseDate(value, VALUE_FORMAT)
  return date ? format(date, DISPLAY_FORMAT) : ''
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  { label, value, onChange, placeholder = 'дд.мм.гггг', error, className, id, disabled, ...props },
  ref,
) {
  const [text, setText] = useState(() => toText(value))
  const [prevValue, setPrevValue] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState<Date | undefined>()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uniqueId = useId()
  const inputId = id || `date-input-${uniqueId}`
  const dialogId = `dialog-${uniqueId}`
  const errorId = `error-${uniqueId}`

  // value поменяли снаружи (например, сброс формы): обновляем текст,
  // но не трогаем недонабранную дату, для которой value и так равно ''
  if (value !== prevValue) {
    setPrevValue(value)
    if (value !== toValue(text)) setText(toText(value))
  }

  const today = startOfDay(new Date())

  const closeCalendar = () => {
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleDismiss = () => setIsOpen(false)

  useDismiss({
    ref: containerRef,
    onDismiss: handleDismiss,
    isActive: isOpen,
    returnFocusRef: inputRef,
  })

  const handleToggle = () => {
    if (isOpen) {
      closeCalendar()
      return
    }
    setDraft(parseDate(value, VALUE_FORMAT))
    setIsOpen(true)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextText = applyMask(e.target.value)
    setText(nextText)
    onChange(toValue(nextText))
  }

  const handleApply = () => {
    if (!draft) return
    setText(format(draft, DISPLAY_FORMAT))
    onChange(format(draft, VALUE_FORMAT))
    closeCalendar()
  }

  return (
    <div ref={containerRef} className={clsx(styles.container, className)}>
      <label htmlFor={inputId}>{label}</label>

      <div className={styles.anchor}>
        <div className={clsx(styles.control, error && styles.controlError)}>
          <input
            {...props}
            ref={mergeRefs([inputRef, ref])}
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            className={styles.input}
            value={text}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
          />
          <IconButton
            icon={<CalendarIcon />}
            aria-label="Открыть календарь"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={isOpen ? dialogId : undefined}
            disabled={disabled}
            onClick={handleToggle}
          />
        </div>

        {isOpen && (
          <div id={dialogId} role="dialog" aria-label="Выбор даты" className={styles.popup}>
            <DayPicker
              mode="single"
              locale={ru}
              weekStartsOn={1}
              captionLayout="dropdown"
              hideNavigation
              showOutsideDays
              fixedWeeks
              autoFocus
              selected={draft}
              onSelect={setDraft}
              defaultMonth={draft ?? today}
              startMonth={MIN_DATE}
              endMonth={today}
              disabled={{ after: today }}
              formatters={formatters}
              classNames={{
                root: clsx(defaultClassNames.root, styles.calendar),
                month_caption: clsx(defaultClassNames.month_caption, styles.caption),
                caption_label: clsx(defaultClassNames.caption_label, styles.captionLabel),
                chevron: clsx(defaultClassNames.chevron, styles.chevron),
                weekday: clsx(defaultClassNames.weekday, styles.weekday),
                day: clsx(defaultClassNames.day, styles.day),
                day_button: clsx(defaultClassNames.day_button, styles.dayButton),
                selected: clsx(defaultClassNames.selected, styles.selected),
                today: clsx(defaultClassNames.today, styles.today),
                outside: clsx(defaultClassNames.outside, styles.outside),
                disabled: clsx(defaultClassNames.disabled, styles.disabled),
              }}
            />

            <div className={styles.actions}>
              <Button variant="secondary" className={styles.action} onClick={closeCalendar}>
                Отменить
              </Button>
              <Button className={styles.action} disabled={!draft} onClick={handleApply}>
                Выбрать
              </Button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <span id={errorId} className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  )
})
