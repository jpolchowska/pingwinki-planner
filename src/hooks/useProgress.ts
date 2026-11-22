import { useEffect, useState } from 'react';
import { loadStoredProgress, storeProgress } from '../data/progressStorage';
import {
  addCompletedDive,
  addGoldenFish,
  forgetAllTasks,
  forgetTask,
  type Progress,
} from '../logic/progress';

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadStoredProgress);

  useEffect(() => {
    storeProgress(progress);
  }, [progress]);

  return {
    progress,
    recordDive: (taskId: number, date: string) =>
      setProgress((current) => addCompletedDive(current, taskId, date)),
    rewardMission: (taskId: number) => setProgress((current) => addGoldenFish(current, taskId)),
    forgetMission: (taskId: number) => setProgress((current) => forgetTask(current, taskId)),
    forgetAllMissions: () => setProgress(forgetAllTasks),
  };
}
