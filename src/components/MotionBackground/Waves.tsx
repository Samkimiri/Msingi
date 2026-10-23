import React from 'react';

interface WavesProps {
  variant: 'default' | 'calm' | 'celebrate';
  isLowPower: boolean;
  prefersReducedMotion: boolean;
}

/**
 * 3 full-width bottom SVG waves scrolling sideways seamlessly.
 * Wave 1: 12s (Azure Blue #0078d4, opacity ~0.22)
 * Wave 2: 20s reversed (Dusk Indigo #4f46e5, opacity ~0.18)
 * Wave 3: 30s (Savannah Green #059669, opacity ~0.14)
 * Calm variant scales duration by 1.6x. Low-power renders 2 waves.
 * Pure CSS keyframes for zero main-thread overhead.
 */
export const Waves: React.FC<WavesProps> = ({
  variant,
  isLowPower,
  prefersReducedMotion,
}) => {
  const isCalm = variant === 'calm';
  const speedClass1 = prefersReducedMotion ? '' : isCalm ? 'animate-wave-slow-1' : 'animate-wave-1';
  const speedClass2 = prefersReducedMotion ? '' : isCalm ? 'animate-wave-slow-2' : 'animate-wave-2';
  const speedClass3 = prefersReducedMotion ? '' : isCalm ? 'animate-wave-slow-3' : 'animate-wave-3';

  return (
    <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 pointer-events-none overflow-hidden">
      {/* Wave 3: Back Wave (Savannah Green #059669) - omitted in low-power */}
      {!isLowPower && (
        <div className={`absolute bottom-0 left-0 w-[200%] h-full opacity-[0.14] ${speedClass3}`}>
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,90 350,-40 500,50 C650,140 900,-20 1200,40 L1200,120 L0,120 Z"
              fill="#059669"
            />
          </svg>
        </div>
      )}

      {/* Wave 2: Mid Wave (Dusk Indigo #4f46e5) - scrolls in reverse */}
      <div className={`absolute bottom-0 left-0 w-[200%] h-full opacity-[0.18] ${speedClass2}`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C200,-30 450,90 700,20 C950,-50 1050,70 1200,10 L1200,120 L0,120 Z"
            fill="#4f46e5"
          />
        </svg>
      </div>

      {/* Wave 1: Front Wave (Azure Brand Blue #0078d4) */}
      <div className={`absolute bottom-0 left-0 w-[200%] h-full opacity-[0.22] ${speedClass1}`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C300,80 600,-20 900,40 C1050,70 1150,10 1200,30 L1200,120 L0,120 Z"
            fill="#0078d4"
          />
        </svg>
      </div>
    </div>
  );
};

