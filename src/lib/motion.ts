import { Transition, Variants } from 'framer-motion';

/**
 * Single typed, centralized configuration object for all glassmorphism & motion parameters.
 * Strictly adheres to the Msingi color palette and performance boundaries.
 */
export const MOTION_CONFIG = {
  // Interaction and entrance durations
  durations: {
    interactionFast: 0.15,
    interactionDefault: 0.2,
    interactionSlow: 0.25,
    entranceFast: 0.4,
    entranceDefault: 0.5,
    entranceSlow: 0.6,
    pageTransition: 0.3,
    numberCountUp: 0.8,
    progressFill: 1.4,
    quizShake: 0.45,
    ctaShimmerInterval: 6.0,
    backgroundCrossfade: 0.6,
  },

  // Stagger delays
  stagger: {
    cards: 0.06, // 60ms apart
    listItems: 0.04,
  },

  // Physics springs
  springs: {
    snappy: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    } as Transition,
    gentle: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    } as Transition,
    bounce: {
      type: 'spring',
      stiffness: 400,
      damping: 18,
    } as Transition,
  },

  // Cubic bezier easing curves
  easings: {
    easeOut: [0.16, 1, 0.3, 1], // Custom snappy easeOut
    easeInOut: [0.4, 0, 0.2, 1],
    smooth: [0.25, 0.1, 0.25, 1],
  },

  // Motion Background specifications
  background: {
    aurora: {
      blurDesktop: '40px',
      blurMobile: '24px',
      opacities: {
        min: 0.12,
        max: 0.30,
      },
      durations: {
        glow1: 14,
        glow2: 18,
        glow3: 22,
        glow4: 16,
      },
    },
    pattern: {
      opacityDefault: 0.05, // 4-6%
      opacityCalm: 0.035,   // 3-4%
      panDuration: 9,      // 9s linear
    },
    waves: {
      durations: [12, 20, 30], // wave 1: 12s, wave 2: 20s (rev), wave 3: 30s
      opacities: [0.25, 0.18, 0.14],
      calmMultiplier: 1.6,
    },
    shapes: {
      durations: [28, 32, 36, 30, 34],
    },
    bubbles: {
      riseDurations: [14, 18, 22, 16, 20, 24, 15, 19],
      swayDurations: [3.5, 4.2, 5.0, 3.8, 4.5, 5.5],
      sizes: [10, 14, 18, 12, 22, 16, 24, 11],
    },
  },

  // Glass tokens specifications
  glass: {
    opacityBg: 0.70, // 55-75%
    opacityBgStrong: 0.85, // 80-88%
    borderOpacity: 0.16, // 12-18%
    highlightOpacity: 0.10, // 8-12%
    blurDesktop: {
      card: '12px',
      nav: '16px',
      modal: '20px',
    },
    blurMobile: {
      card: '8px',
      nav: '12px',
      modal: '16px',
    },
  },
} as const;

/**
 * Standard Page Transition (Fade + 12px upward slide over 300ms)
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_CONFIG.durations.pageTransition,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Staggered Entrance Container
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION_CONFIG.stagger.cards,
      delayChildren: 0.02,
    },
  },
};

/**
 * Card / List Item Entrance Variant (Staggered 60ms, y: 16->0, scale: .98->1)
 */
export const cardEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: MOTION_CONFIG.durations.entranceDefault,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * Interactive Button Tap & Hover Presets (Transform only)
 */
export const buttonTapHover = {
  whileHover: { y: -1, transition: { duration: 0.15 } },
  whileTap: { scale: 0.97, transition: MOTION_CONFIG.springs.snappy },
};

/**
 * Subtle Card Lift on Hover / Tap
 */
export const cardInteractiveVariants: Variants = {
  initial: { y: 0 },
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  tap: {
    scale: 0.985,
    transition: MOTION_CONFIG.springs.snappy,
  },
};

/**
 * Quiz Answer Option Feedback Variants
 */
export const quizOptionVariants: Variants = {
  initial: { scale: 1, x: 0 },
  correctPop: {
    scale: [1, 1.025, 1],
    transition: {
      duration: 0.35,
      times: [0, 0.4, 1],
      ease: 'easeOut',
    },
  },
  wrongShake: {
    x: [-6, 6, -3, 3, 0],
    transition: {
      duration: MOTION_CONFIG.durations.quizShake,
      ease: 'easeInOut',
    },
  },
};

/**
 * Modal / Dialog Transition Variants
 */
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 6,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

/**
 * SVG Checkmark Path Draw-In Variant
 */
export const checkmarkDrawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
      delay: 0.1,
    },
  },
};

