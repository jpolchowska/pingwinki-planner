import { useEffect, useState } from 'react';
import { loadStoredPlans, storePlans } from '../data/planStorage';
import type { AttackPlans, PlannedDay } from '../logic/attackPlan';

export function useAttackPlans() {
  const [plans, setPlans] = useState<AttackPlans>(loadStoredPlans);

  useEffect(() => {
    storePlans(plans);
  }, [plans]);

  const savePlan = (taskId: number, days: PlannedDay[]) => {
    setPlans((current) => ({ ...current, [taskId]: days }));
  };

  const removePlan = (taskId: number) => {
    setPlans((current) => {
      const { [taskId]: _removed, ...remaining } = current;
      return remaining;
    });
  };

  const clearPlans = () => setPlans({});

  return { plans, savePlan, removePlan, clearPlans };
}
