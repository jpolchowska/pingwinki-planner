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

type EditedTask = Task | 'new' | null;

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
  const [editedTask, setEditedTask] = useState<EditedTask>(null);

  const handleSave = (draft: TaskDraft) => {
    if (editedTask === 'new') addTask(draft);
    else if (editedTask) updateTask(editedTask.id, draft);
    setEditedTask(null);
  };

  const handleDelete = (id: number) => {
    deleteTask(id);
    setEditedTask(null);
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
          onOpen={setEditedTask}
          onAdd={() => setEditedTask('new')}
        />
      )}
      {activeTab === 'file' && (
        <FileScreen tasks={tasks} isLoading={isLoading} onImport={replaceTasks} />
      )}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      {editedTask && (
        <TaskSheet
          key={editedTask === 'new' ? 'new' : editedTask.id}
          task={editedTask === 'new' ? null : editedTask}
          availableTags={getAvailableTags(tasks)}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditedTask(null)}
        />
      )}
    </PhoneFrame>
  );
}
