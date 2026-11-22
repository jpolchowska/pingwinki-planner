import type { Task } from '../data/task';
import { daysUntil } from './dates';
import { scoreTask } from './todayMissions';

const OVERLOAD_WINDOW_DAYS = 3;
const OVERLOAD_THRESHOLD = 2;

function formatImportantMissions(count: number) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  const usesFewForm = lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14);
  return `${count} ${usesFewForm ? 'ważne misje' : 'ważnych misji'}`;
}

export function getOverloadWarning(tasks: Task[], today: string) {
  const importantTasks = tasks
    .filter((task) => {
      if (task.done || task.priority !== 'high' || task.dueDate === null) return false;
      const days = daysUntil(task.dueDate, today);
      return days >= 0 && days <= OVERLOAD_WINDOW_DAYS;
    })
    .sort(
      (first, second) =>
        scoreTask(second, today) - scoreTask(first, today) ||
        first.dueDate!.localeCompare(second.dueDate!),
    );

  if (importantTasks.length < OVERLOAD_THRESHOLD) return null;

  const missions = formatImportantMissions(importantTasks.length);
  return `Cienki lód! ${missions} w ${OVERLOAD_WINDOW_DAYS + 1} dni. Zacznij od: ${importantTasks[0].title}`;
}
