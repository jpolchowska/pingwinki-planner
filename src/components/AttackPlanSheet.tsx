import { useState } from 'react';
import type { Task } from '../data/task';
import {
  countPlannedDives,
  distributeDives,
  getDefaultDives,
  MAX_PLAN_DIVES,
  MIN_PLAN_DIVES,
  type PlannedDay,
} from '../logic/attackPlan';
import { daysUntil, formatShortDate } from '../logic/dates';
import { Icon } from './Icon';

const WEEKDAYS = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'];

function getWeekday(isoDate: string) {
  return WEEKDAYS[new Date(`${isoDate}T00:00:00Z`).getUTCDay()];
}

interface AttackPlanSheetProps {
  task: Task & { dueDate: string };
  today: string;
  currentPlan: PlannedDay[] | undefined;
  onConfirm: (days: PlannedDay[]) => void;
  onRemove: () => void;
  onClose: () => void;
}

export function AttackPlanSheet({
  task,
  today,
  currentPlan,
  onConfirm,
  onRemove,
  onClose,
}: AttackPlanSheetProps) {
  const [diveCount, setDiveCount] = useState(() => {
    const plannedDives = currentPlan ? countPlannedDives(currentPlan) : 0;
    return Math.min(MAX_PLAN_DIVES, plannedDives || getDefaultDives(task.priority));
  });

  const plannedDays = distributeDives(diveCount, task.dueDate, today);

  return (
    <div className="sheet-backdrop">
      <section className="sheet" role="dialog" aria-modal="true" aria-label="Plan ataku">
        <header className="sheet-header">
          <h2 className="title sheet-title">Plan ataku</h2>
          <button className="sheet-close" type="button" aria-label="Zamknij" onClick={onClose}>
            <Icon name="close" color="#1E1E1E" size={18} />
          </button>
        </header>

        <div className="plan-target">
          <p className="plan-target-title">{task.title}</p>
          <p className="plan-target-due">
            Termin {formatShortDate(task.dueDate)} (za {daysUntil(task.dueDate, today)} dni)
          </p>
        </div>

        <p className="field-label">Liczba nurkowań (po 25 min)</p>
        <div className="plan-stepper">
          <button
            className="calendar-step"
            type="button"
            aria-label="Mniej nurkowań"
            disabled={diveCount <= MIN_PLAN_DIVES}
            onClick={() => setDiveCount(diveCount - 1)}
          >
            −
          </button>
          <span className="title plan-count" aria-live="polite">
            {diveCount}
          </span>
          <button
            className="calendar-step"
            type="button"
            aria-label="Więcej nurkowań"
            disabled={diveCount >= MAX_PLAN_DIVES}
            onClick={() => setDiveCount(diveCount + 1)}
          >
            +
          </button>
        </div>

        <div className="plan-days">
          {plannedDays.map(({ date, dives }) => (
            <div className="plan-day" key={date}>
              <span className="plan-day-weekday">{getWeekday(date)}</span>
              <span className="plan-day-date">{formatShortDate(date)}</span>
              <span className="plan-day-dots" aria-label={`Nurkowania: ${dives}`}>
                {Array.from({ length: dives }, (_, index) => (
                  <span className="plan-day-dot" key={index} />
                ))}
              </span>
            </div>
          ))}
        </div>

        <div className="field-row sheet-actions">
          {currentPlan && (
            <button className="button button--secondary sheet-action" type="button" onClick={onRemove}>
              Usuń plan
            </button>
          )}
          <button
            className="button sheet-action sheet-action--primary"
            type="button"
            onClick={() => onConfirm(plannedDays.filter(({ dives }) => dives > 0))}
          >
            Zatwierdź plan
          </button>
        </div>
      </section>
    </div>
  );
}
