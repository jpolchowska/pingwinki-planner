export const PIXEL_COLORS = {
  outline: '#1E1E1E',
  head: '#3B3B3B',
  white: '#F8F8F8',
  body: '#B8B8B8',
  shade: '#8F8F8F',
  highlight: '#D6D6D6',
  yellow: '#FFD25A',
  amber: '#E0A21A',
  pink: '#F4A6B8',
  ice: '#BFE3EA',
  coral: '#E97157',
} as const;

export type PenguinPose = 'ready' | 'happy' | 'sleepy' | 'dive';
export type PixelColor = keyof typeof PIXEL_COLORS;
export type SpriteGrid = (PixelColor | null)[][];

export interface PenguinOutfit {
  hat: boolean;
  scarf: boolean;
  glasses: boolean;
}

export const NO_OUTFIT: PenguinOutfit = { hat: false, scarf: false, glasses: false };

type Point = readonly [number, number];

const SPRITE_WIDTH = 33;
const SPRITE_HEIGHT = 37;
const HORIZONTAL_OFFSET = 1;
const DIVE_TAIL_SPACE = 8;

const RING_OFFSETS: Point[] = [
  [0, 0],
  [1, 0],
  [2, 0],
  [0, 1],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2],
];

function createGrid(width: number, height: number): SpriteGrid {
  return Array.from({ length: height }, () => new Array<PixelColor | null>(width).fill(null));
}

function createPainter(grid: SpriteGrid) {
  const pixel = (x: number, y: number, color: PixelColor) => {
    const shiftedX = x + HORIZONTAL_OFFSET;
    if (shiftedX >= 0 && shiftedX < SPRITE_WIDTH && y >= 0 && y < SPRITE_HEIGHT) {
      grid[y][shiftedX] = color;
    }
  };

  const ellipse = (cx: number, cy: number, rx: number, ry: number, color: PixelColor) => {
    const shiftedCx = cx + HORIZONTAL_OFFSET;
    for (let y = 0; y < SPRITE_HEIGHT; y++) {
      for (let x = 0; x < SPRITE_WIDTH; x++) {
        const dx = (x - shiftedCx) / rx;
        const dy = (y - cy) / ry;
        if (dx * dx + dy * dy <= 1) grid[y][x] = color;
      }
    }
  };

  const outlinedEllipse = (cx: number, cy: number, rx: number, ry: number, color: PixelColor) => {
    ellipse(cx, cy, rx + 1, ry + 1, 'outline');
    ellipse(cx, cy, rx, ry, color);
  };

  const points = (list: Point[], color: PixelColor) => {
    list.forEach(([x, y]) => pixel(x, y, color));
  };

  return { pixel, ellipse, outlinedEllipse, points };
}

type Painter = ReturnType<typeof createPainter>;

function paintBody({ pixel, ellipse, outlinedEllipse }: Painter, pose: PenguinPose) {
  outlinedEllipse(6, 26.5, 3.4, 6.5, 'yellow');
  outlinedEllipse(24, 26.5, 3.4, 6.5, 'yellow');
  ellipse(5.5, 27.5, 1, 4, 'amber');
  ellipse(24.5, 27.5, 1, 4, 'amber');
  outlinedEllipse(15, 26, 8.5, 7, 'body');
  ellipse(15, 28, 5.4, 4.4, 'white');
  for (let y = 22; y <= 30; y++) pixel(22, y, 'shade');
  outlinedEllipse(10.5, 34.5, 3.4, 1.4, 'yellow');
  outlinedEllipse(19.5, 34.5, 3.4, 1.4, 'yellow');
  outlinedEllipse(6.6, 25.5, 1.8, 4.2, 'shade');
  if (pose !== 'happy') outlinedEllipse(23.4, 25.5, 1.8, 4.2, 'shade');
  outlinedEllipse(15, 19, 8, 1.8, 'yellow');
  outlinedEllipse(13.2, 22.3, 1.4, 1.1, 'yellow');
  outlinedEllipse(16.8, 22.3, 1.4, 1.1, 'yellow');
  pixel(15, 22, 'amber');
}

function paintRect(
  { pixel }: Painter,
  [left, top]: Point,
  [right, bottom]: Point,
  color: PixelColor,
) {
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) pixel(x, y, color);
  }
}

function paintHat(painter: Painter) {
  paintRect(painter, [9, 0], [21, 6], 'outline');
  paintRect(painter, [10, 1], [20, 5], 'coral');
  paintRect(painter, [10, 4], [20, 4], 'yellow');
  paintRect(painter, [5, 6], [25, 8], 'outline');
  paintRect(painter, [6, 7], [24, 7], 'coral');
}

