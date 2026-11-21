export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  priority: Priority;
  done: boolean;
  tags: string[];
}

export type TaskDraft = Omit<Task, 'id' | 'done'>;

export function createTask(tasks: Task[], draft: TaskDraft): Task {
  const nextId = Math.max(0, ...tasks.map((task) => task.id)) + 1;
  return { ...draft, id: nextId, done: false };
}
