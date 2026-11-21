import type { Priority, Task } from './task';

const FILE_VERSION = 1;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const PRIORITY_FROM_FILE = new Map<unknown, Priority>([
  ['niski', 'low'],
  ['sredni', 'medium'],
  ['wysoki', 'high'],
]);

const PRIORITY_TO_FILE: Record<Priority, string> = {
  low: 'niski',
  medium: 'sredni',
  high: 'wysoki',
};

export class TaskFileError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = DATE_PATTERN.exec(value);
  if (!match) return false;

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function parseTask(raw: unknown, index: number): Task {
  const position = index + 1;
  if (!isRecord(raw)) throw new TaskFileError(`Misja ${position} ma nieprawidłowy format.`);

  const { id, tytul, opis = '', termin = null, priorytet, wykonane, tagi = [] } = raw;
  const priority = PRIORITY_FROM_FILE.get(priorytet);

  if (!Number.isInteger(id)) throw new TaskFileError(`Misja ${position}: nieprawidłowe pole „id”.`);
  if (typeof tytul !== 'string' || !tytul.trim()) {
    throw new TaskFileError(`Misja ${position}: brakuje pola „tytul”.`);
  }
  if (typeof opis !== 'string') throw new TaskFileError(`Misja ${position}: nieprawidłowe pole „opis”.`);
  if (termin !== null && !isCalendarDate(termin)) {
    throw new TaskFileError(`Misja ${position}: nieprawidłowa data w polu „termin”.`);
  }
  if (!priority) throw new TaskFileError(`Misja ${position}: nieprawidłowe pole „priorytet”.`);
  if (typeof wykonane !== 'boolean') {
    throw new TaskFileError(`Misja ${position}: nieprawidłowe pole „wykonane”.`);
  }
  if (!Array.isArray(tagi) || !tagi.every((tag) => typeof tag === 'string')) {
    throw new TaskFileError(`Misja ${position}: nieprawidłowe pole „tagi”.`);
  }

  return {
    id: id as number,
    title: tytul,
    description: opis,
    dueDate: termin,
    priority,
    done: wykonane,
    tags: tagi,
  };
}

export function parseTaskFile(text: string): Task[] {
  let content: unknown;
  try {
    content = JSON.parse(text);
  } catch {
    throw new TaskFileError('To nie jest poprawny plik JSON.');
  }

  if (!isRecord(content) || !Array.isArray(content.zadania)) {
    throw new TaskFileError('W pliku brakuje listy „zadania”.');
  }
  if (content.wersja !== FILE_VERSION) {
    throw new TaskFileError(`Nieobsługiwana wersja pliku. Oczekiwana: ${FILE_VERSION}.`);
  }

  const tasks = content.zadania.map(parseTask);
  if (new Set(tasks.map((task) => task.id)).size !== tasks.length) {
    throw new TaskFileError('W pliku powtarza się „id” misji.');
  }
  return tasks;
}

export function serializeTaskFile(tasks: Task[]): string {
  const content = {
    wersja: FILE_VERSION,
    zadania: tasks.map((task) => ({
      id: task.id,
      tytul: task.title,
      opis: task.description,
      termin: task.dueDate,
      priorytet: PRIORITY_TO_FILE[task.priority],
      wykonane: task.done,
      tagi: task.tags,
    })),
  };
  return `${JSON.stringify(content, null, 2)}\n`;
}
