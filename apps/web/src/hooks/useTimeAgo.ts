import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';

export function useTimeAgo(date: Date): string {
  const [timeAgo, setTimeAgo] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const updateTime = () => {
      setTimeAgo(formatDistanceToNow(date, { addSuffix: true, includeSeconds: true }));
    };

    // Update immediately
    updateTime();

    // Update every second for smooth time progression
    intervalRef.current = setInterval(updateTime, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [date]);

  return timeAgo;
}