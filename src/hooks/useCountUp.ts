import { useState, useEffect } from 'react';
import { useLowPowerMode } from './useLowPowerMode';

/**
 * Counts up a number over a duration (default 800ms) with an easeOut curve.
 * Automatically respects prefers-reduced-motion (instant display).
 */
export function useCountUp(target: number, duration: number = 800): number {
  const { prefersReducedMotion } = useLowPowerMode();
  const [value, setValue] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Standard cubic ease-out: 1 - Math.pow(1 - progress, 3)
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * easeOutProgress);
      setValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [target, duration, prefersReducedMotion]);

  return value;
}

