import { useEffect, useState } from 'react';
import { createTask, type Task, type TaskDraft } from '../data/task';
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

  const toggleTask = (id: number) => {
    setTasks(
      (current) =>
        current?.map((task) => (task.id === id ? { ...task, done: !task.done } : task)) ?? null,
    );
  };

  const addTask = (draft: TaskDraft) => {
    setTasks((current) => {
      const list = current ?? [];
      return [...list, createTask(list, draft)];
    });
  };

  const updateTask = (id: number, draft: TaskDraft) => {
    setTasks(
      (current) => current?.map((task) => (task.id === id ? { ...task, ...draft } : task)) ?? null,
    );
  };

  const rescheduleTask = (id: number, dueDate: string) => {
    setTasks(
      (current) => current?.map((task) => (task.id === id ? { ...task, dueDate } : task)) ?? null,
    );
  };

  const deleteTask = (id: number) => {
    setTasks((current) => current?.filter((task) => task.id !== id) ?? null);
  };

  return {
    tasks: tasks ?? [],
    isLoading: tasks === null,
    replaceTasks: setTasks,
    toggleTask,
    addTask,
    updateTask,
    rescheduleTask,
    deleteTask,
  };
}
