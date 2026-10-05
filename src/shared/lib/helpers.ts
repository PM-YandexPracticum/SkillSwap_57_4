
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}


export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '...';
}


export function generateId(): string {
  return crypto.randomUUID();
}


export function pluralize(count: number, forms: [string, string, string]): string {
  const abs = Math.abs(count) % 100;
  const rem = abs % 10;

  if (abs > 10 && abs < 20) {
    return forms[2];
  }

  if (rem > 1 && rem < 5) {
    return forms[1];
  }

  if (rem === 1) {
    return forms[0];
  }

  return forms[2];
}


export function getAge(birthDate: string, now: Date = new Date()): number {
  if (!birthDate || typeof birthDate !== 'string') {
    return 0;
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(birthDate)) {
    return 0;
  }

  const [year, month, day] = birthDate.split('-').map(Number);
  const birth = new Date(year, month - 1, day);

  if (
    birth.getFullYear() !== year ||
    birth.getMonth() !== month - 1 ||
    birth.getDate() !== day ||
    isNaN(birth.getTime())
  ) {
    return 0;
  }

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  let age = currentYear - year;
  const monthDiff = currentMonth - month;

  if (monthDiff < 0 || (monthDiff === 0 && currentDay < day)) {
    age -= 1;
  }

  return age < 0 ? 0 : age;
}


export function formatAge(age: number): string {
  return `${age} ${pluralize(age, ['год', 'года', 'лет'])}`;
}