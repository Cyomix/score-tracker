'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [editingBlue, setEditingBlue] = useState(false);
  const [editingRed, setEditingRed] = useState(false);

  const blueHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const redHoldTimer = useRef<NodeJS.Timeout | null>(null);

  const handleBluePress = () => {
    blueHoldTimer.current = setTimeout(() => {
      setEditingBlue(true);
    }, 500);
  };

  const handleBlueRelease = () => {
    if (blueHoldTimer.current) {
      clearTimeout(blueHoldTimer.current);
      blueHoldTimer.current = null;
    }
    if (!editingBlue) {
      setBlueScore(prev => prev + 1);
    }
  };

  const handleRedPress = () => {
    redHoldTimer.current = setTimeout(() => {
      setEditingRed(true);
    }, 500);
  };

  const handleRedRelease = () => {
    if (redHoldTimer.current) {
      clearTimeout(redHoldTimer.current);
      redHoldTimer.current = null;
    }
    if (!editingRed) {
      setRedScore(prev => prev + 1);
    }
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

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
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
          className="w-1/2 bg-blue-500 flex items-center justify-center select-none touch-none"
          onMouseDown={handleBluePress}
          onMouseUp={handleBlueRelease}
          onMouseLeave={handleBlueRelease}
          onTouchStart={handleBluePress}
          onTouchEnd={handleBlueRelease}
        >
          {editingBlue ? (
            <div className="flex flex-col items-center gap-4">
              <input
                type="number"
                value={blueScore}
                onChange={(e) => handleBlueEdit(e.target.value)}
                className="text-9xl font-bold text-center bg-transparent text-white border-4 border-white rounded-lg w-64 p-4 outline-none"
                autoFocus
                onBlur={() => setEditingBlue(false)}
              />
              <button
                onClick={() => setEditingBlue(false)}
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
          className="w-1/2 bg-red-500 flex items-center justify-center select-none touch-none"
          onMouseDown={handleRedPress}
          onMouseUp={handleRedRelease}
          onMouseLeave={handleRedRelease}
          onTouchStart={handleRedPress}
          onTouchEnd={handleRedRelease}
        >
          {editingRed ? (
            <div className="flex flex-col items-center gap-4">
              <input
                type="number"
                value={redScore}
                onChange={(e) => handleRedEdit(e.target.value)}
                className="text-9xl font-bold text-center bg-transparent text-white border-4 border-white rounded-lg w-64 p-4 outline-none"
                autoFocus
                onBlur={() => setEditingRed(false)}
              />
              <button
                onClick={() => setEditingRed(false)}
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
