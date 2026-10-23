import React from 'react';

interface BubblesProps {
  variant: 'default' | 'calm' | 'celebrate';
  isLowPower: boolean;
  prefersReducedMotion: boolean;
}

interface BubbleConfig {
  id: number;
  size: number;
  leftPct: number;
  riseDuration: number;
  swayDuration: number;
  delaySec: number;
  borderColor: string;
}

// Seeded, deterministic bubble coordinates to prevent layout jumps and ensure immediate screen coverage
const BUBBLE_SEEDS: BubbleConfig[] = [
  { id: 1, size: 14, leftPct: 12, riseDuration: 16, swayDuration: 4.2, delaySec: -5, borderColor: 'rgba(0, 120, 212, 0.35)' },
  { id: 2, size: 22, leftPct: 28, riseDuration: 22, swayDuration: 5.5, delaySec: -12, borderColor: 'rgba(79, 70, 229, 0.30)' },
  { id: 3, size: 10, leftPct: 45, riseDuration: 14, swayDuration: 3.8, delaySec: -2, borderColor: 'rgba(0, 120, 212, 0.40)' },
  { id: 4, size: 18, leftPct: 62, riseDuration: 19, swayDuration: 4.8, delaySec: -9, borderColor: 'rgba(5, 150, 105, 0.35)' },
  { id: 5, size: 26, leftPct: 78, riseDuration: 24, swayDuration: 5.8, delaySec: -15, borderColor: 'rgba(0, 120, 212, 0.28)' },
  { id: 6, size: 12, leftPct: 88, riseDuration: 15, swayDuration: 3.6, delaySec: -7, borderColor: 'rgba(217, 119, 6, 0.35)' },
  { id: 7, size: 16, leftPct: 20, riseDuration: 18, swayDuration: 4.5, delaySec: -11, borderColor: 'rgba(0, 120, 212, 0.30)' },
  { id: 8, size: 20, leftPct: 70, riseDuration: 21, swayDuration: 5.0, delaySec: -4, borderColor: 'rgba(79, 70, 229, 0.32)' },
];

/**
 * Glossy translucent bubbles rising with horizontal sway.
 * Features a soft radial specular highlight, thin translucent border,
 * and staggered negative delays so the viewport is populated on page load.
 */
export const Bubbles: React.FC<BubblesProps> = ({
  variant,
  isLowPower,
  prefersReducedMotion,
}) => {
  if (prefersReducedMotion) return null;

  // Filter bubble count based on mode
  let bubblesToRender = BUBBLE_SEEDS;
  if (variant === 'calm') {
    bubblesToRender = BUBBLE_SEEDS.slice(0, 2);
  } else if (isLowPower) {
    bubblesToRender = BUBBLE_SEEDS.slice(0, 4);
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bubblesToRender.map(b => (
        <div
          key={b.id}
          className="absolute bottom-[-40px] animate-bubble-rise"
          style={{
            left: `${b.leftPct}%`,
            animationDuration: `${b.riseDuration}s`,
            animationDelay: `${b.delaySec}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        >
          <div
            className="rounded-full animate-bubble-sway"
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDuration: `${b.swayDuration}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
              border: `1.5px solid ${b.borderColor}`,
              background:
                'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.25) 45%, rgba(0, 120, 212, 0.18) 80%)',
              boxShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.8), 0 2px 6px rgba(15, 23, 42, 0.08)',
            }}
          />
        </div>
      ))}
    </div>
  );
};

