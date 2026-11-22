import type { Priority, Task } from '../data/task';
import { daysUntil } from './dates';

const TODAY_MISSION_LIMIT = 3;
const NO_DUE_DATE = '9999-12-31';

const PRIORITY_POINTS: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const PRIORITY_REASONS: Record<Priority, string> = {
  low: 'niski priorytet',
  medium: 'średni priorytet',
  high: 'wysoki priorytet',
};

function getUrgencyPoints(dueDate: string | null, today: string) {
  if (dueDate === null) return 0;

  const days = daysUntil(dueDate, today);
  if (days < 0) return 5;
  if (days === 0) return 4;
  if (days <= 2) return 3;
  if (days <= 7) return 2;
  return 0;
}

function getDeadlineReason(dueDate: string | null, today: string) {
  if (dueDate === null) return 'Bez terminu';

  const days = daysUntil(dueDate, today);
  if (days < 0) return 'Po terminie';
  if (days === 0) return 'Termin dziś';
  if (days === 1) return 'Termin jutro';
  return `Termin za ${days} dni`;
}

export function scoreTask(task: Task, today: string) {
  return PRIORITY_POINTS[task.priority] + getUrgencyPoints(task.dueDate, today);
}

export function getMissionReason(task: Task, today: string) {
  return `${getDeadlineReason(task.dueDate, today)}, ${PRIORITY_REASONS[task.priority]}`;
}

export function pickTodayMissions(tasks: Task[], today: string) {
  return tasks
    .filter((task) => !task.done && (task.dueDate === null || daysUntil(task.dueDate, today) >= 0))
    .sort(
      (first, second) =>
        scoreTask(second, today) - scoreTask(first, today) ||
        (first.dueDate ?? NO_DUE_DATE).localeCompare(second.dueDate ?? NO_DUE_DATE),
    )
    .slice(0, TODAY_MISSION_LIMIT);
}
