import { useRef, useEffect } from 'react';

interface EditScoreModalProps {
  player: 'blue' | 'red';
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EditScoreModal({
  player,
  value,
  onChange,
  onSave,
  onCancel,
}: EditScoreModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus and select input when modal opens
    if (inputRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      });
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const bgColor = player === 'blue' ? 'bg-blue-500' : 'bg-red-500';
  const hoverBg = player === 'blue' ? 'hover:bg-blue-600' : 'hover:bg-red-600';
  const activeBg = player === 'blue' ? 'active:bg-blue-700' : 'active:bg-red-700';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-modalFadeIn">
      <div
        className="bg-white rounded-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] animate-modalSlideIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-score-title"
      >
        <h2 id="edit-score-title" className="text-2xl font-bold text-gray-800">
          Edit {player === 'blue' ? 'Blue' : 'Red'} Score
        </h2>
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-6xl font-bold text-center border-4 border-gray-300 rounded-lg w-full p-4 outline-none focus:border-blue-500"
          min="0"
          max="999"
          aria-label={`Edit ${player} player score`}
        />
        <div className="flex gap-4 w-full">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 active:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className={`flex-1 ${bgColor} ${hoverBg} ${activeBg} text-white px-6 py-3 rounded-lg font-semibold transition-colors`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
