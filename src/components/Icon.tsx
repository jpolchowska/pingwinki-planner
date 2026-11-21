import type { ReactNode } from 'react';

const ICON_SHAPES = {
  fish: (
    <>
      <path d="M5 24 Q19 8 34 24 Q19 40 5 24 Z" />
      <path d="M34 24 L44 13 L44 35 Z" />
      <path d="M12 22 L12 22" />
    </>
  ),
  paw: (
    <>
      <ellipse cx="24" cy="31" rx="9" ry="7.5" />
      <circle cx="10" cy="22" r="4" />
      <circle cx="18" cy="12" r="4" />
      <circle cx="30" cy="12" r="4" />
      <circle cx="38" cy="22" r="4" />
    </>
  ),
  ball: (
    <>
      <circle cx="24" cy="24" r="16" />
      <path d="M9 20 Q24 30 39 20 M24 8 Q14 24 24 40" />
    </>
  ),
  hat: (
    <>
      <path d="M9 41 L24 10 L39 41 Z" />
      <path d="M14 31 L34 31" />
      <circle cx="24" cy="7" r="3" />
    </>
  ),
  scarf: (
    <>
      <path d="M7 12 Q24 24 41 12 L41 21 Q24 33 7 21 Z" />
      <path d="M30 27 L32 43 L40 41 L38 25" />
    </>
  ),
  cape: (
    <>
      <path d="M15 8 Q24 14 33 8 L43 42 Q24 34 5 42 Z" />
      <path d="M15 8 Q24 20 33 8" />
    </>
  ),
  toy: (
    <>
      <path d="M8 30 Q8 19 21 19 Q22 8 33 9 Q39 11 36 18 L45 20 L36 25 Q38 40 23 41 Q8 41 8 30 Z" />
      <circle cx="31" cy="14" r="1" />
    </>
  ),
  today: (
    <>
      <circle cx="24" cy="24" r="8" />
      <path d="M24 5 V11 M24 37 V43 M5 24 H11 M37 24 H43 M11 11 L15 15 M33 33 L37 37 M37 11 L33 15 M11 37 L15 33" />
    </>
  ),
  flag: <path d="M11 43 V6 M11 9 H39 L32 18 L39 27 H11" />,
  igloo: (
    <>
      <path d="M5 41 Q5 9 24 9 Q43 9 43 41 Z" />
      <path d="M5 27 H43 M17 27 V41 M31 27 V41 M24 9 V27" />
    </>
  ),
  file: (
    <>
      <path d="M11 5 H29 L39 15 V43 H11 Z" />
      <path d="M29 5 V15 H39 M17 26 H33 M17 34 H33" />
    </>
  ),
  plus: <path d="M24 8 V40 M8 24 H40" />,
  check: <path d="M9 25 L20 36 L39 12" />,
  close: <path d="M10 10 L38 38 M38 10 L10 38" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICON_SHAPES;

const DEFAULT_STROKE_WIDTH = 3.5;
const STROKE_WIDTHS: Partial<Record<IconName, number>> = {
  plus: 5.5,
  check: 6,
  close: 5,
};

interface IconProps {
  name: IconName;
  color?: string;
  fill?: string;
  size?: number;
}

export function Icon({ name, color = '#FFD25A', fill = 'none', size = 44 }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden="true"
      fill={fill}
      stroke={color}
      strokeWidth={STROKE_WIDTHS[name] ?? DEFAULT_STROKE_WIDTH}
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {ICON_SHAPES[name]}
    </svg>
  );
}
