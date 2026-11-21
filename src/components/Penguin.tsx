import { useMemo } from 'react';
import { buildPenguinSprite, PIXEL_COLORS, type PenguinPose } from './penguinSprite';

const POSE_LABELS: Record<PenguinPose, string> = {
  ready: 'Pingwin gotowy do misji',
  happy: 'Szczęśliwy pingwin z rybą',
  sleepy: 'Śpiący pingwin',
  dive: 'Pingwin nurkuje',
};

interface PenguinProps {
  pose?: PenguinPose;
  pixelSize?: number;
}

export function Penguin({ pose = 'ready', pixelSize = 4 }: PenguinProps) {
  const { width, height, boxShadow } = useMemo(() => {
    const grid = buildPenguinSprite(pose);
    const shadows = grid.flatMap((row, y) =>
      row.flatMap((color, x) =>
        color ? [`${x * pixelSize}px ${y * pixelSize}px 0 0 ${PIXEL_COLORS[color]}`] : [],
      ),
    );

    return {
      width: grid[0].length * pixelSize,
      height: grid.length * pixelSize,
      boxShadow: shadows.join(','),
    };
  }, [pose, pixelSize]);

  return (
    <div role="img" aria-label={POSE_LABELS[pose]} style={{ position: 'relative', width, height }}>
      <div style={{ width: pixelSize, height: pixelSize, boxShadow }} />
    </div>
  );
}
