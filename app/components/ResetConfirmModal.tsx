interface ResetConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetConfirmModal({ onConfirm, onCancel }: ResetConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-modalFadeIn"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] animate-modalSlideIn"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
      >
        <h2 id="reset-title" className="text-2xl font-bold text-gray-800">Reset Scores?</h2>
        <p className="text-center text-gray-600">
          This will reset both player scores to 0. This action cannot be undone.
        </p>
        <div className="flex gap-4 w-full">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 active:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 active:bg-red-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
