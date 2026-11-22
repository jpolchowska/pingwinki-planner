import { daysUntil } from './dates';

const MIN_ICE_LEVEL = 12;
const ICE_LEVEL_RANGE = 88;
const FULL_ICE_DAYS = 7;

export function getIceLevel(dueDate: string | null, today: string) {
  if (dueDate === null) return null;

  const days = daysUntil(dueDate, today);
  if (days < 0) return 0;

  const remainingShare = Math.min(1, days / FULL_ICE_DAYS);
  return Math.round(MIN_ICE_LEVEL + ICE_LEVEL_RANGE * remainingShare);
}
