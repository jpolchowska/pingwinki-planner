import type { Task } from '../data/task';

export type TaskScope = 'all' | 'high' | 'withDueDate';

const SCOPE_MATCHERS: Record<TaskScope, (task: Task) => boolean> = {
  all: () => true,
  high: (task) => task.priority === 'high',
  withDueDate: (task) => task.dueDate !== null,
};

export function getAvailableTags(tasks: Task[]) {
  return [...new Set(tasks.flatMap((task) => task.tags))];
}

export function filterTasks(tasks: Task[], scope: TaskScope, tag: string | null) {
  return tasks.filter(
    (task) => SCOPE_MATCHERS[scope](task) && (tag === null || task.tags.includes(tag)),
  );
}
