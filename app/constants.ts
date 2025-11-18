/**
 * Application-wide constants
 */

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  SCORE_INCREMENT: 250,
  MODAL_FADE_IN: 200,
  MODAL_SLIDE_IN: 250,
} as const;

// Timeout durations (in milliseconds)
export const TIMEOUT_DURATION = {
  INSTRUCTIONS_AUTO_DISMISS: 6000,
  HOLD_DURATION: 500,
} as const;

// Score limits
export const SCORE_LIMITS = {
  MIN: 0,
  MAX: 999,
} as const;

// Progress thresholds
export const PROGRESS_THRESHOLD = {
  MIN_VISIBLE: 0.05,
} as const;