function paintGlasses(painter: Painter) {
  paintRect(painter, [5, 11], [25, 12], 'outline');
  paintRect(painter, [7, 11], [12, 15], 'outline');
  paintRect(painter, [18, 11], [23, 15], 'outline');
  painter.points([[8, 12], [9, 12], [8, 13], [19, 12], [20, 12], [19, 13]], 'ice');
}

function paintScarf(painter: Painter) {
  paintRect(painter, [6, 20], [24, 23], 'outline');
  paintRect(painter, [7, 21], [23, 22], 'coral');
  paintRect(painter, [18, 23], [22, 30], 'outline');
  paintRect(painter, [19, 23], [21, 29], 'coral');
  paintRect(painter, [19, 26], [21, 26], 'yellow');
}

function paintHead({ ellipse, outlinedEllipse, points }: Painter) {
  outlinedEllipse(15, 11, 11, 9.5, 'head');
  points([[6, 9], [7, 7], [8, 5], [10, 4], [12, 3], [13, 3]], 'highlight');
  ellipse(10.4, 13.4, 5, 5, 'white');
  ellipse(19.6, 13.4, 5, 5, 'white');
  ellipse(15, 16, 6.5, 4, 'white');
  points([[14, 14], [15, 14], [16, 14], [13, 15], [17, 15], [14, 16], [16, 16], [15, 17]], 'outline');
  points([[14, 15], [15, 15], [16, 15], [15, 16]], 'yellow');
  points([[6, 15], [7, 15], [8, 15], [22, 15], [23, 15], [24, 15]], 'pink');
}

function paintOpenEyes({ points }: Painter) {
  points(
    [[9, 12], [10, 12], [9, 13], [10, 13], [9, 14], [10, 14], [20, 12], [21, 12], [20, 13], [21, 13], [20, 14], [21, 14]],
    'outline',
  );
  points([[9, 12], [20, 12]], 'white');
}

function paintSleepyFace({ points }: Painter) {
  points([[8, 13], [9, 14], [10, 14], [11, 13], [19, 13], [20, 14], [21, 14], [22, 13]], 'outline');
  points([[24, 2], [25, 2], [26, 2], [25, 3], [24, 4], [25, 4], [26, 4]], 'yellow');
}

function paintHappyFace({ pixel, outlinedEllipse, points }: Painter) {
  points([[8, 14], [9, 13], [10, 13], [11, 14], [19, 14], [20, 13], [21, 13], [22, 14]], 'outline');
  pixel(15, 16, 'coral');
  outlinedEllipse(25.8, 22, 1.8, 4.2, 'shade');
  outlinedEllipse(26, 18, 1.6, 2.4, 'shade');
  outlinedEllipse(28, 13.5, 2.4, 1.5, 'yellow');
  points([[31, 12], [31, 13], [31, 14], [31, 15]], 'yellow');
  pixel(26, 13, 'outline');
  points([[2, 2], [1, 6], [5, 0], [27, 4]], 'yellow');
}

function rotateForDive(grid: SpriteGrid): SpriteGrid {
  const rotated = createGrid(SPRITE_HEIGHT + DIVE_TAIL_SPACE, SPRITE_WIDTH);

  for (let y = 0; y < SPRITE_HEIGHT; y++) {
    for (let x = 0; x < SPRITE_WIDTH; x++) {
      if (grid[y][x]) rotated[SPRITE_WIDTH - 1 - x][y + DIVE_TAIL_SPACE] = grid[y][x];
    }
  }

  const bubbleRings: Point[] = [[1, 3], [3, 19], [5, 11]];
  bubbleRings.forEach(([ringX, ringY]) => {
    RING_OFFSETS.forEach(([dx, dy]) => {
      rotated[ringY + dy][ringX + dx] = 'ice';
    });
  });

  const bubbles: Point[] = [[0, 24], [6, 27], [7, 7]];
  bubbles.forEach(([x, y]) => {
    rotated[y][x] = 'ice';
  });

  return rotated;
}

export function buildPenguinSprite(pose: PenguinPose, outfit = NO_OUTFIT): SpriteGrid {
  const grid = createGrid(SPRITE_WIDTH, SPRITE_HEIGHT);
  const painter = createPainter(grid);

  paintBody(painter, pose);
  paintHead(painter);
  if (outfit.scarf) paintScarf(painter);
  if (outfit.hat) paintHat(painter);

  if (pose === 'ready' || pose === 'dive') paintOpenEyes(painter);
  if (pose === 'sleepy') paintSleepyFace(painter);
  if (pose === 'happy') paintHappyFace(painter);
  if (outfit.glasses) paintGlasses(painter);

  return pose === 'dive' ? rotateForDive(grid) : grid;
}
