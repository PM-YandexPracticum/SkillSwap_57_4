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
  const [year, month, day] = birthDate.split('-').map(Number);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  let age = currentYear - year;
  const monthDiff = currentMonth - month;

  if (monthDiff < 0 || (monthDiff === 0 && currentDay < day)) {
    age -= 1;
  }

  return age;
}

export function formatAge(age: number): string {
  return `${age} ${pluralize(age, ['год', 'года', 'лет'])}`;
}   
