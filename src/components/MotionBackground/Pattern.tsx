import React from 'react';

interface PatternProps {
  variant: 'default' | 'calm' | 'celebrate';
  prefersReducedMotion: boolean;
}

/**
 * Faint African textile pattern (diamonds, nested diamonds, corner triangles)
 * Opacity: 4-6% (3-4% in calm mode) in existing text color (#1e293b).
 * Pans diagonally and seamlessly via pure CSS keyframe (9s linear).
 */
export const Pattern: React.FC<PatternProps> = ({ variant, prefersReducedMotion }) => {
  const opacity = variant === 'calm' ? 'opacity-[0.04]' : 'opacity-[0.06]';

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-500 dark:invert ${opacity}`}
    >
      <div
        className={`w-[200%] h-[200%] absolute -top-1/2 -left-1/2 ${
          prefersReducedMotion ? '' : 'animate-pattern-pan'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231e293b' fill-opacity='1' fill-rule='evenodd'%3E%3C!-- Outer Diamond --%3E%3Cpath d='M30 2 L58 30 L30 58 L2 30 Z' fill='none' stroke='%231e293b' stroke-width='1.2'/%3E%3C!-- Inner Nested Diamond --%3E%3Cpath d='M30 14 L46 30 L30 46 L14 30 Z' fill='none' stroke='%231e293b' stroke-width='1'/%3E%3C!-- Center Dot / Cross --%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C!-- Corner Triangles --%3E%3Cpath d='M0 0 L10 0 L0 10 Z M60 0 L50 0 L60 10 Z M0 60 L10 60 L0 50 Z M60 60 L50 60 L60 50 Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
};

