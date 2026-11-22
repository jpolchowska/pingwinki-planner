import { useMemo, useState } from 'react';
import { BottomNav, type Tab } from './components/BottomNav';
import { FishCounter } from './components/FishCounter';
import { PenguinOutfitContext } from './components/PenguinOutfitContext';
import { PhoneFrame } from './components/PhoneFrame';
import { TaskSheet } from './components/TaskSheet';
import type { Task, TaskDraft } from './data/task';
import { useProgress } from './hooks/useProgress';
import { useTasks } from './hooks/useTasks';
import { getTodayIso } from './logic/dates';
import { getAvailableTags } from './logic/filterTasks';
import { canEarnGoldenFish, DIVE_SECONDS, getBreakSeconds } from './logic/progress';
import { getPenguinOutfit } from './logic/shop';
import { DiveResultScreen, type DiveReward } from './screens/DiveResultScreen';
import { DiveScreen } from './screens/DiveScreen';
import { FileScreen } from './screens/FileScreen';
import { IglooScreen } from './screens/IglooScreen';
import { MissionsScreen } from './screens/MissionsScreen';
import { TodayScreen } from './screens/TodayScreen';

type TaskEditor = { task: Task | null; initialDueDate: string | null } | null;
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
  const { progress, recordDive, rewardMission, forgetMission, forgetAllMissions, purchaseItem } =
    useProgress();
  const outfit = useMemo(() => getPenguinOutfit(progress.ownedItems), [progress.ownedItems]);
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [editor, setEditor] = useState<TaskEditor>(null);
  const [session, setSession] = useState<FocusSession>(null);

  const handleSave = (draft: TaskDraft) => {
    if (editor?.task) updateTask(editor.task.id, draft);
    else addTask(draft);
    setEditor(null);
  };

  const handleSheetDive = (draft: TaskDraft) => {
    if (!editor?.task) return;

    updateTask(editor.task.id, draft);
    setSession({ screen: 'dive', task: { ...editor.task, ...draft } });
    setEditor(null);
  };

  const handleDelete = (id: number) => {
    deleteTask(id);
    forgetMission(id);
    setEditor(null);
  };

  const handleImport = (importedTasks: Task[]) => {
    replaceTasks(importedTasks);
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

  const handleDiveFinish = () => {
    const today = getTodayIso();
    const divesToday = (progress.divesByDate[today] ?? 0) + 1;

    recordDive(today);
    setSession({ screen: 'result', reward: 'fish', breakSeconds: getBreakSeconds(divesToday) });
  };

  return (
    <PenguinOutfitContext value={outfit}>
      <PhoneFrame>
        <FishCounter fish={progress.fish} />

        {session?.screen === 'dive' && (
          <DiveScreen
            key="dive"
            mode="dive"
            title={session.task.title}
            seconds={DIVE_SECONDS}
            onFinish={handleDiveFinish}
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
            divesByDate={progress.divesByDate}
            isLoading={isLoading}
            onDive={(task) => setSession({ screen: 'dive', task })}
            onComplete={handleTodayComplete}
            onReschedule={rescheduleTask}
          />
        )}
        {!session && activeTab === 'missions' && (
          <MissionsScreen
            tasks={tasks}
            isLoading={isLoading}
            onToggle={toggleMission}
            onOpen={(task) => setEditor({ task, initialDueDate: null })}
            onAdd={(initialDueDate) => setEditor({ task: null, initialDueDate })}
          />
        )}
        {!session && activeTab === 'igloo' && (
          <IglooScreen progress={progress} onBuy={purchaseItem} />
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
            onDive={handleSheetDive}
            onDelete={handleDelete}
            onClose={() => setEditor(null)}
          />
        )}
      </PhoneFrame>
    </PenguinOutfitContext>
  );
}
