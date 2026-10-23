import React from 'react';
import { motion } from 'framer-motion';

interface AuroraProps {
  isLowPower: boolean;
  prefersReducedMotion: boolean;
  variant: 'default' | 'calm' | 'celebrate';
}

/**
 * Aurora Glows: 3-4 large blurred circles in existing brand & accent colors
 * (Azure #0078d4, Savannah #059669, Dusk #4f46e5, Amber #d97706).
 * Drifting with slight scale pulses (11-22s, easeInOut, infinite, out of phase).
 * Uses will-change: transform only for GPU efficiency.
 */
export const Aurora: React.FC<AuroraProps> = ({
  isLowPower,
  prefersReducedMotion,
  variant,
}) => {
  // In calm variant or low-power mode, render 2 glows for optimal battery/framerate
  const showExtraGlows = !isLowPower && variant !== 'calm';

  // Static frame when prefers-reduced-motion is enabled
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[5%] left-[10%] w-[480px] sm:w-[600px] h-[480px] sm:h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 120, 212, 0.26) 0%, rgba(0, 120, 212, 0) 70%)',
            filter: 'blur(45px)',
          }}
        />
        <div
          className="absolute top-[40%] right-[8%] w-[420px] sm:w-[540px] h-[420px] sm:h-[540px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.22) 0%, rgba(79, 70, 229, 0) 70%)',
            filter: 'blur(45px)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Glow 1: Azure Brand Blue (#0078d4) */}
      <motion.div
        className="absolute -top-[6%] left-[2%] sm:left-[12%] w-[440px] sm:w-[580px] h-[440px] sm:h-[580px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(0, 120, 212, 0.28) 0%, rgba(0, 120, 212, 0) 70%)',
          filter: isLowPower ? 'blur(28px)' : 'blur(45px)',
        }}
        animate={{
          x: [0, 45, -25, 0],
          y: [0, 35, 15, 0],
          scale: [1, 1.08, 0.94, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Glow 2: Dusk Indigo (#4f46e5) */}
      <motion.div
        className="absolute top-[28%] right-[2%] sm:right-[10%] w-[400px] sm:w-[540px] h-[400px] sm:h-[540px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.24) 0%, rgba(79, 70, 229, 0) 70%)',
          filter: isLowPower ? 'blur(28px)' : 'blur(42px)',
        }}
        animate={{
          x: [0, -40, 20, 0],
          y: [0, -45, 10, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 21,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Extra Glow 3: Savannah Green (#059669) - shown in default and celebrate */}
      {showExtraGlows && (
        <motion.div
          className="absolute top-[54%] left-[4%] sm:left-[15%] w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(5, 150, 105, 0.20) 0%, rgba(5, 150, 105, 0) 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 35, -20, 0],
            y: [0, -30, 25, 0],
            scale: [1, 1.05, 0.96, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
      )}

      {/* Extra Glow 4: Amber/Sunset Accent (#d97706) - celebration sparkle / warm highlight */}
      {showExtraGlows && (
        <motion.div
          className="absolute top-[72%] right-[5%] sm:right-[18%] w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(217, 119, 6, 0.18) 0%, rgba(217, 119, 6, 0) 70%)',
            filter: 'blur(38px)',
          }}
          animate={{
            x: [0, 25, -25, 0],
            y: [0, 20, -20, 0],
            scale: [1, 1.12, 0.92, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      )}
    </div>
  );
};

