import { useState } from 'react';
import { AttackPlanSheet } from './components/AttackPlanSheet';
import { BottomNav, type Tab } from './components/BottomNav';
import { FishCounter } from './components/FishCounter';
import { PhoneFrame } from './components/PhoneFrame';
import { TaskSheet } from './components/TaskSheet';
import type { Task, TaskDraft } from './data/task';
import { useAttackPlans } from './hooks/useAttackPlans';
import { useProgress } from './hooks/useProgress';
import { useTasks } from './hooks/useTasks';
import { getTodayIso } from './logic/dates';
import { getAvailableTags } from './logic/filterTasks';
import { canEarnGoldenFish, DIVE_SECONDS, getBreakSeconds } from './logic/progress';
import { DiveResultScreen, type DiveReward } from './screens/DiveResultScreen';
import { DiveScreen } from './screens/DiveScreen';
import { FileScreen } from './screens/FileScreen';
import { MissionsScreen } from './screens/MissionsScreen';
import { TodayScreen } from './screens/TodayScreen';

type TaskEditor = { task: Task | null; initialDueDate: string | null } | null;
type PlannedTask = Task & { dueDate: string };
type FocusSession =
  | { screen: 'dive'; task: Task }
  | { screen: 'break'; seconds: number }
  | { screen: 'result'; reward: DiveReward; breakSeconds: number | null }
  | null;

export function App() {
  const {
    tasks,
    isLoading,
    replaceTasks,
    toggleTask,
    addTask,
    updateTask,
    rescheduleTask,
    deleteTask,
  } = useTasks();
  const { plans, savePlan, removePlan, clearPlans } = useAttackPlans();
  const { progress, recordDive, rewardMission, forgetMission, forgetAllMissions } = useProgress();
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [editor, setEditor] = useState<TaskEditor>(null);
  const [plannedTask, setPlannedTask] = useState<PlannedTask | null>(null);
  const [session, setSession] = useState<FocusSession>(null);

  const saveEditedTask = (task: Task, draft: TaskDraft) => {
    if (draft.dueDate !== task.dueDate) removePlan(task.id);
    updateTask(task.id, draft);
  };

  const handleSave = (draft: TaskDraft) => {
    if (editor?.task) saveEditedTask(editor.task, draft);
    else addTask(draft);
    setEditor(null);
  };

  const handlePlan = (draft: TaskDraft) => {
    if (!editor?.task || draft.dueDate === null) return;

    saveEditedTask(editor.task, draft);
    setPlannedTask({ ...editor.task, ...draft, dueDate: draft.dueDate });
    setEditor(null);
  };

  const handleSheetDive = (draft: TaskDraft) => {
    if (!editor?.task) return;

    saveEditedTask(editor.task, draft);
    setSession({ screen: 'dive', task: { ...editor.task, ...draft } });
    setEditor(null);
  };

  const handleDelete = (id: number) => {
    deleteTask(id);
    removePlan(id);
    forgetMission(id);
    setEditor(null);
  };

  const handleReschedule = (id: number, dueDate: string) => {
    rescheduleTask(id, dueDate);
    removePlan(id);
  };

  const handleImport = (importedTasks: Task[]) => {
    replaceTasks(importedTasks);
    clearPlans();
    forgetAllMissions();
  };

  const toggleMission = (id: number) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return false;

    const earnsGoldenFish = !task.done && canEarnGoldenFish(progress, task);
    toggleTask(id);
    if (earnsGoldenFish) rewardMission(id);
    return earnsGoldenFish;
  };

  const handleTodayComplete = (id: number) => {
    if (toggleMission(id)) setSession({ screen: 'result', reward: 'golden', breakSeconds: null });
  };

  const handleDiveFinish = (task: Task) => {
    const today = getTodayIso();
    const divesToday = (progress.divesByDate[today] ?? 0) + 1;

    recordDive(task.id, today);
    setSession({ screen: 'result', reward: 'fish', breakSeconds: getBreakSeconds(divesToday) });
  };

  return (
    <PhoneFrame>
      <FishCounter fish={progress.fish} />

      {session?.screen === 'dive' && (
        <DiveScreen
          key="dive"
          mode="dive"
          title={session.task.title}
          seconds={DIVE_SECONDS}
          onFinish={() => handleDiveFinish(session.task)}
          onExit={() => setSession({ screen: 'result', reward: 'none', breakSeconds: null })}
        />
      )}
      {session?.screen === 'break' && (
        <DiveScreen
          key="break"
          mode="break"
          title="Odpocznij chwilę"
          seconds={session.seconds}
          onFinish={() => setSession(null)}
          onExit={() => setSession(null)}
        />
      )}
      {session?.screen === 'result' && (
        <DiveResultScreen
          reward={session.reward}
          breakSeconds={session.breakSeconds}
          onBreak={() => {
            if (session.breakSeconds !== null) {
              setSession({ screen: 'break', seconds: session.breakSeconds });
            }
          }}
          onBack={() => setSession(null)}
        />
      )}

      {!session && activeTab === 'today' && (
        <TodayScreen
          tasks={tasks}
          plans={plans}
          taskDives={progress.taskDives}
          isLoading={isLoading}
          onDive={(task) => setSession({ screen: 'dive', task })}
          onComplete={handleTodayComplete}
          onReschedule={handleReschedule}
        />
      )}
      {!session && activeTab === 'missions' && (
        <MissionsScreen
          tasks={tasks}
          plans={plans}
          isLoading={isLoading}
          onToggle={toggleMission}
          onOpen={(task) => setEditor({ task, initialDueDate: null })}
          onAdd={(initialDueDate) => setEditor({ task: null, initialDueDate })}
        />
      )}
      {!session && activeTab === 'file' && (
        <FileScreen tasks={tasks} isLoading={isLoading} onImport={handleImport} />
      )}
      {!session && <BottomNav activeTab={activeTab} onChange={setActiveTab} />}

      {editor && (
        <TaskSheet
          key={editor.task?.id ?? 'new'}
          task={editor.task}
          initialDueDate={editor.initialDueDate}
          availableTags={getAvailableTags(tasks)}
          onSave={handleSave}
          onPlan={handlePlan}
          onDive={handleSheetDive}
          onDelete={handleDelete}
          onClose={() => setEditor(null)}
        />
      )}
      {plannedTask && (
        <AttackPlanSheet
          key={plannedTask.id}
          task={plannedTask}
          today={getTodayIso()}
          currentPlan={plans[plannedTask.id]}
          onConfirm={(days) => {
            savePlan(plannedTask.id, days);
            setPlannedTask(null);
          }}
          onRemove={() => {
            removePlan(plannedTask.id);
            setPlannedTask(null);
          }}
          onClose={() => setPlannedTask(null)}
        />
      )}
    </PhoneFrame>
  );
}
