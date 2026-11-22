import { getIceLevel } from '../logic/iceFloe';

interface IceFloeProps {
  dueDate: string | null;
  today: string;
}

export function IceFloe({ dueDate, today }: IceFloeProps) {
  const level = getIceLevel(dueDate, today);

  if (level === null) return null;

  return (
    <span className="ice-bar" aria-hidden="true">
      {level > 0 && <span className="ice-bar-fill" style={{ width: `${level}%` }} />}
    </span>
  );
}
