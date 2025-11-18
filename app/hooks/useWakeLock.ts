import { useEffect, useRef, useState } from 'react';

// Type declaration for NoSleep.js
declare class NoSleep {
  constructor();
  enable(): Promise<void>;
  disable(): void;
  get isEnabled(): boolean;
}

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const noSleepRef = useRef<NoSleep | null>(null);

  useEffect(() => {
    const hasWakeLockAPI = 'wakeLock' in navigator;

    const requestWakeLock = async () => {
      try {
        if (hasWakeLockAPI) {
          // Modern browsers: Use Wake Lock API
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          console.log('Wake Lock API acquired - screen will stay awake');

          wakeLockRef.current.addEventListener('release', () => {
            console.log('Wake Lock API released');
          });
        } else {
          // iOS Safari and older browsers: Use NoSleep.js fallback
          if (!noSleepRef.current) {
            const NoSleep = (await import('nosleep.js')).default;
            noSleepRef.current = new NoSleep();
          }

          await noSleepRef.current.enable();
          console.log('NoSleep.js enabled - screen will stay awake');
        }
      } catch (err) {
        console.error('Failed to acquire wake lock:', err);
      }
    };

    const handleVisibilityChange = () => {
      // Re-acquire wake lock when page becomes visible again
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    // Enable wake lock on user interaction (required for iOS)
    const enableOnInteraction = () => {
      requestWakeLock();
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', enableOnInteraction);
      document.removeEventListener('mousedown', enableOnInteraction);
    };

    // Wait for user interaction before enabling wake lock
    document.addEventListener('touchstart', enableOnInteraction, { once: true });
    document.addEventListener('mousedown', enableOnInteraction, { once: true });

    // Re-request wake lock when page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup: release wake lock on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('touchstart', enableOnInteraction);
      document.removeEventListener('mousedown', enableOnInteraction);

      if (wakeLockRef.current !== null) {
        wakeLockRef.current.release().then(() => {
          wakeLockRef.current = null;
          console.log('Wake Lock API released on cleanup');
        });
      }

      if (noSleepRef.current) {
        noSleepRef.current.disable();
        noSleepRef.current = null;
        console.log('NoSleep.js disabled on cleanup');
      }
    };
  }, []);
}
