import { useState } from 'react';
import { AttackPlanSheet } from './components/AttackPlanSheet';
import { BottomNav, type Tab } from './components/BottomNav';
import { PhoneFrame } from './components/PhoneFrame';
import { TaskSheet } from './components/TaskSheet';
import type { Task, TaskDraft } from './data/task';
import { useAttackPlans } from './hooks/useAttackPlans';
import { useTasks } from './hooks/useTasks';
import { getTodayIso } from './logic/dates';
import { getAvailableTags } from './logic/filterTasks';
import { FileScreen } from './screens/FileScreen';
import { MissionsScreen } from './screens/MissionsScreen';
import { TodayScreen } from './screens/TodayScreen';

type TaskEditor = { task: Task | null; initialDueDate: string | null } | null;
type PlannedTask = Task & { dueDate: string };

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
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [editor, setEditor] = useState<TaskEditor>(null);
  const [plannedTask, setPlannedTask] = useState<PlannedTask | null>(null);

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

  const handleDelete = (id: number) => {
    deleteTask(id);
    removePlan(id);
    setEditor(null);
  };

  const handleReschedule = (id: number, dueDate: string) => {
    rescheduleTask(id, dueDate);
    removePlan(id);
  };

  const handleImport = (importedTasks: Task[]) => {
    replaceTasks(importedTasks);
    clearPlans();
  };

  return (
    <PhoneFrame>
      {activeTab === 'today' && (
        <TodayScreen
          tasks={tasks}
          plans={plans}
          isLoading={isLoading}
          onComplete={toggleTask}
          onReschedule={handleReschedule}
        />
      )}
      {activeTab === 'missions' && (
        <MissionsScreen
          tasks={tasks}
          plans={plans}
          isLoading={isLoading}
          onToggle={toggleTask}
          onOpen={(task) => setEditor({ task, initialDueDate: null })}
          onAdd={(initialDueDate) => setEditor({ task: null, initialDueDate })}
        />
      )}
      {activeTab === 'file' && (
        <FileScreen tasks={tasks} isLoading={isLoading} onImport={handleImport} />
      )}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      {editor && (
        <TaskSheet
          key={editor.task?.id ?? 'new'}
          task={editor.task}
          initialDueDate={editor.initialDueDate}
          availableTags={getAvailableTags(tasks)}
          onSave={handleSave}
          onPlan={handlePlan}
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
