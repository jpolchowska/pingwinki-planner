import type { Task } from './task';
import { serializeTaskFile } from './taskFile';

const FILE_NAME = 'zadania.json';

export function downloadTaskFile(tasks: Task[]) {
  const blob = new Blob([serializeTaskFile(tasks)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = FILE_NAME;
  link.click();
  URL.revokeObjectURL(url);
}
