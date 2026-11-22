import { useState } from 'react';
import { Icon } from '../components/Icon';
import { MissionCalendar } from '../components/MissionCalendar';
import { MissionCard } from '../components/MissionCard';
import { Penguin } from '../components/Penguin';
import type { Task } from '../data/task';
import { getTodayIso } from '../logic/dates';
import { filterTasks, getAvailableTags, type TaskScope } from '../logic/filterTasks';
import { sortTasks } from '../logic/sortTasks';

type MissionsView = 'list' | 'calendar';

const VIEWS: { id: MissionsView; label: string }[] = [
  { id: 'list', label: 'Lista' },
  { id: 'calendar', label: 'Kalendarz' },
];

const SCOPES: { id: TaskScope; label: string }[] = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'high', label: 'Wysokie' },
  { id: 'withDueDate', label: 'Z terminem' },
];

interface MissionsScreenProps {
  tasks: Task[];
  isLoading: boolean;
  onToggle: (id: number) => void;
  onOpen: (task: Task) => void;
  onAdd: (dueDate: string | null) => void;
}

export function MissionsScreen({ tasks, isLoading, onToggle, onOpen, onAdd }: MissionsScreenProps) {
  const today = getTodayIso();
  const [view, setView] = useState<MissionsView>('list');
  const [selectedDate, setSelectedDate] = useState(today);
  const [scope, setScope] = useState<TaskScope>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = getAvailableTags(tasks);
  const activeTag = selectedTag !== null && tags.includes(selectedTag) ? selectedTag : null;
  const visibleTasks = sortTasks(filterTasks(tasks, scope, activeTag));

  return (
    <div className="screen-shell">
      <main className="screen screen--with-fab">
        <h1 className="title screen-title">Misje</h1>

        <div className="view-switch">
          {VIEWS.map(({ id, label }) => (
            <button
              className={`view-switch-item${view === id ? ' view-switch-item--active' : ''}`}
              type="button"
              key={id}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading && <p className="screen-note">Wczytuję misje…</p>}

        {view === 'calendar' && !isLoading && (
          <MissionCalendar
            tasks={tasks}
            today={today}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            onToggle={onToggle}
            onOpen={onOpen}
          />
        )}

        {view === 'list' && !isLoading && tasks.length === 0 && (
          <div className="empty-state">
            <Penguin pose="sleepy" pixelSize={5} />
            <p className="title empty-state-title">Nie ma żadnej misji. Dodaj pierwszą.</p>
          </div>
        )}

        {view === 'list' && tasks.length > 0 && (
          <>
            <div className="filter-row filter-row--scope">
              {SCOPES.map(({ id, label }) => (
                <button
                  className={`chip${scope === id ? ' chip--active' : ''}`}
                  type="button"
                  key={id}
                  aria-pressed={scope === id}
                  onClick={() => setScope(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            {tags.length > 0 && (
              <div className="filter-row filter-row--tags">
                {tags.map((tag) => (
                  <button
                    className={`chip${activeTag === tag ? ' chip--active' : ''}`}
                    type="button"
                    key={tag}
                    aria-pressed={activeTag === tag}
                    onClick={() => setSelectedTag(activeTag === tag ? null : tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {visibleTasks.length === 0 && <p className="screen-note">Brak misji dla tych filtrów.</p>}

            {visibleTasks.map((task) => (
              <MissionCard task={task} today={today} onToggle={onToggle} onOpen={onOpen} key={task.id} />
            ))}
          </>
        )}
      </main>

      <button
        className="fab"
        type="button"
        aria-label="Nowa misja"
        disabled={isLoading}
        onClick={() => onAdd(view === 'calendar' ? selectedDate : null)}
      >
        <Icon name="plus" color="#1E1E1E" size={30} />
      </button>
    </div>
  );
}
