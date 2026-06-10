import { motion } from 'framer-motion';
import { Shield, Flame, Trophy, Target } from 'lucide-react';
import Card from '../ui/Card';
import AnimatedCounter from '../ui/AnimatedCounter';

export default function OverallStats({
  overallStats,
  risk,
  milestone,
  currentStreak,
  longestStreak,
}) {
  const {
    totalPresent = 0,
    totalClasses = 0,
    totalAbsent = 0,
    overallPercent = 0,
    overallStatus = 'safe',
    subjectCount = 0,
  } = overallStats || {};

  const riskColors = {
    SAFE: 'var(--accent-green)',
    CAUTION: 'var(--accent-yellow)',
    WARNING: 'var(--accent-yellow)',
    'DETAINED RISK': 'var(--accent-red)',
    'NO DATA': 'var(--text-muted)',
  };

  const riskColor = riskColors[risk?.riskLabel] || 'var(--text-muted)';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Percentage */}
      <Card glow className="text-center">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Overall Attendance
        </p>
        <AnimatedCounter
          value={overallPercent}
          className="text-4xl"
          style={{ color: riskColor }}
        />
        <div className="flex items-center justify-center gap-4 mt-3">
          <div>
            <span className="font-mono text-sm font-bold text-[var(--accent-green)]">
              {totalPresent}
            </span>
            <span className="text-xs text-[var(--text-muted)] ml-1">present</span>
          </div>
          <div className="w-px h-4 bg-[var(--border-default)]" />
          <div>
            <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
              {totalClasses}
            </span>
            <span className="text-xs text-[var(--text-muted)] ml-1">total</span>
          </div>
        </div>
      </Card>

      {/* Detention Risk Meter */}
      <Card className="text-center">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Detention Risk
        </p>
        <div className="relative w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden mt-4 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${risk?.riskLevel || 0}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, var(--accent-green), var(--accent-yellow), var(--accent-red))`,
            }}
          />
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: `${risk?.riskLevel || 0}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[var(--bg-card)]"
            style={{ background: riskColor }}
          />
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <Shield size={14} style={{ color: riskColor }} />
          <span
            className="font-mono text-sm font-bold"
            style={{ color: riskColor }}
          >
            {risk?.riskLabel || 'NO DATA'}
          </span>
        </div>
      </Card>

      {/* Streak */}
      <Card className="text-center">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Attendance Streak
        </p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Flame size={28} className="text-[var(--accent-yellow)]" />
          <span className="font-mono text-3xl font-bold text-[var(--text-primary)]">
            {currentStreak || 0}
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          days · Best: {longestStreak || 0}
        </p>
      </Card>

      {/* Bunk Milestone */}
      <Card className="text-center">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Bunk Status
        </p>
        <div className="flex items-center justify-center mt-2">
          <span className="text-3xl">{milestone?.emoji || '📚'}</span>
        </div>
        <p className="text-sm font-medium text-[var(--text-primary)] mt-1">
          {milestone?.label || 'Perfect Attendance'}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          {totalAbsent} classes bunked
        </p>
      </Card>
    </div>
  );
}
