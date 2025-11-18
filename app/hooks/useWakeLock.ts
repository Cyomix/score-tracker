import { useEffect, useRef } from 'react';

// Type declaration for NoSleep.js
declare class NoSleep {
  constructor();
  enable(): Promise<void>;
  disable(): void;
  get isEnabled(): boolean;
}

// Detect if we're on iOS or Safari
function isIOSorSafari(): boolean {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  return isIOS || isSafari;
}

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const noSleepRef = useRef<NoSleep | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const shouldUseNoSleep = isIOSorSafari();

    const requestWakeLock = async () => {
      try {
        if (shouldUseNoSleep) {
          // iOS Safari and Safari: Always use NoSleep.js
          // Wake Lock API doesn't work reliably on iOS, especially in PWA mode
          if (!noSleepRef.current) {
            const NoSleep = (await import('nosleep.js')).default;
            noSleepRef.current = new NoSleep();
          }

          await noSleepRef.current.enable();
          console.log('NoSleep.js enabled - screen will stay awake');

          // Set up periodic keep-alive to ensure NoSleep stays active
          // Re-enable every 30 seconds as a safety measure
          if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
          }

          keepAliveIntervalRef.current = setInterval(async () => {
            if (noSleepRef.current && !noSleepRef.current.isEnabled) {
              try {
                await noSleepRef.current.enable();
                console.log('NoSleep.js re-enabled (keep-alive)');
              } catch (err) {
                console.error('Failed to re-enable NoSleep.js:', err);
              }
            }
          }, 30000); // Check every 30 seconds

        } else if ('wakeLock' in navigator) {
          // Modern browsers (not Safari): Use Wake Lock API
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          console.log('Wake Lock API acquired - screen will stay awake');

          wakeLockRef.current.addEventListener('release', () => {
            console.log('Wake Lock API released');
          });
        } else {
          // Fallback for older browsers
          if (!noSleepRef.current) {
            const NoSleep = (await import('nosleep.js')).default;
            noSleepRef.current = new NoSleep();
          }
          await noSleepRef.current.enable();
          console.log('NoSleep.js enabled (fallback) - screen will stay awake');
        }
      } catch (err) {
        console.error('Failed to acquire wake lock:', err);

        // If Wake Lock API fails, try NoSleep.js as fallback
        if (!shouldUseNoSleep && !noSleepRef.current) {
          try {
            const NoSleep = (await import('nosleep.js')).default;
            noSleepRef.current = new NoSleep();
            await noSleepRef.current.enable();
            console.log('NoSleep.js enabled (error fallback) - screen will stay awake');
          } catch (fallbackErr) {
            console.error('NoSleep.js fallback also failed:', fallbackErr);
          }
        }
      }
    };

    const handleVisibilityChange = () => {
      // Re-acquire wake lock when page becomes visible again
      if (document.visibilityState === 'visible') {
        console.log('Page became visible, re-acquiring wake lock');
        requestWakeLock();
      }
    };

    // Enable wake lock on user interaction (required for iOS and autoplay policies)
    const enableOnInteraction = () => {
      requestWakeLock();
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

      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }

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
