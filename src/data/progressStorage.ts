import { INITIAL_PROGRESS, type Progress } from '../logic/progress';
import { SHOP_ITEMS } from '../logic/shop';

const STORAGE_KEY = 'mission-impenguinable:progress';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCountRecord(value: unknown) {
  return isRecord(value) && Object.values(value).every((count) => Number.isInteger(count));
}

function isShopItemId(value: unknown) {
  return SHOP_ITEMS.some((item) => item.id === value);
}

function getKnownItems(value: unknown) {
  return Array.isArray(value) ? value.filter(isShopItemId) : [];
}

function isProgress(value: unknown): value is Progress {
  if (!isRecord(value)) return false;

  const { fish, divesByDate, rewardedTaskIds, ownedItems } = value;
  return (
    Number.isInteger(fish) &&
    (fish as number) >= 0 &&
    isCountRecord(divesByDate) &&
    Array.isArray(rewardedTaskIds) &&
    rewardedTaskIds.every((id) => Number.isInteger(id)) &&
    Array.isArray(ownedItems) &&
    ownedItems.every(isShopItemId)
  );
}

export function loadStoredProgress(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return INITIAL_PROGRESS;

    const content: unknown = JSON.parse(stored);
    if (!isRecord(content)) return INITIAL_PROGRESS;

    const progress = {
      ...INITIAL_PROGRESS,
      ...content,
      ownedItems: getKnownItems(content.ownedItems),
    };
    return isProgress(progress) ? progress : INITIAL_PROGRESS;
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function storeProgress(progress: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.warn('Could not save progress to localStorage.');
  }
}
