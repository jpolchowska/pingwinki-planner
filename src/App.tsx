import { useState } from 'react';
import { BottomNav, type Tab } from './components/BottomNav';
import { PhoneFrame } from './components/PhoneFrame';
import { useTasks } from './hooks/useTasks';
import { FileScreen } from './screens/FileScreen';
import { MissionsScreen } from './screens/MissionsScreen';

export function App() {
  const { tasks, isLoading, replaceTasks, toggleTask } = useTasks();
  const [activeTab, setActiveTab] = useState<Tab>('missions');

  return (
    <PhoneFrame>
      {activeTab === 'missions' && (
        <MissionsScreen tasks={tasks} isLoading={isLoading} onToggle={toggleTask} />
      )}
      {activeTab === 'file' && (
        <FileScreen tasks={tasks} isLoading={isLoading} onImport={replaceTasks} />
      )}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </PhoneFrame>
  );
}
