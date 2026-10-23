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
          className="absolute -top-[10%] -left-[10%] w-[380px] h-[380px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 120, 212, 0.22) 0%, rgba(0, 120, 212, 0) 70%)',
            filter: 'blur(35px)',
          }}
        />
        <div
          className="absolute top-[40%] -right-[10%] w-[320px] h-[320px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.18) 0%, rgba(79, 70, 229, 0) 70%)',
            filter: 'blur(35px)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Glow 1: Azure Brand Blue (#0078d4) */}
      <motion.div
        className="absolute -top-[12%] -left-[10%] w-[380px] h-[380px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(0, 120, 212, 0.24) 0%, rgba(0, 120, 212, 0) 70%)',
          filter: isLowPower ? 'blur(24px)' : 'blur(40px)',
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
        className="absolute top-[35%] -right-[12%] w-[350px] h-[350px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.20) 0%, rgba(79, 70, 229, 0) 70%)',
          filter: isLowPower ? 'blur(24px)' : 'blur(38px)',
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
          className="absolute top-[65%] -left-[15%] w-[320px] h-[320px] rounded-full will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(5, 150, 105, 0.16) 0%, rgba(5, 150, 105, 0) 70%)',
            filter: 'blur(36px)',
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
      {showExtraGlows && variant === 'celebrate' && (
        <motion.div
          className="absolute top-[18%] left-[40%] w-[300px] h-[300px] rounded-full will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(217, 119, 6, 0.18) 0%, rgba(217, 119, 6, 0) 70%)',
            filter: 'blur(35px)',
          }}
          animate={{
            x: [0, 25, -25, 0],
            y: [0, 20, -20, 0],
            scale: [1, 1.12, 0.92, 1],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      )}
    </div>
  );
};

