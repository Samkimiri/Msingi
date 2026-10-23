import { useState, useEffect } from 'react';

export interface PowerModeState {
  isLowPower: boolean;
  prefersReducedMotion: boolean;
  prefersReducedTransparency: boolean;
  prefersHighContrast: boolean;
  isMobileViewport: boolean;
}

/**
 * Detects low-power mode, hardware constraints, and user accessibility preferences:
 * - Viewport < 768px
 * - hardwareConcurrency <= 4
 * - deviceMemory <= 4 (GB)
 * - prefers-reduced-motion
 * - prefers-reduced-transparency
 * - prefers-contrast
 */
export function useLowPowerMode(): PowerModeState {
  const [state, setState] = useState<PowerModeState>(() => {
    if (typeof window === 'undefined') {
      return {
        isLowPower: false,
        prefersReducedMotion: false,
        prefersReducedTransparency: false,
        prefersHighContrast: false,
        isMobileViewport: false,
      };
    }

    const isMobile = window.innerWidth < 768;
    const lowCores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
    const lowMemory = typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? (navigator as any).deviceMemory <= 4 : false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reducedTrans = window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
    const highContrast = window.matchMedia('(prefers-contrast: more)').matches;

    return {
      isLowPower: isMobile || lowCores || lowMemory,
      prefersReducedMotion: reducedMotion,
      prefersReducedTransparency: reducedTrans,
      prefersHighContrast: highContrast,
      isMobileViewport: isMobile,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const transQuery = window.matchMedia('(prefers-reduced-transparency: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');

    const updateState = () => {
      const isMobile = window.innerWidth < 768;
      const lowCores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
      const lowMemory = typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? (navigator as any).deviceMemory <= 4 : false;

      setState({
        isLowPower: isMobile || lowCores || lowMemory,
        prefersReducedMotion: motionQuery.matches,
        prefersReducedTransparency: transQuery.matches,
        prefersHighContrast: contrastQuery.matches,
        isMobileViewport: isMobile,
      });
    };

    window.addEventListener('resize', updateState, { passive: true });
    motionQuery.addEventListener('change', updateState);
    transQuery.addEventListener('change', updateState);
    contrastQuery.addEventListener('change', updateState);

    return () => {
      window.removeEventListener('resize', updateState);
      motionQuery.removeEventListener('change', updateState);
      transQuery.removeEventListener('change', updateState);
      contrastQuery.removeEventListener('change', updateState);
    };
  }, []);

  return state;
}

