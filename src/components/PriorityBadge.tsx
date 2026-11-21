import type { Priority } from '../data/task';

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'niski',
  medium: 'średni',
  high: 'wysoki',
};

const PRIORITY_SHAPES: Record<Priority, React.ReactNode> = {
  low: <circle cx="11" cy="11" r="8" fill="#F8F8F8" />,
  medium: <rect x="3" y="3" width="16" height="16" fill="#FFD25A" />,
  high: <path d="M11 3 L20 19 H2 Z" fill="#E97157" />,
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className="priority-badge">
      <svg width="22" height="22" viewBox="0 0 22 22" stroke="#1E1E1E" strokeWidth="2" aria-hidden="true">
        {PRIORITY_SHAPES[priority]}
      </svg>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
