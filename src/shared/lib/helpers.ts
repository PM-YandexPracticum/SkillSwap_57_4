/** Форматирует дату в читаемый вид */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/** Обрезает строку до maxLength символов */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/** Генерирует уникальный id */
export function generateId(): string {
  return crypto.randomUUID()
}

export function pluralize(count: number, forms: [string, string, string]): string {
  const abs = Math.abs(count) % 100
  const rem = abs % 10

  if (abs > 10 && abs < 20) {
    return forms[2]
  }

  if (rem > 1 && rem < 5) {
    return forms[1]
  }

  if (rem === 1) {
    return forms[0]
  }

  return forms[2]
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
export function getAge(birthDate: string, now: Date = new Date()): number | null {
  if (!DATE_REGEX.test(birthDate)) {
    return null
  }

  const [year, month, day] = birthDate.split('-').map(Number)
  const birth = new Date(year, month - 1, day)

  if (birth.getFullYear() !== year || birth.getMonth() !== month - 1 || birth.getDate() !== day) {
    return null
  }

  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const currentDay = now.getDate()

  let age = currentYear - year
  const monthDiff = currentMonth - month

  if (monthDiff < 0 || (monthDiff === 0 && currentDay < day)) {
    age -= 1
  }

  return age < 0 ? null : age
}

export function formatAge(age: number): string {
  return `${age} ${pluralize(age, ['год', 'года', 'лет'])}`
}
