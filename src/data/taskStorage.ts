import type { Task } from './task';
import { parseTaskFile, serializeTaskFile } from './taskFile';

const STORAGE_KEY = 'mission-impenguinable:tasks';

export function loadStoredTasks(): Task[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? null : parseTaskFile(stored);
  } catch {
    return null;
  }
}

export function storeTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, serializeTaskFile(tasks));
  } catch {
    console.warn('Could not save tasks to localStorage.');
  }
}

export async function fetchSampleTasks(): Promise<Task[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}zadania.json`);
  if (!response.ok) throw new Error(`Could not fetch sample tasks: ${response.status}`);
  return parseTaskFile(await response.text());
}
