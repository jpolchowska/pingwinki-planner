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

interface PendingImport {
  fileName: string;
  tasks: Task[];
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
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectFile = async (file: File) => {
    setStatus(null);
    try {
      setPendingImport({ fileName: file.name, tasks: parseTaskFile(await file.text()) });
    } catch (error) {
      const message =
        error instanceof TaskFileError ? error.message : 'Nie udało się odczytać pliku.';
      setPendingImport(null);
      setStatus({ type: 'error', message: `Nie udało się wczytać pliku. ${message}` });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) void selectFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void selectFile(file);
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    onImport(pendingImport.tasks);
    setStatus({
      type: 'success',
      message: `Wczytano ${formatMissionCount(pendingImport.tasks.length)}!`,
    });
    setPendingImport(null);
  };

  const handleSave = () => {
    downloadTaskFile(tasks);
    setStatus({ type: 'success', message: `Pobrano ${formatMissionCount(tasks.length)}!` });
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
        className={`file-drop${isDragging ? ' file-drop--dragging' : ''}`}
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Icon name="file" />
        <span className="file-drop-title">
          {pendingImport ? 'Wybierz inny plik' : 'Wybierz plik JSON'}
        </span>
        <span className="file-drop-hint">Przeciągnij plik tutaj albo dotknij</span>
      </button>

      {pendingImport && (
        <section className="card file-preview" aria-label="Wybrany plik">
          <p className="file-preview-name">{pendingImport.fileName}</p>
          <div className="card-divider" />
          <p className="file-preview-text">Znaleziono: {formatMissionCount(pendingImport.tasks.length)}</p>
          <p className="file-preview-text">Wczytanie zastąpi obecną listę.</p>
          <div className="field-row file-preview-actions">
            <button
              className="button button--secondary sheet-action"
              type="button"
              onClick={() => setPendingImport(null)}
            >
              Anuluj
            </button>
            <button className="button sheet-action sheet-action--primary" type="button" onClick={confirmImport}>
              Wczytaj misje
            </button>
          </div>
        </section>
      )}

      {status && (
        <div
          className={`file-status file-status--${status.type}`}
          role={status.type === 'error' ? 'alert' : 'status'}
        >
          {status.message}
        </div>
      )}

      <button className="button file-save" type="button" disabled={isLoading} onClick={handleSave}>
        Pobierz plik z misjami
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
