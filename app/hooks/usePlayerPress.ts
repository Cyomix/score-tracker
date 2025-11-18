import { useState, useRef, useCallback } from 'react';

interface UsePlayerPressOptions {
  onTap: () => void;
  onHold: () => void;
  holdDuration?: number;
  progressThreshold?: number;
  progressInterval?: number;
}

interface UsePlayerPressReturn {
  isPressing: boolean;
  holdProgress: number;
  showProgress: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  handlePointerCancel: (e: React.PointerEvent) => void;
}

export function usePlayerPress({
  onTap,
  onHold,
  holdDuration = 500,
  progressThreshold = 0.2,
  progressInterval = 50,
}: UsePlayerPressOptions): UsePlayerPressReturn {
  const [isPressing, setIsPressing] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const showProgressTimer = useRef<NodeJS.Timeout | null>(null);
  const shouldTap = useRef(false);

  const cleanup = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
    if (showProgressTimer.current) {
      clearTimeout(showProgressTimer.current);
      showProgressTimer.current = null;
    }

    setIsPressing(false);
    setHoldProgress(0);
    setShowProgress(false);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();

    setIsPressing(true);
    shouldTap.current = true;

    // Delay showing progress indicator to prevent flash on quick taps (0.2 threshold)
    showProgressTimer.current = setTimeout(() => {
      setShowProgress(true);
    }, holdDuration * progressThreshold);

    // Start progress tracking at 20fps (50ms intervals)
    const startTime = Date.now();
    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / holdDuration, 1);
      setHoldProgress(progress);
    }, progressInterval);

    // Trigger hold action after duration
    holdTimer.current = setTimeout(() => {
      shouldTap.current = false;
      onHold();
      cleanup();
    }, holdDuration);
  }, [onHold, holdDuration, progressThreshold, progressInterval, cleanup]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();

    const shouldExecuteTap = shouldTap.current;
    cleanup();

    if (shouldExecuteTap) {
      onTap();
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  }, [onTap, cleanup]);

  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    cleanup();
  }, [cleanup]);

  return {
    isPressing,
    holdProgress,
    showProgress,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  };
}
