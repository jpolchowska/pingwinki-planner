import { Icon, type IconName } from './Icon';

export type Tab = 'missions' | 'file';

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'missions', label: 'Misje', icon: 'flag' },
  { id: 'file', label: 'Plik', icon: 'file' },
];

interface BottomNavProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Główna nawigacja">
      {TABS.map(({ id, label, icon }) => {
        const isActive = id === activeTab;
        return (
          <button
            className={`nav-item${isActive ? ' nav-item--active' : ''}`}
            type="button"
            key={id}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange(id)}
          >
            <Icon name={icon} color={isActive ? '#1E1E1E' : '#FFD25A'} size={24} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
