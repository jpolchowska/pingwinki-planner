import { IceFloe } from '../components/IceFloe';
import { Penguin } from '../components/Penguin';
import type { Task } from '../data/task';
import { formatFullDate, getDueLabel, getTodayIso } from '../logic/dates';
import { getMissionReason, pickTodayMissions } from '../logic/todayMissions';

interface TodayScreenProps {
  tasks: Task[];
  isLoading: boolean;
  onComplete: (id: number) => void;
}

function MissionDeadline({ task, today }: { task: Task; today: string }) {
  return (
    <div className="today-deadline">
      <IceFloe dueDate={task.dueDate} today={today} />
      <span>{getDueLabel(task.dueDate, today)}</span>
    </div>
  );
}

export function TodayScreen({ tasks, isLoading, onComplete }: TodayScreenProps) {
  const today = getTodayIso();
  const [mainMission, ...sideMissions] = pickTodayMissions(tasks, today);

  return (
    <main className="screen">
      <header className="today-hero">
        <div className="today-hero-text">
          <h1 className="title today-title">Dzisiejsza misja</h1>
          <p className="today-date">{formatFullDate(today)}</p>
        </div>
        <Penguin pose={mainMission ? 'ready' : 'sleepy'} pixelSize={4} />
      </header>

      {isLoading && <p className="screen-note">Wczytuję misje…</p>}

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
          <button className="button today-done" type="button" onClick={() => onComplete(mainMission.id)}>
            Zrobione
          </button>
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
            </article>
          ))}
        </section>
      )}

      {!isLoading && !mainMission && (
        <div className="empty-state">
          <p className="title empty-state-title">Pingwin czeka na kolejną misję</p>
          <p className="screen-note">Dodaj nową w zakładce Misje.</p>
        </div>
      )}
    </main>
  );
}
