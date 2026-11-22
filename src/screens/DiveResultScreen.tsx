import { Penguin } from '../components/Penguin';
import { GOLDEN_FISH_VALUE } from '../logic/progress';

export type DiveReward = 'fish' | 'golden' | 'none';

const REWARD_TEXTS: Record<DiveReward, { subtitle: string; title: string }> = {
  fish: { subtitle: 'Nurkowanie ukończone', title: '+1 ryba' },
  golden: {
    subtitle: 'Misja ukończona',
    title: `+1 złota rybka (${GOLDEN_FISH_VALUE} ryby)`,
  },
  none: { subtitle: 'Misja czeka dalej', title: 'Brak ryby, ale nic nie tracisz' },
};

interface DiveResultScreenProps {
  reward: DiveReward;
  breakSeconds: number | null;
  onBreak: () => void;
  onBack: () => void;
}

export function DiveResultScreen({ reward, breakSeconds, onBreak, onBack }: DiveResultScreenProps) {
  const { subtitle, title } = REWARD_TEXTS[reward];

  return (
    <main className="result-screen">
      <div className="result-card">
        <Penguin pose={reward === 'none' ? 'ready' : 'happy'} pixelSize={6} />
        <p className="result-subtitle">{subtitle}</p>
        <h1 className="title result-title">{title}</h1>
      </div>

      {breakSeconds !== null && (
        <button className="button result-button" type="button" onClick={onBreak}>
          Na lodzie, {breakSeconds / 60} min
        </button>
      )}
      <button
        className={`button result-button${breakSeconds !== null ? ' button--secondary' : ''}`}
        type="button"
        onClick={onBack}
      >
        Wróć do misji
      </button>
    </main>
  );
}
