import { INITIAL_PROGRESS, type Progress } from '../logic/progress';

const STORAGE_KEY = 'mission-impenguinable:progress';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCountRecord(value: unknown) {
  return isRecord(value) && Object.values(value).every((count) => Number.isInteger(count));
}

function isProgress(value: unknown): value is Progress {
  if (!isRecord(value)) return false;

  const { fish, divesByDate, taskDives, rewardedTaskIds } = value;
  return (
    Number.isInteger(fish) &&
    (fish as number) >= 0 &&
    isCountRecord(divesByDate) &&
    isRecord(taskDives) &&
    Object.values(taskDives).every(isCountRecord) &&
    Array.isArray(rewardedTaskIds) &&
    rewardedTaskIds.every((id) => Number.isInteger(id))
  );
}

export function loadStoredProgress(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return INITIAL_PROGRESS;

    const content: unknown = JSON.parse(stored);
    return isProgress(content) ? content : INITIAL_PROGRESS;
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function storeProgress(progress: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.warn('Could not save progress to localStorage.');
  }
}
