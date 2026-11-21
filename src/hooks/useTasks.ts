import { useEffect, useState } from 'react';
import type { Task } from '../data/task';
import { fetchSampleTasks, loadStoredTasks, storeTasks } from '../data/taskStorage';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[] | null>(loadStoredTasks);

  useEffect(() => {
    if (tasks !== null) {
      storeTasks(tasks);
      return;
    }

    let isCancelled = false;
    fetchSampleTasks()
      .catch((error: unknown) => {
        console.error('Could not load sample tasks.', error);
        return [];
      })
      .then((sampleTasks) => {
        if (!isCancelled) setTasks(sampleTasks);
      });

    return () => {
      isCancelled = true;
    };
  }, [tasks]);

  return { tasks: tasks ?? [], isLoading: tasks === null, replaceTasks: setTasks };
}
