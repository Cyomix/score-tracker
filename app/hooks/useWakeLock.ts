import { useEffect, useRef, useState } from 'react';

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check if Wake Lock API is supported
    const supported = 'wakeLock' in navigator;
    setIsSupported(supported);

    if (!supported) {
      console.warn('Wake Lock API is not supported in this browser');
      return;
    }

    const requestWakeLock = async () => {
      try {
        // Request a screen wake lock
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        setIsActive(true);

        console.log('Wake Lock acquired - screen will stay awake');

        // Listen for wake lock release
        wakeLockRef.current.addEventListener('release', () => {
          console.log('Wake Lock released');
          setIsActive(false);
        });
      } catch (err) {
        console.error('Failed to acquire Wake Lock:', err);
        setIsActive(false);
      }
    };

    const handleVisibilityChange = () => {
      // Re-acquire wake lock when page becomes visible again
      if (wakeLockRef.current !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    // Request wake lock on mount
    requestWakeLock();

    // Re-request wake lock when page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup: release wake lock on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (wakeLockRef.current !== null) {
        wakeLockRef.current.release().then(() => {
          wakeLockRef.current = null;
          setIsActive(false);
          console.log('Wake Lock released on cleanup');
        });
      }
    };
  }, []);

  return { isSupported, isActive };
}
