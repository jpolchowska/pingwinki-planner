import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Icon } from '../components/Icon';
import { Penguin } from '../components/Penguin';
import { downloadTaskFile } from '../data/downloadTaskFile';
import type { Task } from '../data/task';
import { parseTaskFile, TaskFileError } from '../data/taskFile';

interface FileScreenProps {
  tasks: Task[];
  isLoading: boolean;
  onImport: (tasks: Task[]) => void;
}

interface FileStatus {
  type: 'success' | 'error';
  message: string;
}

function formatMissionCount(count: number) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (count === 1) return '1 misję';
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${count} misje`;
  }
  return `${count} misji`;
}

export function FileScreen({ tasks, isLoading, onImport }: FileScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<FileStatus | null>(null);

  const importFile = async (file: File) => {
    try {
      const importedTasks = parseTaskFile(await file.text());
      onImport(importedTasks);
      setStatus({ type: 'success', message: `Wczytano ${formatMissionCount(importedTasks.length)}` });
    } catch (error) {
      const message =
        error instanceof TaskFileError ? error.message : 'Nie udało się odczytać pliku.';
      setStatus({ type: 'error', message: `Nie udało się wczytać pliku. ${message}` });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) void importFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) void importFile(file);
  };

  const handleSave = () => {
    downloadTaskFile(tasks);
    setStatus({ type: 'success', message: `Zapisano ${formatMissionCount(tasks.length)}` });
  };

  return (
    <main className="screen">
      <h1 className="title screen-title">Plik</h1>

      <input
        ref={inputRef}
        className="file-input"
        type="file"
        accept=".json,application/json"
        aria-label="Wybierz plik JSON"
        onChange={handleFileChange}
      />
      <button
        className="file-drop"
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <Icon name="file" />
        <span className="file-drop-title">Wczytaj misje z pliku JSON</span>
        <span className="file-drop-hint">Przeciągnij plik tutaj albo dotknij</span>
      </button>

      {status && (
        <div
          className={`file-status file-status--${status.type}`}
          role={status.type === 'error' ? 'alert' : 'status'}
        >
          {status.message}
        </div>
      )}

      <button className="button file-save" type="button" disabled={isLoading} onClick={handleSave}>
        Zapisz misje do pliku JSON
      </button>

      <p className="file-count">
        {isLoading ? 'Wczytuję misje…' : `Masz teraz: ${formatMissionCount(tasks.length)}`}
      </p>

      <div className="file-penguin">
        <Penguin pose="ready" pixelSize={3} />
      </div>
    </main>
  );
}
