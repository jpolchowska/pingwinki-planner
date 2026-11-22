import { useState } from 'react';
import type { Priority, Task } from '../data/task';
import { countPlannedDives, getPlannedDivesOn, type AttackPlans } from '../logic/attackPlan';
import {
  formatCalendarMonth,
  getCalendarMonth,
  getDayMarkers,
  getDayTasks,
  getMonthCells,
  shiftCalendarMonth,
} from '../logic/calendar';
import { formatShortDate } from '../logic/dates';
import { isOverloadedDay } from '../logic/overload';
import { MissionCard } from './MissionCard';

const WEEKDAYS = ['pn', 'wt', 'śr', 'cz', 'pt', 'sb', 'nd'];
const MARKER_LIMIT = 3;

const MARKER_CLASSES: Record<Priority, string> = {
  high: 'calendar-marker--high',
  medium: 'calendar-marker--medium',
  low: 'calendar-marker--low',
};

interface MissionCalendarProps {
  tasks: Task[];
  plans: AttackPlans;
  today: string;
  selectedDate: string;
  onSelect: (isoDate: string) => void;
  onToggle: (id: number) => void;
  onOpen: (task: Task) => void;
}

export function MissionCalendar({
  tasks,
  plans,
  today,
  selectedDate,
  onSelect,
  onToggle,
  onOpen,
}: MissionCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => getCalendarMonth(selectedDate));
  const selectedTasks = getDayTasks(tasks, selectedDate);
  const selectedDives = getPlannedDivesOn(plans, tasks, selectedDate);

  const getDayClassName = (isoDate: string, isOverloaded: boolean) =>
    [
      'calendar-day',
      isoDate === today && 'calendar-day--today',
      isoDate === selectedDate && 'calendar-day--selected',
      isOverloaded && 'calendar-day--overloaded',
    ]
      .filter(Boolean)
      .join(' ');

  return (
    <section aria-label="Kalendarz misji">
      <div className="calendar-header">
        <button
          className="calendar-step"
          type="button"
          aria-label="Poprzedni miesiąc"
          onClick={() => setVisibleMonth(shiftCalendarMonth(visibleMonth, -1))}
        >
          ‹
        </button>
        <h2 className="title calendar-month">{formatCalendarMonth(visibleMonth)}</h2>
        <button
          className="calendar-step"
          type="button"
          aria-label="Następny miesiąc"
          onClick={() => setVisibleMonth(shiftCalendarMonth(visibleMonth, 1))}
        >
          ›
        </button>
      </div>

      <div className="calendar-grid calendar-weekdays" aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {getMonthCells(visibleMonth).map((isoDate, index) => {
          if (isoDate === null) return <span key={`empty-${index}`} />;

          const { markers, hiddenCount, totalCount } = getDayMarkers(tasks, isoDate, MARKER_LIMIT);
          const isOverloaded = isOverloadedDay(tasks, isoDate);
          const overloadLabel = isOverloaded ? ', cienki lód' : '';
          const diveCount = countPlannedDives(getPlannedDivesOn(plans, tasks, isoDate));
          const diveLabel = diveCount > 0 ? `, nurkowania: ${diveCount}` : '';

          return (
            <button
              className={getDayClassName(isoDate, isOverloaded)}
              type="button"
              key={isoDate}
              aria-pressed={isoDate === selectedDate}
              aria-label={`${formatShortDate(isoDate)}, misje: ${totalCount}${diveLabel}${overloadLabel}`}
              onClick={() => onSelect(isoDate)}
            >
              {diveCount > 0 && <span className="calendar-dives">{diveCount}</span>}
              <span>{Number(isoDate.slice(8))}</span>
              <span className="calendar-markers">
                {markers.map((priority, markerIndex) => (
                  <span className={`calendar-marker ${MARKER_CLASSES[priority]}`} key={markerIndex} />
                ))}
                {hiddenCount > 0 && <span className="calendar-more">+{hiddenCount}</span>}
              </span>
            </button>
          );
        })}
      </div>

      <p className="calendar-legend">
        <span className="calendar-legend-swatch" aria-hidden="true" />
        Cienki lód: ważne terminy blisko siebie
      </p>
      <p className="calendar-legend calendar-legend--compact">
        <span className="calendar-legend-dive" aria-hidden="true">
          1
        </span>
        Zaplanowane nurkowania
      </p>

      <h2 className="title calendar-day-title">Misje na {formatShortDate(selectedDate)}</h2>
      {selectedDives.length > 0 && (
        <ul className="plan-list plan-list--calendar">
          {selectedDives.map(({ task, dives }) => (
            <li key={task.id}>
              Nurkowania: {task.title} × {dives}
            </li>
          ))}
        </ul>
      )}
      {selectedTasks.length === 0 && <p className="screen-note">Brak misji tego dnia.</p>}
      {selectedTasks.map((task) => (
        <MissionCard task={task} today={today} onToggle={onToggle} onOpen={onOpen} key={task.id} />
      ))}
    </section>
  );
}
