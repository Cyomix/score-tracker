import { useState, useEffect } from 'react';
import { ANIMATION_DURATION } from '../constants';

/**
 * Custom hook to handle score increment animation
 * Triggers animation when score changes and automatically resets after duration
 */
export function useScoreAnimation(score: number) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (score > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, ANIMATION_DURATION.SCORE_INCREMENT);

      return () => clearTimeout(timer);
    }
  }, [score]);

  return isAnimating;
}
