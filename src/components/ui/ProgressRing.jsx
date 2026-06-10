import { useEffect, useRef } from 'react';

const statusColors = {
  safe: 'var(--accent-green)',
  danger: 'var(--accent-yellow)',
  critical: 'var(--accent-red)',
};

/**
 * Circular SVG progress ring
 * Animated stroke-dashoffset on mount
 */
export default function ProgressRing({
  percent = 0,
  size = 80,
  strokeWidth = 6,
  status = 'safe',
  showLabel = true,
  className = '',
}) {
  const circleRef = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clampedPercent / 100) * circumference;
  const color = statusColors[status] || statusColors.safe;

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    // Animate from full circumference to target offset
    circle.style.strokeDashoffset = circumference;
    requestAnimationFrame(() => {
      circle.style.transition = 'stroke-dashoffset 1s ease-out';
      circle.style.strokeDashoffset = offset;
    });
  }, [circumference, offset]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border-default)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      {showLabel && (
        <span
          className="absolute font-mono font-bold text-[var(--text-primary)]"
          style={{
            fontSize: size * 0.22,
            color,
          }}
        >
          {Math.round(clampedPercent)}%
        </span>
      )}
    </div>
  );
}
