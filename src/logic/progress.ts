import type { Task } from '../data/task';
import type { ShopItemId } from './shop';

const DIVES_BEFORE_LONG_BREAK = 4;
const SHORT_BREAK_SECONDS = 5 * 60;
const LONG_BREAK_SECONDS = 15 * 60;

export const DIVE_SECONDS = 25 * 60;
export const GOLDEN_FISH_VALUE = 3;

export interface Progress {
  fish: number;
  divesByDate: Record<string, number>;
  rewardedTaskIds: number[];
  ownedItems: ShopItemId[];
}

export const INITIAL_PROGRESS: Progress = {
  fish: 0,
  divesByDate: {},
  rewardedTaskIds: [],
  ownedItems: [],
};

export function addCompletedDive(progress: Progress, date: string): Progress {
  return {
    ...progress,
    fish: progress.fish + 1,
    divesByDate: { ...progress.divesByDate, [date]: (progress.divesByDate[date] ?? 0) + 1 },
  };
}

export function canEarnGoldenFish(progress: Progress, task: Task) {
  return task.priority === 'high' && !progress.rewardedTaskIds.includes(task.id);
}

export function addGoldenFish(progress: Progress, taskId: number): Progress {
  if (progress.rewardedTaskIds.includes(taskId)) return progress;

  return {
    ...progress,
    fish: progress.fish + GOLDEN_FISH_VALUE,
    rewardedTaskIds: [...progress.rewardedTaskIds, taskId],
  };
}

export function forgetTask(progress: Progress, taskId: number): Progress {
  return {
    ...progress,
    rewardedTaskIds: progress.rewardedTaskIds.filter((id) => id !== taskId),
  };
}

export function forgetAllTasks(progress: Progress): Progress {
  return { ...progress, rewardedTaskIds: [] };
}

export function getBreakSeconds(divesToday: number) {
  return divesToday % DIVES_BEFORE_LONG_BREAK === 0 ? LONG_BREAK_SECONDS : SHORT_BREAK_SECONDS;
}
