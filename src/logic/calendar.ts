import type { Priority, Task } from '../data/task';

const DAYS_IN_WEEK = 7;

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export interface CalendarMonth {
  year: number;
  month: number;
}

export function getCalendarMonth(isoDate: string): CalendarMonth {
  return { year: Number(isoDate.slice(0, 4)), month: Number(isoDate.slice(5, 7)) - 1 };
}

export function shiftCalendarMonth({ year, month }: CalendarMonth, delta: number): CalendarMonth {
  const date = new Date(Date.UTC(year, month + delta, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
}

export function formatCalendarMonth({ year, month }: CalendarMonth) {
  return new Intl.DateTimeFormat('pl-PL', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(Date.UTC(year, month, 1));
}

export function getMonthCells({ year, month }: CalendarMonth): (string | null)[] {
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % DAYS_IN_WEEK;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

  const days = Array.from(
    { length: daysInMonth },
    (_, index) => `${monthPrefix}-${String(index + 1).padStart(2, '0')}`,
  );
  const cells = [...new Array<null>(firstWeekday).fill(null), ...days];
  const trailingCells = (DAYS_IN_WEEK - (cells.length % DAYS_IN_WEEK)) % DAYS_IN_WEEK;
  return [...cells, ...new Array<null>(trailingCells).fill(null)];
}

export function getDayTasks(tasks: Task[], isoDate: string) {
  return tasks
    .filter((task) => task.dueDate === isoDate)
    .sort(
      (first, second) =>
        Number(first.done) - Number(second.done) ||
        PRIORITY_ORDER[first.priority] - PRIORITY_ORDER[second.priority],
    );
}

export function getDayMarkers(tasks: Task[], isoDate: string, limit: number) {
  const priorities = getDayTasks(tasks, isoDate)
    .filter((task) => !task.done)
    .map((task) => task.priority);

  if (priorities.length <= limit) {
    return { markers: priorities, hiddenCount: 0, totalCount: priorities.length };
  }

  const visibleCount = limit - 1;
  return {
    markers: priorities.slice(0, visibleCount),
    hiddenCount: priorities.length - visibleCount,
    totalCount: priorities.length,
  };
}
