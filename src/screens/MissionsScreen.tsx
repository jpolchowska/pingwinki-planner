import { Icon } from '../components/Icon';
import { MissionCard } from '../components/MissionCard';
import { Penguin } from '../components/Penguin';
import type { Task } from '../data/task';
import { getTodayIso } from '../logic/dates';
import { sortTasks } from '../logic/sortTasks';

interface MissionsScreenProps {
  tasks: Task[];
  isLoading: boolean;
  onToggle: (id: number) => void;
  onOpen: (task: Task) => void;
  onAdd: () => void;
}

export function MissionsScreen({ tasks, isLoading, onToggle, onOpen, onAdd }: MissionsScreenProps) {
  const today = getTodayIso();

  return (
    <div className="screen-shell">
      <main className="screen screen--with-fab">
        <h1 className="title screen-title">Misje</h1>

        {isLoading && <p className="screen-note">Wczytuję misje…</p>}

        {!isLoading && tasks.length === 0 && (
          <div className="empty-state">
            <Penguin pose="sleepy" pixelSize={5} />
            <p className="title empty-state-title">Nie ma żadnej misji. Dodaj pierwszą.</p>
          </div>
        )}

        {sortTasks(tasks).map((task) => (
          <MissionCard task={task} today={today} onToggle={onToggle} onOpen={onOpen} key={task.id} />
        ))}
      </main>

      <button className="fab" type="button" aria-label="Nowa misja" disabled={isLoading} onClick={onAdd}>
        <Icon name="plus" color="#1E1E1E" size={30} />
      </button>
    </div>
  );
}
