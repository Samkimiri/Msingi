import { CardProgress, SM2Rating } from '../types';

export function calculateSM2(
  current: CardProgress | undefined,
  rating: SM2Rating
): Omit<CardProgress, 'id' | 'user_id' | 'card_id'> {
  let ease = current?.ease ?? 2.50;
  let interval = current?.interval_days ?? 0;
  let repetitions = current?.repetitions ?? 0;
  let lapses = current?.lapses ?? 0;

  switch (rating) {
    case 'again':
      repetitions = 0;
      interval = 1;
      lapses += 1;
      ease = Math.max(1.30, ease - 0.20);
      break;

    case 'hard':
      if (repetitions === 0) {
        interval = 1;
        repetitions = 1;
      } else {
        interval = Math.max(1, Math.round(interval * 1.2));
      }
      ease = Math.max(1.30, ease - 0.15);
      break;

    case 'good':
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * ease);
      }
      repetitions += 1;
      break;

    case 'easy':
      if (repetitions === 0) {
        interval = 4;
      } else if (repetitions === 1) {
        interval = 8;
      } else {
        interval = Math.round(interval * ease * 1.3);
      }
      ease = Math.min(3.20, ease + 0.15);
      repetitions += 1;
      break;
  }

  // Calculate new due date
  const now = new Date();
  const due_at = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000).toISOString();

  return {
    ease: Number(ease.toFixed(2)),
    interval_days: interval,
    due_at,
    lapses,
    repetitions,
    updated_at: new Date().toISOString(),
  };
}

