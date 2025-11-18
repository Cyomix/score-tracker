interface InstructionsModalProps {
  onDismiss: () => void;
}

export function InstructionsModal({ onDismiss }: InstructionsModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-modalFadeIn"
      onClick={onDismiss}
    >
      <div
        className="bg-white rounded-2xl p-8 flex flex-col items-center gap-6 max-w-md mx-4 animate-modalSlideIn"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="instructions-title"
      >
        <h2 id="instructions-title" className="text-2xl font-bold text-gray-800">How to Use</h2>
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
          onClick={onDismiss}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 active:bg-blue-700 transition-colors w-full"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
