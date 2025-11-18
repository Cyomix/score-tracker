interface ProgressCircleProps {
  progress: number;
  rotate?: boolean;
}

export function ProgressCircle({ progress, rotate = false }: ProgressCircleProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg className={`w-32 h-32 ${rotate ? 'rotate-180' : ''}`} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth="8"
          opacity="0.3"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
    </div>
  );
}
