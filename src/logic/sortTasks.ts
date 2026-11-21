import type { Task } from '../data/task';

const NO_DUE_DATE = '9999-12-31';

export function sortTasks(tasks: Task[]) {
  return [...tasks].sort(
    (first, second) =>
      Number(first.done) - Number(second.done) ||
      (first.dueDate ?? NO_DUE_DATE).localeCompare(second.dueDate ?? NO_DUE_DATE),
  );
}
