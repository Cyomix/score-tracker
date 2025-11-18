import { ProgressCircle } from './ProgressCircle';
import { PROGRESS_THRESHOLD } from '../constants';

interface PlayerButtonProps {
  player: 'blue' | 'red';
  score: number;
  isPressing: boolean;
  showProgress: boolean;
  holdProgress: number;
  isPortrait: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerCancel: (e: React.PointerEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  scoreChanged: boolean;
}

export function PlayerButton({
  player,
  score,
  isPressing,
  showProgress,
  holdProgress,
  isPortrait,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onKeyDown,
  scoreChanged,
}: PlayerButtonProps) {
  const bgColor = player === 'blue' ? 'bg-blue-500' : 'bg-red-500';
  const focusOutline = player === 'blue' ? 'focus-visible:outline-blue-300' : 'focus-visible:outline-red-300';
  const playerLabel = player === 'blue' ? 'PLAYER 1' : 'PLAYER 2';
  const ariaLabel = `${player === 'blue' ? 'Blue' : 'Red'} player score area`;
  const scoreId = `${player}-score-value`;

  return (
    <button
      className={`w-1/2 h-full ${bgColor} flex flex-col items-center justify-center select-none relative focus:outline-none focus-visible:outline focus-visible:outline-4 ${focusOutline} focus-visible:outline-offset-[-8px] transition-transform duration-75 ${isPressing ? 'scale-[0.98]' : 'scale-100'}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
      style={{ touchAction: 'none' }}
      aria-label={ariaLabel}
      aria-describedby={scoreId}
      tabIndex={0}
    >
      {/* Player label */}
      <div
        className={`absolute ${isPortrait ? 'top-8 rotate-180' : 'bottom-8'} text-white text-player-label font-bold drop-shadow-lg`}
      >
        {playerLabel}
      </div>

      {/* Active state overlay */}
      {isPressing && (
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      )}

      {/* Hold progress indicator */}
      {showProgress && holdProgress < 1 && (
        <ProgressCircle progress={Math.max(PROGRESS_THRESHOLD.MIN_VISIBLE, holdProgress)} rotate={isPortrait} />
      )}

      {/* Score display */}
      <div className={isPortrait ? 'rotate-180' : ''}>
        <span
          id={scoreId}
          className={`text-white text-score font-bold pointer-events-none ${scoreChanged ? 'animate-scoreIncrement' : ''}`}
        >
          {score}
        </span>
      </div>
    </button>
  );
}
