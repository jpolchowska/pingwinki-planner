import { IceFloe } from '../components/IceFloe';
import { Penguin } from '../components/Penguin';
import type { Task } from '../data/task';
import {
  countPlannedDives,
  DAILY_DIVE_LIMIT,
  getPlannedDivesOn,
  type AttackPlans,
} from '../logic/attackPlan';
import {
  addDays,
  formatFullDate,
  getDueLabel,
  getNextWeekendDate,
  getTodayIso,
} from '../logic/dates';
import { getBuildWeek } from '../logic/iglooBuild';
import { getOverloadWarning } from '../logic/overload';
import type { Progress } from '../logic/progress';
import { getOverdueTasks } from '../logic/rescue';
import { getMissionReason, pickTodayMissions } from '../logic/todayMissions';

const VISIBLE_RESCUE_LIMIT = 3;

interface TodayScreenProps {
  tasks: Task[];
  plans: AttackPlans;
  taskDives: Progress['taskDives'];
  divesByDate: Progress['divesByDate'];
  isLoading: boolean;
  onDive: (task: Task) => void;
  onComplete: (id: number) => void;
  onReschedule: (id: number, dueDate: string) => void;
}

function MissionDeadline({ task, today }: { task: Task; today: string }) {
  return (
    <div className="today-deadline">
      <IceFloe dueDate={task.dueDate} today={today} />
      <span>{getDueLabel(task.dueDate, today)}</span>
    </div>
  );
}

export function TodayScreen({
  tasks,
  plans,
  taskDives,
  divesByDate,
  isLoading,
  onDive,
  onComplete,
  onReschedule,
}: TodayScreenProps) {
  const today = getTodayIso();
  const [mainMission, ...sideMissions] = pickTodayMissions(tasks, today);
  const overdueTasks = getOverdueTasks(tasks, today);
  const visibleOverdueTasks = overdueTasks.slice(0, VISIBLE_RESCUE_LIMIT);
  const hiddenOverdueCount = overdueTasks.length - visibleOverdueTasks.length;
  const overloadWarning = getOverloadWarning(tasks, today);
  const plannedDives = getPlannedDivesOn(plans, tasks, today);
  const plannedDiveCount = countPlannedDives(plannedDives);
  const buildWeek = getBuildWeek(divesByDate, today);
  const builtDays = buildWeek.filter(({ isBuilt }) => isBuilt).length;

  return (
    <main className="screen">
      <header className="today-hero">
        <div className="today-hero-text">
          <h1 className="title today-title">Dzisiejsza misja</h1>
          <p className="today-date">{formatFullDate(today)}</p>
          <div
            className="today-build"
            role="img"
            aria-label={`Budowa igloo: ${builtDays} z ${buildWeek.length} dni w tym tygodniu`}
          >
            {buildWeek.map(({ date, isBuilt }) => (
              <span
                className={`build-block build-block--mini${isBuilt ? ' build-block--placed' : ''}`}
                key={date}
              />
            ))}
          </div>
        </div>
        <Penguin pose={mainMission ? 'ready' : 'sleepy'} pixelSize={4} />
      </header>

      {isLoading && <p className="screen-note">Wczytuję misje…</p>}

      {overloadWarning && (
        <p className="today-warning" role="status">
          {overloadWarning}
        </p>
      )}

      {visibleOverdueTasks.length > 0 && (
        <section aria-label="Akcja ratunkowa">
          <h2 className="title today-section-title">Akcja ratunkowa</h2>
          {visibleOverdueTasks.map((task) => (
            <article className="card card--peach today-side" key={task.id}>
              <h3 className="today-side-title">{task.title}</h3>
              <div className="card-divider" />
              <MissionDeadline task={task} today={today} />
              <div className="field-row today-rescue-actions">
                <button
                  className="button button--secondary sheet-action today-rescue-button"
                  type="button"
                  onClick={() => onReschedule(task.id, addDays(today, 1))}
                >
                  Na jutro
                </button>
                <button
                  className="button button--secondary sheet-action today-rescue-button"
                  type="button"
                  onClick={() => onReschedule(task.id, getNextWeekendDate(today))}
                >
                  Na weekend
                </button>
              </div>
            </article>
          ))}
          {hiddenOverdueCount > 0 && (
            <p className="screen-note">Pozostałe zaległości w zakładce Misje: {hiddenOverdueCount}</p>
          )}
        </section>
      )}

      {mainMission && (
        <section className="card today-main" aria-label="Misja główna">
          <p className="today-label">Misja główna</p>
          <h2 className="today-main-title">{mainMission.title}</h2>
          <div className="card-divider" />
          <MissionDeadline task={mainMission} today={today} />
          <p className="today-reason">
            <span className="today-label">Dlaczego</span>
            {getMissionReason(mainMission, today)}
          </p>
          <div className="field-row today-main-actions">
            <button className="button sheet-action" type="button" onClick={() => onDive(mainMission)}>
              Nurkuj
            </button>
            <button
              className="button button--secondary sheet-action"
              type="button"
              onClick={() => onComplete(mainMission.id)}
            >
              Zrobione
            </button>
          </div>
        </section>
      )}

      {plannedDives.length > 0 && (
        <section className="plan-bar" aria-label="Nurkowania na dziś">
          <div className="plan-bar-header">
            <p className="plan-bar-title">
              Zaplanowane nurkowania: {plannedDiveCount} z {DAILY_DIVE_LIMIT}
            </p>
            <span className="plan-bar-dots" aria-hidden="true">
              {Array.from({ length: DAILY_DIVE_LIMIT }, (_, index) => (
                <span
                  className={`plan-bar-dot${index < plannedDiveCount ? ' plan-bar-dot--filled' : ''}`}
                  key={index}
                />
              ))}
            </span>
          </div>
          <ul className="plan-list">
            {plannedDives.map(({ task, dives }) => (
              <li key={task.id}>
                {task.title}: {taskDives[task.id]?.[today] ?? 0} z {dives}
              </li>
            ))}
          </ul>
          {plannedDiveCount > DAILY_DIVE_LIMIT && (
            <p className="plan-bar-warning" role="status">
              To dużo jak na jeden dzień. Przesuń część nurkowań.
            </p>
          )}
        </section>
      )}

      {sideMissions.length > 0 && (
        <section aria-label="Misje poboczne">
          <h2 className="title today-section-title">Misje poboczne</h2>
          {sideMissions.map((task) => (
            <article className="card card--peach today-side" key={task.id}>
              <h3 className="today-side-title">{task.title}</h3>
              <div className="card-divider" />
              <MissionDeadline task={task} today={today} />
              <p className="today-side-reason">{getMissionReason(task, today)}</p>
              <button className="button today-side-dive" type="button" onClick={() => onDive(task)}>
                Nurkuj
              </button>
            </article>
          ))}
        </section>
      )}

      {!isLoading && !mainMission && overdueTasks.length === 0 && (
        <div className="empty-state">
          <p className="title empty-state-title">Pingwin czeka na kolejną misję</p>
          <p className="screen-note">Dodaj nową w zakładce Misje.</p>
        </div>
      )}
    </main>
  );
}
