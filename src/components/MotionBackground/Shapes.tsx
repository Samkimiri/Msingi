import React from 'react';
import { motion } from 'framer-motion';

interface ShapesProps {
  variant: 'default' | 'calm' | 'celebrate';
  isLowPower: boolean;
  prefersReducedMotion: boolean;
}

/**
 * 4-5 subtle geometric shapes:
 * - Diamond with inner diamond (Azure #0078d4)
 * - Dashed ring with central dot (Dusk #4f46e5)
 * - Equilateral triangle (Savannah #059669)
 * - Plus sign (Amber #d97706)
 * Uses nested wrappers so translation and continuous rotation never conflict or cause jitter.
 * Calm variant hides shapes to minimize cognitive load during quizzes.
 */
export const Shapes: React.FC<ShapesProps> = ({
  variant,
  isLowPower,
  prefersReducedMotion,
}) => {
  // Calm variant omits floating shapes completely
  if (variant === 'calm') return null;

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[20%] left-[8%] text-[#0078d4]">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="12,6 18,12 12,18 6,12" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute top-[60%] right-[10%] text-[#4f46e5]">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
      {/* Shape 1: Diamond with Inner Diamond (Azure Blue) */}
      <motion.div
        className="absolute top-[18%] left-[6%]"
        animate={{
          x: [0, 24, -18, 0],
          y: [0, -32, 16, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          className="text-[#0078d4]"
        >
          <svg width="28" height="28" viewBox="0 0 24 24">
            <polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="12,6 18,12 12,18 6,12" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Shape 2: Dashed Ring with Dot (Dusk Indigo) */}
      <motion.div
        className="absolute top-[52%] right-[8%]"
        animate={{
          x: [0, -28, 14, 0],
          y: [0, 36, -20, 0],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
          className="text-[#4f46e5]"
        >
          <svg width="26" height="26" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Shape 3: Geometric Triangle (Savannah Green) */}
      <motion.div
        className="absolute top-[75%] left-[18%]"
        animate={{
          x: [0, 30, -15, 0],
          y: [0, -25, 20, 0],
        }}
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="text-[#059669]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="12,3 22,21 2,21" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Shape 4: Plus Sign (Amber Accent) - omitted in low-power */}
      {!isLowPower && (
        <motion.div
          className="absolute top-[32%] right-[22%]"
          animate={{
            x: [0, -20, 25, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
            className="text-[#d97706]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M12 4v16m-8-8h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* Celebration bursts (variant === 'celebrate') */}
      {variant === 'celebrate' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: [0, 0.9, 0.4], scale: [0.5, 1.2, 1], y: -40 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute top-[25%] left-[45%] text-[#0078d4]"
        >
          <svg width="32" height="32" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </motion.div>
      )}
    </div>
  );
};

