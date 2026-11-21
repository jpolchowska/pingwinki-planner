import { PhoneFrame } from './components/PhoneFrame';
import { useTasks } from './hooks/useTasks';
import { FileScreen } from './screens/FileScreen';

export function App() {
  const { tasks, isLoading, replaceTasks } = useTasks();

  return (
    <PhoneFrame>
      <FileScreen tasks={tasks} isLoading={isLoading} onImport={replaceTasks} />
    </PhoneFrame>
  );
}
