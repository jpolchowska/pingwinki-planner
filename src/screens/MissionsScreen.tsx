import { MissionCard } from '../components/MissionCard';
import { Penguin } from '../components/Penguin';
import type { Task } from '../data/task';
import { getTodayIso } from '../logic/dates';
import { sortTasks } from '../logic/sortTasks';

interface MissionsScreenProps {
  tasks: Task[];
  isLoading: boolean;
  onToggle: (id: number) => void;
}

export function MissionsScreen({ tasks, isLoading, onToggle }: MissionsScreenProps) {
  const today = getTodayIso();

  return (
    <main className="screen">
      <h1 className="title screen-title">Misje</h1>

      {isLoading && <p className="screen-note">Wczytuję misje…</p>}

      {!isLoading && tasks.length === 0 && (
        <div className="empty-state">
          <Penguin pose="sleepy" pixelSize={5} />
          <p className="title empty-state-title">Nie ma żadnej misji</p>
        </div>
      )}

      {sortTasks(tasks).map((task) => (
        <MissionCard task={task} today={today} onToggle={onToggle} key={task.id} />
      ))}
    </main>
  );
}
