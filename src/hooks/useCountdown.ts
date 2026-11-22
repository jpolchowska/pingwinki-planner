import { useEffect, useRef, useState } from 'react';

const TICK_MS = 250;

export function useCountdown(seconds: number, onComplete: () => void) {
  const [remainingMs, setRemainingMs] = useState(seconds * 1000);
  const [isRunning, setIsRunning] = useState(true);
  const remainingRef = useRef(seconds * 1000);
  const isCompleteRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const complete = () => {
    if (isCompleteRef.current) return;
    isCompleteRef.current = true;
    onCompleteRef.current();
  };

  useEffect(() => {
    if (!isRunning) return;

    const endsAt = Date.now() + remainingRef.current;
    const intervalId = setInterval(() => {
      const left = Math.max(0, endsAt - Date.now());
      remainingRef.current = left;
      setRemainingMs(left);
      if (left === 0) complete();
    }, TICK_MS);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  return {
    remainingSeconds: Math.ceil(remainingMs / 1000),
    isRunning,
    toggleRunning: () => setIsRunning((current) => !current),
    skipToEnd: complete,
  };
}
