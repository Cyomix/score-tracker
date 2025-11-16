'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [editingBlue, setEditingBlue] = useState(false);
  const [editingRed, setEditingRed] = useState(false);
  const [editValue, setEditValue] = useState('');

  const blueHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const redHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const shouldIncrementBlue = useRef(false);
  const shouldIncrementRed = useRef(false);

  // Focus input when editing mode is activated
  useEffect(() => {
    if ((editingBlue || editingRed) && editInputRef.current) {
      // Immediate focus for keyboard
      editInputRef.current.focus();
      editInputRef.current.select();
      // Try to trigger mobile keyboard
      editInputRef.current.click();
    }
  }, [editingBlue, editingRed]);

  const handleBluePress = (e: React.TouchEvent | React.MouseEvent) => {
    // Prevent mouse events if this is a touch device
    if (e.type === 'mousedown' && 'ontouchstart' in window) {
      return;
    }
    e.preventDefault();

    shouldIncrementBlue.current = true;
    blueHoldTimer.current = setTimeout(() => {
      shouldIncrementBlue.current = false;
      setEditValue(blueScore.toString());
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
      setEditValue(redScore.toString());
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

  const handleEditChange = (value: string) => {
    setEditValue(value);
  };

  const saveEdit = () => {
    const num = parseInt(editValue) || 0;
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

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Modal for editing score */}
      {(editingBlue || editingRed) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={cancelEdit}
        >
          <div
            className="bg-white rounded-2xl p-8 flex flex-col items-center gap-6 min-w-[320px]"
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
                className={`flex-1 ${editingBlue ? 'bg-blue-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 active:opacity-75 transition-opacity`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rotated container for portrait mode */}
      <div className="h-full w-full portrait:rotate-90 portrait:w-screen portrait:h-screen">
        {/* Reset button */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 portrait:-rotate-90">
          <button
            onClick={handleReset}
            className="bg-white text-gray-800 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Score tracking area - always horizontal (blue left, red right) */}
        <div className="flex flex-row h-full w-full">
          {/* Blue side - LEFT */}
          <div
            className="w-1/2 h-full bg-blue-500 flex items-center justify-center select-none"
            onMouseDown={handleBluePress}
            onMouseUp={handleBlueRelease}
            onMouseLeave={handleBlueRelease}
            onTouchStart={handleBluePress}
            onTouchEnd={handleBlueRelease}
            style={{ touchAction: 'none' }}
          >
            <span className="text-white text-9xl font-bold pointer-events-none rotate-180">
              {blueScore}
            </span>
          </div>

          {/* Red side - RIGHT */}
          <div
            className="w-1/2 h-full bg-red-500 flex items-center justify-center select-none"
            onMouseDown={handleRedPress}
            onMouseUp={handleRedRelease}
            onMouseLeave={handleRedRelease}
            onTouchStart={handleRedPress}
            onTouchEnd={handleRedRelease}
            style={{ touchAction: 'none' }}
          >
            <span className="text-white text-9xl font-bold pointer-events-none rotate-180">
              {redScore}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
