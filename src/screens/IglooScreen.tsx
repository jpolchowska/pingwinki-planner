import { Icon } from '../components/Icon';
import { Penguin } from '../components/Penguin';
import { getTodayIso } from '../logic/dates';
import { getBuildWeek, getDiveStreak } from '../logic/iglooBuild';
import type { Progress } from '../logic/progress';
import { canBuyItem, SHOP_ITEMS, type ShopItem } from '../logic/shop';

const SHELF_SLOTS = 6;

interface IglooScreenProps {
  progress: Progress;
  onBuy: (item: ShopItem) => void;
}

function formatStreak(days: number) {
  return days === 1 ? '1 dzień' : `${days} dni`;
}

export function IglooScreen({ progress, onBuy }: IglooScreenProps) {
  const today = getTodayIso();
  const shelfItems = Array.from(
    { length: SHELF_SLOTS },
    (_, index) => progress.ownedItems[index] ?? null,
  );

  return (
    <main className="screen">
      <h1 className="title screen-title">Igloo</h1>

      <section className="igloo-dome" aria-label="Twoje igloo">
        <div className="igloo-penguin">
          <Penguin pose="ready" pixelSize={3} />
        </div>
        <div className="igloo-shelves">
          {shelfItems.map((itemId, index) => (
            <div className={`igloo-slot${itemId ? ' igloo-slot--filled' : ''}`} key={index}>
              {itemId && <Icon name={itemId} color="#1E1E1E" size={40} />}
            </div>
          ))}
        </div>
      </section>

      <div className="build-header">
        <h2 className="title build-title">Budowa igloo</h2>
        <p className="build-streak">
          Seria: {formatStreak(getDiveStreak(progress.divesByDate, today))}
        </p>
      </div>
      <section className="build-week" aria-label="Budowa igloo w tym tygodniu">
        {getBuildWeek(progress.divesByDate, today).map(({ date, label, isBuilt }) => (
          <div className="build-day" key={date}>
            <span
              className={`build-block${isBuilt ? ' build-block--placed' : ''}`}
              role="img"
              aria-label={isBuilt ? `${label}: blok lodu dodany` : `${label}: brak bloku`}
            />
            <span aria-hidden="true">{label}</span>
          </div>
        ))}
      </section>

      <h2 className="title igloo-heading">Sklep</h2>
      {SHOP_ITEMS.map((item) => {
        const isOwned = progress.ownedItems.includes(item.id);
        const isAvailable = canBuyItem(progress, item);
        const buttonState = isOwned ? ' button--secondary' : isAvailable ? '' : ' button--disabled';

        return (
          <article className="card card--peach shop-item" key={item.id}>
            <div className="shop-icon">
              <Icon name={item.id} size={32} />
            </div>
            <div className="shop-details">
              <h3 className="shop-name">{item.name}</h3>
              <p className="shop-price">
                <Icon name="fish" color="#1E1E1E" size={18} />
                {item.price}
              </p>
            </div>
            <button
              className={`button shop-button${buttonState}`}
              type="button"
              disabled={!isAvailable}
              aria-label={isOwned ? `${item.name}: masz` : `Kup: ${item.name}`}
              onClick={() => onBuy(item)}
            >
              {isOwned ? 'Masz' : 'Kup'}
            </button>
          </article>
        );
      })}
    </main>
  );
}
