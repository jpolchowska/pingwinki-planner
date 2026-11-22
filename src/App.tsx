import { useState } from 'react';
import { BottomNav, type Tab } from './components/BottomNav';
import { PhoneFrame } from './components/PhoneFrame';
import { TaskSheet } from './components/TaskSheet';
import type { Task, TaskDraft } from './data/task';
import { useTasks } from './hooks/useTasks';
import { getAvailableTags } from './logic/filterTasks';
import { FileScreen } from './screens/FileScreen';
import { MissionsScreen } from './screens/MissionsScreen';
import { TodayScreen } from './screens/TodayScreen';

type TaskEditor = { task: Task | null; initialDueDate: string | null } | null;

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
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [editor, setEditor] = useState<TaskEditor>(null);

  const handleSave = (draft: TaskDraft) => {
    if (editor?.task) updateTask(editor.task.id, draft);
    else addTask(draft);
    setEditor(null);
  };

  const handleDelete = (id: number) => {
    deleteTask(id);
    setEditor(null);
  };

  return (
    <PhoneFrame>
      {activeTab === 'today' && (
        <TodayScreen
          tasks={tasks}
          isLoading={isLoading}
          onComplete={toggleTask}
          onReschedule={rescheduleTask}
        />
      )}
      {activeTab === 'missions' && (
        <MissionsScreen
          tasks={tasks}
          isLoading={isLoading}
          onToggle={toggleTask}
          onOpen={(task) => setEditor({ task, initialDueDate: null })}
          onAdd={(initialDueDate) => setEditor({ task: null, initialDueDate })}
        />
      )}
      {activeTab === 'file' && (
        <FileScreen tasks={tasks} isLoading={isLoading} onImport={replaceTasks} />
      )}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      {editor && (
        <TaskSheet
          key={editor.task?.id ?? 'new'}
          task={editor.task}
          initialDueDate={editor.initialDueDate}
          availableTags={getAvailableTags(tasks)}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditor(null)}
        />
      )}
    </PhoneFrame>
  );
}
