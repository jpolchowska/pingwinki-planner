import type { Priority, Task } from '../data/task';
import { addDays, daysUntil } from './dates';

const MIN_PLAN_DAYS = 2;
const MAX_PLAN_DAYS = 14;

const DEFAULT_DIVES: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 4,
};

export const MIN_PLAN_DIVES = 1;
export const MAX_PLAN_DIVES = 8;
export const DAILY_DIVE_LIMIT = 8;

export interface PlannedDay {
  date: string;
  dives: number;
}

export type AttackPlans = Record<number, PlannedDay[]>;

export function canPlanAttack(dueDate: string | null, today: string) {
  if (dueDate === null) return false;

  const days = daysUntil(dueDate, today);
  return days >= MIN_PLAN_DAYS && days <= MAX_PLAN_DAYS;
}

export function getDefaultDives(priority: Priority) {
  return DEFAULT_DIVES[priority];
}

export function distributeDives(diveCount: number, dueDate: string, today: string): PlannedDay[] {
  const days = daysUntil(dueDate, today);

  return Array.from({ length: days }, (_, index) => ({
    date: addDays(today, index),
    dives:
      Math.floor(((index + 1) * diveCount) / days) - Math.floor((index * diveCount) / days),
  }));
}

export function getPlannedDivesOn(plans: AttackPlans, tasks: Task[], date: string) {
  return tasks.flatMap((task) => {
    if (task.done) return [];

    const dives = plans[task.id]?.find((day) => day.date === date)?.dives ?? 0;
    return dives > 0 ? [{ task, dives }] : [];
  });
}

export function countPlannedDives(plannedDives: { dives: number }[]) {
  return plannedDives.reduce((total, { dives }) => total + dives, 0);
}
