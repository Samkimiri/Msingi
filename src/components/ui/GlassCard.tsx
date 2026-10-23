import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cardEntranceVariants, cardInteractiveVariants } from '../../lib/motion';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'subtle';
  interactive?: boolean;
  staggerItem?: boolean;
}

/**
 * Zero-extra-DOM GlassCard wrapper.
 * Replaces or wraps existing card surfaces with pure glassmorphism styles,
 * preserving existing border-radius, layout, and sizing with zero layout shift.
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className = '',
      variant = 'default',
      interactive = false,
      staggerItem = false,
      ...motionProps
    },
    ref
  ) => {
    const variantClass =
      variant === 'strong'
        ? 'glass-strong'
        : variant === 'subtle'
        ? 'glass-subtle'
        : 'glass';

    return (
      <motion.div
        ref={ref}
        variants={staggerItem ? cardEntranceVariants : interactive ? cardInteractiveVariants : undefined}
        initial={staggerItem ? 'hidden' : undefined}
        animate={staggerItem ? 'visible' : undefined}
        whileHover={interactive ? 'hover' : undefined}
        whileTap={interactive ? 'tap' : undefined}
        className={`${variantClass} ${className}`}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

