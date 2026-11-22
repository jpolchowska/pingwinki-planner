import { addDays } from './dates';

const WEEKDAYS = ['pn', 'wt', 'śr', 'cz', 'pt', 'sb', 'nd'];

function hasDive(divesByDate: Record<string, number>, date: string) {
  return (divesByDate[date] ?? 0) > 0;
}

export function getBuildWeek(divesByDate: Record<string, number>, today: string) {
  const daysSinceMonday = (new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7;
  const monday = addDays(today, -daysSinceMonday);

  return WEEKDAYS.map((label, index) => {
    const date = addDays(monday, index);
    return { date, label, isBuilt: hasDive(divesByDate, date) };
  });
}

export function getDiveStreak(divesByDate: Record<string, number>, today: string) {
  let date = hasDive(divesByDate, today) ? today : addDays(today, -1);
  let streak = 0;

  while (hasDive(divesByDate, date)) {
    streak += 1;
    date = addDays(date, -1);
  }
  return streak;
}
