'use client';

import { useState, useRef, useEffect } from 'react';
import { useWakeLock } from './hooks/useWakeLock';
import { usePlayerPress } from './hooks/usePlayerPress';
import { useScoreAnimation } from './hooks/useScoreAnimation';
import { PlayerButton } from './components/PlayerButton';
import { InstructionsModal } from './components/InstructionsModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { EditScoreModal } from './components/EditScoreModal';
import { TIMEOUT_DURATION, SCORE_LIMITS } from './constants';

type Player = 'blue' | 'red';

interface Scores {
  blue: number;
  red: number;
}

interface EditState {
  player: Player;
  value: string;
}

export default function Home() {
  // Keep screen awake during gameplay
  useWakeLock();

  // Core state - reduced from 18 to 6 states
  const [scores, setScores] = useState<Scores>({ blue: 0, red: 0 });
  const [editing, setEditing] = useState<EditState | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Use custom hook for score animations
  const blueScoreAnimating = useScoreAnimation(scores.blue);
  const redScoreAnimating = useScoreAnimation(scores.red);

  const instructionsTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Unified press handling for blue player
  const bluePress = usePlayerPress({
    onTap: () => {
      setScores((prev) => ({ ...prev, blue: prev.blue + 1 }));
    },
    onHold: () => {
      setEditing({ player: 'blue', value: scores.blue.toString() });
    },
  });

  // Unified press handling for red player
  const redPress = usePlayerPress({
    onTap: () => {
      setScores((prev) => ({ ...prev, red: prev.red + 1 }));
    },
    onHold: () => {
      setEditing({ player: 'red', value: scores.red.toString() });
    },
  });

  // Track orientation changes
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.matchMedia('(orientation: portrait)').matches);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Check if instructions have been seen
  useEffect(() => {
    const instructionsSeen = localStorage.getItem('instructionsSeen');
    if (!instructionsSeen) {
      setShowInstructions(true);
      instructionsTimerRef.current = setTimeout(() => {
        setShowInstructions(false);
        localStorage.setItem('instructionsSeen', 'true');
      }, TIMEOUT_DURATION.INSTRUCTIONS_AUTO_DISMISS);
    }

    return () => {
      if (instructionsTimerRef.current) {
        clearTimeout(instructionsTimerRef.current);
      }
    };
  }, []);

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setScores({ blue: 0, red: 0 });
    setShowResetConfirm(false);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  const handleEditChange = (value: string) => {
    if (editing) {
      setEditing({ ...editing, value });
    }
  };

  const saveEdit = () => {
    if (editing) {
      const num = Math.max(
        SCORE_LIMITS.MIN,
        Math.min(SCORE_LIMITS.MAX, parseInt(editing.value) || 0)
      );
      setScores((prev) => ({ ...prev, [editing.player]: num }));
      setEditing(null);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, player: Player) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setScores((prev) => ({ ...prev, [player]: prev[player] + 1 }));
    } else if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      setEditing({ player, value: scores[player].toString() });
    }
  };

  const dismissInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem('instructionsSeen', 'true');
    if (instructionsTimerRef.current) {
      clearTimeout(instructionsTimerRef.current);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Instructions modal */}
      {showInstructions && <InstructionsModal onDismiss={dismissInstructions} />}

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <ResetConfirmModal onConfirm={confirmReset} onCancel={cancelReset} />
      )}

      {/* Edit score modal */}
      {editing && (
        <EditScoreModal
          player={editing.player}
          value={editing.value}
          onChange={handleEditChange}
          onSave={saveEdit}
          onCancel={cancelEdit}
        />
      )}

      {/* Live region for score announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Blue score: {scores.blue}, Red score: {scores.red}
      </div>

      {/* Container for portrait mode rotation */}
      <div className="relative flex-1 w-full overflow-hidden">
        <div
          style={{
            transformOrigin: 'center center',
            position: isPortrait ? 'absolute' : 'relative',
            inset: isPortrait ? 0 : 'auto',
            height: '100%',
          }}
        >
          <div
            style={{
              width: isPortrait ? '100vh' : '100%',
              height: isPortrait ? '100vw' : '100%',
              transform: isPortrait ? 'translate(-50%, -50%) rotate(90deg)' : 'none',
              position: isPortrait ? 'absolute' : 'relative',
              left: isPortrait ? '50%' : 'auto',
              top: isPortrait ? '50%' : 'auto',
            }}
          >
            {/* Reset button */}
            <div className={`absolute ${isPortrait ? 'top-4' : 'bottom-8'} left-1/2 -translate-x-1/2 z-10`}>
              <button
                onClick={handleReset}
                className="bg-white text-gray-800 px-5 py-3 rounded-full shadow-lg hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-500 flex items-center gap-2.5"
                aria-label="Reset scores"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </button>
            </div>

            {/* Score tracking area */}
            <div className="flex flex-row h-full w-full">
              {isPortrait ? (
                <>
                  {/* Blue player - left in portrait (becomes top) */}
                  <PlayerButton
                    player="blue"
                    score={scores.blue}
                    isPressing={bluePress.isPressing}
                    showProgress={bluePress.showProgress}
                    holdProgress={bluePress.holdProgress}
                    isPortrait={isPortrait}
                    onPointerDown={bluePress.handlePointerDown}
                    onPointerUp={bluePress.handlePointerUp}
                    onPointerCancel={bluePress.handlePointerCancel}
                    onKeyDown={(e) => handleKeyDown(e, 'blue')}
                    scoreChanged={blueScoreAnimating}
                  />

                  {/* Red player - right in portrait (becomes bottom) */}
                  <PlayerButton
                    player="red"
                    score={scores.red}
                    isPressing={redPress.isPressing}
                    showProgress={redPress.showProgress}
                    holdProgress={redPress.holdProgress}
                    isPortrait={isPortrait}
                    onPointerDown={redPress.handlePointerDown}
                    onPointerUp={redPress.handlePointerUp}
                    onPointerCancel={redPress.handlePointerCancel}
                    onKeyDown={(e) => handleKeyDown(e, 'red')}
                    scoreChanged={redScoreAnimating}
                  />
                </>
              ) : (
                <>
                  {/* Landscape mode: Red on left, Blue on right */}
                  <PlayerButton
                    player="red"
                    score={scores.red}
                    isPressing={redPress.isPressing}
                    showProgress={redPress.showProgress}
                    holdProgress={redPress.holdProgress}
                    isPortrait={isPortrait}
                    onPointerDown={redPress.handlePointerDown}
                    onPointerUp={redPress.handlePointerUp}
                    onPointerCancel={redPress.handlePointerCancel}
                    onKeyDown={(e) => handleKeyDown(e, 'red')}
                    scoreChanged={redScoreAnimating}
                  />

                  <PlayerButton
                    player="blue"
                    score={scores.blue}
                    isPressing={bluePress.isPressing}
                    showProgress={bluePress.showProgress}
                    holdProgress={bluePress.holdProgress}
                    isPortrait={isPortrait}
                    onPointerDown={bluePress.handlePointerDown}
                    onPointerUp={bluePress.handlePointerUp}
                    onPointerCancel={bluePress.handlePointerCancel}
                    onKeyDown={(e) => handleKeyDown(e, 'blue')}
                    scoreChanged={blueScoreAnimating}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
