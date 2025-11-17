'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [editingBlue, setEditingBlue] = useState(false);
  const [editingRed, setEditingRed] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isPortrait, setIsPortrait] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Touch feedback states
  const [bluePressing, setBluePressing] = useState(false);
  const [redPressing, setRedPressing] = useState(false);
  const [blueHoldProgress, setBlueHoldProgress] = useState(0);
  const [redHoldProgress, setRedHoldProgress] = useState(0);

  // Animation states
  const [blueScoreChanged, setBlueScoreChanged] = useState(false);
  const [redScoreChanged, setRedScoreChanged] = useState(false);

  const blueHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const redHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const blueProgressInterval = useRef<NodeJS.Timeout | null>(null);
  const redProgressInterval = useRef<NodeJS.Timeout | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const shouldIncrementBlue = useRef(false);
  const shouldIncrementRed = useRef(false);
  const instructionsTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      }, 6000);
    }

    return () => {
      if (instructionsTimerRef.current) {
        clearTimeout(instructionsTimerRef.current);
      }
    };
  }, []);

  // Focus input when editing mode is activated
  useEffect(() => {
    if ((editingBlue || editingRed) && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
      editInputRef.current.click();
    }
  }, [editingBlue, editingRed]);

  // Trigger score increment animation
  useEffect(() => {
    if (blueScore > 0) {
      setBlueScoreChanged(true);
      const timer = setTimeout(() => setBlueScoreChanged(false), 250);
      return () => clearTimeout(timer);
    }
  }, [blueScore]);

  useEffect(() => {
    if (redScore > 0) {
      setRedScoreChanged(true);
      const timer = setTimeout(() => setRedScoreChanged(false), 250);
      return () => clearTimeout(timer);
    }
  }, [redScore]);

  const handleBluePress = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.type === 'mousedown' && 'ontouchstart' in window) {
      return;
    }
    e.preventDefault();

    setBluePressing(true);
    shouldIncrementBlue.current = true;

    // Start progress tracking
    const startTime = Date.now();
    blueProgressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 500, 1);
      setBlueHoldProgress(progress);
    }, 16);

    blueHoldTimer.current = setTimeout(() => {
      shouldIncrementBlue.current = false;
      setEditValue(blueScore.toString());
      setEditingBlue(true);
      setBluePressing(false);
      setBlueHoldProgress(0);
      if (blueProgressInterval.current) {
        clearInterval(blueProgressInterval.current);
      }
    }, 500);
  };

  const handleBlueRelease = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.type === 'mouseup' && 'ontouchstart' in window) {
      return;
    }
    e.preventDefault();

    setBluePressing(false);
    setBlueHoldProgress(0);

    if (blueHoldTimer.current) {
      clearTimeout(blueHoldTimer.current);
      blueHoldTimer.current = null;
    }

    if (blueProgressInterval.current) {
      clearInterval(blueProgressInterval.current);
      blueProgressInterval.current = null;
    }

    if (shouldIncrementBlue.current && !editingBlue) {
      setBlueScore(prev => prev + 1);
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
    shouldIncrementBlue.current = false;
  };

  const handleRedPress = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.type === 'mousedown' && 'ontouchstart' in window) {
      return;
    }
    e.preventDefault();

    setRedPressing(true);
    shouldIncrementRed.current = true;

    // Start progress tracking
    const startTime = Date.now();
    redProgressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 500, 1);
      setRedHoldProgress(progress);
    }, 16);

    redHoldTimer.current = setTimeout(() => {
      shouldIncrementRed.current = false;
      setEditValue(redScore.toString());
      setEditingRed(true);
      setRedPressing(false);
      setRedHoldProgress(0);
      if (redProgressInterval.current) {
        clearInterval(redProgressInterval.current);
      }
    }, 500);
  };

  const handleRedRelease = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.type === 'mouseup' && 'ontouchstart' in window) {
      return;
    }
    e.preventDefault();

    setRedPressing(false);
    setRedHoldProgress(0);

    if (redHoldTimer.current) {
      clearTimeout(redHoldTimer.current);
      redHoldTimer.current = null;
    }

    if (redProgressInterval.current) {
      clearInterval(redProgressInterval.current);
      redProgressInterval.current = null;
    }

    if (shouldIncrementRed.current && !editingRed) {
      setRedScore(prev => prev + 1);
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
    shouldIncrementRed.current = false;
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setBlueScore(0);
    setRedScore(0);
    setShowResetConfirm(false);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  const handleEditChange = (value: string) => {
    setEditValue(value);
  };

  const saveEdit = () => {
    const num = Math.max(0, Math.min(999, parseInt(editValue) || 0));
    if (editingBlue) {
      setBlueScore(num);
      setEditingBlue(false);
    } else if (editingRed) {
      setRedScore(num);
      setEditingRed(false);
    }
  };

  const cancelEdit = () => {
    setEditingBlue(false);
    setEditingRed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, player: 'blue' | 'red') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (player === 'blue') {
        setBlueScore(prev => prev + 1);
      } else {
        setRedScore(prev => prev + 1);
      }
    } else if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      if (player === 'blue') {
        setEditValue(blueScore.toString());
        setEditingBlue(true);
      } else {
        setEditValue(redScore.toString());
        setEditingRed(true);
      }
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
      {/* Instructions overlay */}
      {showInstructions && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-modalFadeIn"
          onClick={dismissInstructions}
        >
          <div
            className="bg-white rounded-2xl p-8 flex flex-col items-center gap-6 max-w-md mx-4 animate-modalSlideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-800">How to Use</h2>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                  +
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Tap to Add Point</p>
                  <p className="text-sm text-gray-600">Quick tap on your side</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                  ✎
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Hold to Edit</p>
                  <p className="text-sm text-gray-600">Press and hold to set any score</p>
                </div>
              </div>
            </div>
            <button
              onClick={dismissInstructions}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 active:bg-blue-700 transition-colors w-full"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-modalFadeIn"
          onClick={cancelReset}
        >
          <div
            className="bg-white rounded-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] animate-modalSlideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-800">Reset Scores?</h2>
            <p className="text-center text-gray-600">
              This will reset both player scores to 0. This action cannot be undone.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={cancelReset}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 active:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 active:bg-red-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit score modal */}
      {(editingBlue || editingRed) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-modalFadeIn"
          onClick={cancelEdit}
        >
          <div
            className="bg-white rounded-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] animate-modalSlideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Edit {editingBlue ? 'Blue' : 'Red'} Score
            </h2>
            <input
              ref={editInputRef}
              type="number"
              inputMode="numeric"
              value={editValue}
              onChange={(e) => handleEditChange(e.target.value)}
              className="text-6xl font-bold text-center border-4 border-gray-300 rounded-lg w-full p-4 outline-none focus:border-blue-500"
              autoFocus
              min="0"
              max="999"
              aria-label={`Edit ${editingBlue ? 'blue' : 'red'} player score`}
            />
            <div className="flex gap-4 w-full">
              <button
                onClick={cancelEdit}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 active:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className={`flex-1 ${editingBlue ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700' : 'bg-red-500 hover:bg-red-600 active:bg-red-700'} text-white px-6 py-3 rounded-lg font-semibold transition-colors`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live region for score announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Blue score: {blueScore}, Red score: {redScore}
      </div>

      {/* Container for portrait mode rotation */}
      <div className="relative h-full w-full overflow-hidden">
        <div
          style={{
            transformOrigin: 'center center',
            position: isPortrait ? 'absolute' : 'relative',
            inset: isPortrait ? 0 : 'auto',
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
            {/* Reset button - circular with icon */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <button
                onClick={handleReset}
                className="bg-white text-gray-800 p-4 rounded-full shadow-lg hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500"
                aria-label="Reset scores"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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

            {/* Score tracking area - always horizontal (blue left, red right) */}
            <div className="flex flex-row h-full w-full">
              {/* Blue side - LEFT */}
              <button
                className="w-1/2 h-full bg-blue-500 flex flex-col items-center justify-center select-none relative focus:outline-none focus:ring-4 focus:ring-inset focus:ring-blue-300 transition-all"
                onMouseDown={handleBluePress}
                onMouseUp={handleBlueRelease}
                onMouseLeave={handleBlueRelease}
                onTouchStart={handleBluePress}
                onTouchEnd={handleBlueRelease}
                onKeyDown={(e) => handleKeyDown(e, 'blue')}
                style={{ touchAction: 'none' }}
                aria-label="Blue player score area"
                aria-describedby="blue-score-value"
                tabIndex={0}
              >
                {/* Player label */}
                <div className="absolute top-8 text-white text-2xl font-bold opacity-50 rotate-180">
                  PLAYER 1
                </div>

                {/* Active state overlay */}
                {bluePressing && (
                  <div className="absolute inset-0 bg-white opacity-20 pointer-events-none" />
                )}

                {/* Hold progress indicator */}
                {blueHoldProgress > 0 && blueHoldProgress < 1 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className="w-32 h-32 rotate-180" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="8"
                        opacity="0.3"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - blueHoldProgress)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                )}

                <span
                  id="blue-score-value"
                  className={`text-white text-[12rem] font-bold pointer-events-none rotate-180 ${blueScoreChanged ? 'animate-scoreIncrement' : ''}`}
                >
                  {blueScore}
                </span>
              </button>

              {/* Red side - RIGHT */}
              <button
                className="w-1/2 h-full bg-red-500 flex flex-col items-center justify-center select-none relative focus:outline-none focus:ring-4 focus:ring-inset focus:ring-red-300 transition-all"
                onMouseDown={handleRedPress}
                onMouseUp={handleRedRelease}
                onMouseLeave={handleRedRelease}
                onTouchStart={handleRedPress}
                onTouchEnd={handleRedRelease}
                onKeyDown={(e) => handleKeyDown(e, 'red')}
                style={{ touchAction: 'none' }}
                aria-label="Red player score area"
                aria-describedby="red-score-value"
                tabIndex={0}
              >
                {/* Player label */}
                <div className="absolute top-8 text-white text-2xl font-bold opacity-50">
                  PLAYER 2
                </div>

                {/* Active state overlay */}
                {redPressing && (
                  <div className="absolute inset-0 bg-white opacity-20 pointer-events-none" />
                )}

                {/* Hold progress indicator */}
                {redHoldProgress > 0 && redHoldProgress < 1 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="8"
                        opacity="0.3"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - redHoldProgress)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                )}

                <span
                  id="red-score-value"
                  className={`text-white text-[12rem] font-bold pointer-events-none ${redScoreChanged ? 'animate-scoreIncrement' : ''}`}
                >
                  {redScore}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
