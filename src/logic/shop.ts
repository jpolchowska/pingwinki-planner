import type { Progress } from './progress';

export type ShopItemId = 'ball' | 'hat' | 'scarf' | 'glasses' | 'toy';

export interface ShopItem {
  id: ShopItemId;
  name: string;
  price: number;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'ball', name: 'Piłka', price: 3 },
  { id: 'hat', name: 'Kapelusz', price: 4 },
  { id: 'scarf', name: 'Szalik', price: 5 },
  { id: 'glasses', name: 'Okulary agenta', price: 6 },
  { id: 'toy', name: 'Zabawka', price: 7 },
];

export function canBuyItem(progress: Progress, item: ShopItem) {
  return !progress.ownedItems.includes(item.id) && progress.fish >= item.price;
}

export function buyItem(progress: Progress, item: ShopItem): Progress {
  if (!canBuyItem(progress, item)) return progress;

  return {
    ...progress,
    fish: progress.fish - item.price,
    ownedItems: [...progress.ownedItems, item.id],
  };
}

export function getPenguinOutfit(ownedItems: ShopItemId[]) {
  return {
    hat: ownedItems.includes('hat'),
    scarf: ownedItems.includes('scarf'),
    glasses: ownedItems.includes('glasses'),
  };
}
