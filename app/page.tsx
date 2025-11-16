'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [editingBlue, setEditingBlue] = useState(false);
  const [editingRed, setEditingRed] = useState(false);

  const blueHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const redHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const blueInputRef = useRef<HTMLInputElement>(null);
  const redInputRef = useRef<HTMLInputElement>(null);
  const shouldIncrementBlue = useRef(false);
  const shouldIncrementRed = useRef(false);

  // Focus input when editing mode is activated
  useEffect(() => {
    if (editingBlue && blueInputRef.current) {
      setTimeout(() => {
        blueInputRef.current?.focus();
        blueInputRef.current?.select();
      }, 100);
    }
  }, [editingBlue]);

  useEffect(() => {
    if (editingRed && redInputRef.current) {
      setTimeout(() => {
        redInputRef.current?.focus();
        redInputRef.current?.select();
      }, 100);
    }
  }, [editingRed]);

  const handleBluePress = (e: React.TouchEvent | React.MouseEvent) => {
    // Prevent mouse events if this is a touch device
    if (e.type === 'mousedown' && 'ontouchstart' in window) {
      return;
    }
    e.preventDefault();

    shouldIncrementBlue.current = true;
    blueHoldTimer.current = setTimeout(() => {
      shouldIncrementBlue.current = false;
      setEditingBlue(true);
    }, 500);
  };

  const handleBlueRelease = (e: React.TouchEvent | React.MouseEvent) => {
    // Prevent mouse events if this is a touch device
    if (e.type === 'mouseup' && 'ontouchstart' in window) {
      return;
    }
    e.preventDefault();

    if (blueHoldTimer.current) {
      clearTimeout(blueHoldTimer.current);
      blueHoldTimer.current = null;
    }

    if (shouldIncrementBlue.current && !editingBlue) {
      setBlueScore(prev => prev + 1);
    }
    shouldIncrementBlue.current = false;
  };

  const handleRedPress = (e: React.TouchEvent | React.MouseEvent) => {
    // Prevent mouse events if this is a touch device
    if (e.type === 'mousedown' && 'ontouchstart' in window) {
      return;
    }
    e.preventDefault();

    shouldIncrementRed.current = true;
    redHoldTimer.current = setTimeout(() => {
      shouldIncrementRed.current = false;
      setEditingRed(true);
    }, 500);
  };

  const handleRedRelease = (e: React.TouchEvent | React.MouseEvent) => {
    // Prevent mouse events if this is a touch device
    if (e.type === 'mouseup' && 'ontouchstart' in window) {
      return;
    }
    e.preventDefault();

    if (redHoldTimer.current) {
      clearTimeout(redHoldTimer.current);
      redHoldTimer.current = null;
    }

    if (shouldIncrementRed.current && !editingRed) {
      setRedScore(prev => prev + 1);
    }
    shouldIncrementRed.current = false;
  };

  const handleReset = () => {
    setBlueScore(0);
    setRedScore(0);
  };

  const handleBlueEdit = (value: string) => {
    const num = parseInt(value) || 0;
    setBlueScore(num);
  };

  const handleRedEdit = (value: string) => {
    const num = parseInt(value) || 0;
    setRedScore(num);
  };

  const closeBlueEdit = () => {
    setEditingBlue(false);
  };

  const closeRedEdit = () => {
    setEditingRed(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Portrait mode overlay */}
      <div className="portrait:flex hidden fixed inset-0 bg-gray-900 z-50 items-center justify-center text-white text-center p-8">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <h2 className="text-3xl font-bold">Please Rotate Your Device</h2>
          <p className="text-xl text-gray-300">This app works best in landscape mode</p>
        </div>
      </div>

      {/* Reset button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={handleReset}
          className="bg-white text-gray-800 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Score tracking area */}
      <div className="flex flex-1 h-full">
        {/* Blue side */}
        <div
          className="w-1/2 bg-blue-500 flex items-center justify-center select-none"
          onMouseDown={handleBluePress}
          onMouseUp={handleBlueRelease}
          onMouseLeave={handleBlueRelease}
          onTouchStart={handleBluePress}
          onTouchEnd={handleBlueRelease}
          style={{ touchAction: 'none' }}
        >
          {editingBlue ? (
            <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
              <input
                ref={blueInputRef}
                type="number"
                inputMode="numeric"
                value={blueScore}
                onChange={(e) => handleBlueEdit(e.target.value)}
                className="text-9xl font-bold text-center bg-transparent text-white border-4 border-white rounded-lg w-64 p-4 outline-none"
              />
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={closeBlueEdit}
                className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold"
              >
                Done
              </button>
            </div>
          ) : (
            <span className="text-white text-9xl font-bold pointer-events-none">
              {blueScore}
            </span>
          )}
        </div>

        {/* Red side */}
        <div
          className="w-1/2 bg-red-500 flex items-center justify-center select-none"
          onMouseDown={handleRedPress}
          onMouseUp={handleRedRelease}
          onMouseLeave={handleRedRelease}
          onTouchStart={handleRedPress}
          onTouchEnd={handleRedRelease}
          style={{ touchAction: 'none' }}
        >
          {editingRed ? (
            <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
              <input
                ref={redInputRef}
                type="number"
                inputMode="numeric"
                value={redScore}
                onChange={(e) => handleRedEdit(e.target.value)}
                className="text-9xl font-bold text-center bg-transparent text-white border-4 border-white rounded-lg w-64 p-4 outline-none"
              />
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={closeRedEdit}
                className="bg-white text-red-500 px-6 py-3 rounded-lg font-semibold"
              >
                Done
              </button>
            </div>
          ) : (
            <span className="text-white text-9xl font-bold pointer-events-none">
              {redScore}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
