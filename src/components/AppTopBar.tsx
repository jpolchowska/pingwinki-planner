import { Icon } from './Icon';

interface AppTopBarProps {
  fish: number;
  streak: number;
}

export function AppTopBar({ fish, streak }: AppTopBarProps) {
  return (
    <div className="app-topbar">
      <div className="streak-counter" aria-label={`Seria dni: ${streak}`}>
        <span
          className={`streak-cube${streak > 0 ? ' streak-cube--active' : ''}`}
          aria-hidden="true"
        />
        <span>{streak}</span>
      </div>
      <div className="fish-counter" aria-label={`Ryby: ${fish}`}>
        <Icon name="fish" color="#1E1E1E" size={26} />
        <span>{fish}</span>
      </div>
    </div>
  );
}
