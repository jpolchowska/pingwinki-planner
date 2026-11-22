const DAY_IN_MS = 86_400_000;

function toUtcTime(isoDate: string) {
  return Date.parse(`${isoDate}T00:00:00Z`);
}

export function getTodayIso(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function daysUntil(dueDate: string, today: string) {
  return Math.round((toUtcTime(dueDate) - toUtcTime(today)) / DAY_IN_MS);
}

export function formatShortDate(isoDate: string) {
  return `${isoDate.slice(8, 10)}.${isoDate.slice(5, 7)}`;
}

export function formatFullDate(isoDate: string) {
  const weekday = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', timeZone: 'UTC' }).format(
    toUtcTime(isoDate),
  );
  return `${weekday}, ${formatShortDate(isoDate)}.${isoDate.slice(0, 4)}`;
}

export function getDueLabel(dueDate: string | null, today: string) {
  if (dueDate === null) return 'bez terminu';

  const days = daysUntil(dueDate, today);
  if (days < 0) return 'po terminie';
  if (days === 0) return 'dziś';
  if (days === 1) return 'jutro';
  return `za ${days} dni`;
}
