import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageVisibility } from '../../hooks/usePageVisibility';
import { useLowPowerMode } from '../../hooks/useLowPowerMode';
import { Aurora } from './Aurora';
import { Pattern } from './Pattern';
import { Waves } from './Waves';
import { Shapes } from './Shapes';
import { Bubbles } from './Bubbles';

export interface MotionBackgroundProps {
  variant?: 'default' | 'calm' | 'celebrate';
}

/**
 * Single decorative <MotionBackground /> element.
 * Fixed, -z-10, pointer-events-none, aria-hidden="true".
 * Sits directly above the existing base background color without modifying it.
 * Integrates:
 * 1. Aurora Glows (Azure #0078d4, Dusk #4f46e5, Savannah #059669, Amber #d97706)
 * 2. African Textile Geometric Pattern (diamonds, nested diamonds, corner triangles)
 * 3. 3-Layer Seamless Sideways Bottom Waves
 * 4. Geometric Floating Shapes with decoupled rotation/translation
 * 5. Translucent Rising Glass Bubbles with specular highlights
 * Features Page Visibility pause, Low-Power throttling, and 600ms cross-fades.
 */
export const MotionBackground: React.FC<MotionBackgroundProps> = ({
  variant = 'default',
}) => {
  const isTabVisible = usePageVisibility();
  const { isLowPower, prefersReducedMotion } = useLowPowerMode();

  // If the browser tab is hidden in the background, pause rendering to save battery & CPU
  if (!isTabVisible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={variant}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Layer 1: Ambient Drifting Aurora Glows */}
          <Aurora
            variant={variant}
            isLowPower={isLowPower}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* Layer 2: Subtle African Geometric Textile Grid */}
          <Pattern
            variant={variant}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* Layer 3: Bottom Seamless Scrolling Waves */}
          <Waves
            variant={variant}
            isLowPower={isLowPower}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* Layer 4: Geometric Floating Shapes */}
          <Shapes
            variant={variant}
            isLowPower={isLowPower}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* Layer 5: Glossy Translucent Bubbles */}
          <Bubbles
            variant={variant}
            isLowPower={isLowPower}
            prefersReducedMotion={prefersReducedMotion}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

