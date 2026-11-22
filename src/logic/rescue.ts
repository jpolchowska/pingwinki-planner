import type { Task } from '../data/task';
import { daysUntil } from './dates';

export function getOverdueTasks(tasks: Task[], today: string) {
  return tasks
    .filter((task) => !task.done && task.dueDate !== null && daysUntil(task.dueDate, today) < 0)
    .sort((first, second) => first.dueDate!.localeCompare(second.dueDate!));
}
