import { Icon } from './Icon';

export function FishCounter({ fish }: { fish: number }) {
  return (
    <div className="app-topbar">
      <div className="fish-counter" aria-label={`Ryby: ${fish}`}>
        <Icon name="fish" color="#1E1E1E" size={20} />
        <span>{fish}</span>
      </div>
    </div>
  );
}
