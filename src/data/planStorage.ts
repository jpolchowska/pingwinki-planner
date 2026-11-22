import type { AttackPlans, PlannedDay } from '../logic/attackPlan';

const STORAGE_KEY = 'mission-impenguinable:plans';

function isPlannedDay(value: unknown): value is PlannedDay {
  if (typeof value !== 'object' || value === null) return false;

  const { date, dives } = value as Record<string, unknown>;
  return typeof date === 'string' && Number.isInteger(dives);
}

export function loadStoredPlans(): AttackPlans {
  try {
    const content: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    if (typeof content !== 'object' || content === null || Array.isArray(content)) return {};

    const entries = Object.entries(content).filter(
      ([id, days]) => Number.isInteger(Number(id)) && Array.isArray(days) && days.every(isPlannedDay),
    );
    return Object.fromEntries(entries) as AttackPlans;
  } catch {
    return {};
  }
}

export function storePlans(plans: AttackPlans) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch {
    console.warn('Could not save attack plans to localStorage.');
  }
}
