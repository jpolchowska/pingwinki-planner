import { Icon } from '../components/Icon';
import { Penguin } from '../components/Penguin';
import { useCountdown } from '../hooks/useCountdown';

interface DiveScreenProps {
  mode: 'dive' | 'break';
  title: string;
  seconds: number;
  onFinish: () => void;
  onExit: () => void;
}

function formatClock(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function DiveScreen({ mode, title, seconds, onFinish, onExit }: DiveScreenProps) {
  const { remainingSeconds, isRunning, toggleRunning, skipToEnd } = useCountdown(seconds, onFinish);
  const isDive = mode === 'dive';
  const clock = formatClock(remainingSeconds);

  return (
    <main className={`focus-stage focus-stage--${mode}`}>
      <span className="focus-bubble focus-bubble--one" aria-hidden="true" />
      <span className="focus-bubble focus-bubble--two" aria-hidden="true" />
      <span className="focus-bubble focus-bubble--three" aria-hidden="true" />
      <span className="focus-fish focus-fish--one" aria-hidden="true">
        <Icon name="fish" color={isDive ? '#BFE3EA' : '#4F4F4F'} size={34} />
      </span>
      <span className="focus-fish focus-fish--two" aria-hidden="true">
        <Icon name="fish" color={isDive ? '#BFE3EA' : '#4F4F4F'} size={26} />
      </span>

      <p className="focus-kicker">{isDive ? 'Nurkowanie' : 'Na lodzie'}</p>
      <h1 className="title focus-title">{title}</h1>

      <div className="focus-hole">
        <Penguin pose={isDive ? 'dive' : 'sleepy'} pixelSize={4} />
        <div className="title focus-clock" role="timer" aria-label={clock}>
          {clock}
        </div>
      </div>

      <div className="focus-spacer" />

      <div className="field-row focus-actions">
        <button className="button sheet-action" type="button" onClick={toggleRunning}>
          {isRunning ? 'Pauza' : 'Wznów'}
        </button>
        <button className="button button--secondary sheet-action" type="button" onClick={onExit}>
          {isDive ? 'Wynurz się' : 'Wróć'}
        </button>
      </div>
      <button className="focus-skip" type="button" onClick={skipToEnd}>
        Pomiń do końca (podgląd)
      </button>
    </main>
  );
}
