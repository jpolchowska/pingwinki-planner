import type { ShopItemId } from '../logic/shop';
import { ITEM_COLORS, ITEM_SPRITES } from './itemSprites';

interface ItemSpriteProps {
  item: ShopItemId;
  size: number;
}

export function ItemSprite({ item, size }: ItemSpriteProps) {
  const rows = ITEM_SPRITES[item];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rows.flatMap((row, y) =>
        [...row].flatMap((pixel, x) =>
          ITEM_COLORS[pixel]
            ? [<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={ITEM_COLORS[pixel]} />]
            : [],
        ),
      )}
    </svg>
  );
}
