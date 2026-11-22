import type { Task } from '../data/task';
import { formatShortDate, getDueLabel } from '../logic/dates';
import { IceFloe } from './IceFloe';
import { Icon } from './Icon';
import { PriorityBadge } from './PriorityBadge';

interface MissionCardProps {
  task: Task;
  today: string;
  onToggle: (id: number) => void;
  onOpen: (task: Task) => void;
}

export function MissionCard({ task, today, onToggle, onOpen }: MissionCardProps) {
  const dueLabel =
    task.done && task.dueDate ? formatShortDate(task.dueDate) : getDueLabel(task.dueDate, today);

  return (
    <article className="card mission-card">
      <button
        className="mission-check"
        type="button"
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.title}
        onClick={() => onToggle(task.id)}
      >
        <span className={`mission-checkbox${task.done ? ' mission-checkbox--done' : ''}`}>
          {task.done && <Icon name="check" color="#1E1E1E" size={14} />}
        </span>
      </button>

      <button className="mission-body" type="button" onClick={() => onOpen(task)}>
        <span className={`mission-title${task.done ? ' mission-title--done' : ''}`}>{task.title}</span>
        <span className="mission-divider" />
        <span className="mission-meta">
          {task.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
          {!task.done && <IceFloe dueDate={task.dueDate} today={today} />}
          <span className="mission-due">{dueLabel}</span>
        </span>
      </button>

      <PriorityBadge priority={task.priority} />
    </article>
  );
}
