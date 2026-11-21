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
