import { motion } from 'framer-motion';
import { Check, X, Clock, MoreVertical } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressRing from '../ui/ProgressRing';
import { SUBJECT_TYPE_LABELS } from '../../utils/constants';

export default function SubjectCard({
  subject,
  onQuickMark,
  onViewDetails,
  index = 0,
}) {
  const {
    name,
    type,
    percent = 0,
    present = 0,
    total = 0,
    absent = 0,
    status = 'safe',
    statusMessage = '',
    bunksLeft = 0,
    classesNeeded: needed = 0,
    teacherName,
  } = subject;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card variant={status} hoverable className="relative group">
        <div className="flex items-start gap-4">
          {/* Progress Ring */}
          <ProgressRing
            percent={percent}
            status={status}
            size={72}
            strokeWidth={5}
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-heading font-semibold text-[var(--text-primary)] truncate">
                  {name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[var(--text-muted)]">
                    {SUBJECT_TYPE_LABELS[type] || 'Theory'}
                  </span>
                  {teacherName && (
                    <>
                      <span className="text-[var(--text-muted)]">·</span>
                      <span className="text-xs text-[var(--text-muted)] truncate">
                        {teacherName}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Badge variant={status} size="xs">
                {statusMessage}
              </Badge>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mt-3">
              <div className="text-center">
                <p className="font-mono text-sm font-bold text-[var(--accent-green)]">
                  {present}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  Present
                </p>
              </div>
              <div className="text-center">
                <p className="font-mono text-sm font-bold text-[var(--accent-red)]">
                  {absent}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  Absent
                </p>
              </div>
              <div className="text-center">
                <p className="font-mono text-sm font-bold text-[var(--text-primary)]">
                  {total}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  Total
                </p>
              </div>
              <div className="ml-auto text-right">
                {status === 'safe' ? (
                  <div>
                    <p className="font-mono text-sm font-bold text-[var(--accent-green)]">
                      {bunksLeft}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      Can Bunk
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-mono text-sm font-bold text-[var(--accent-red)]">
                      {needed}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      Need to Attend
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Mark Buttons */}
            {onQuickMark && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border-default)]">
                <button
                  onClick={() => onQuickMark(subject.id, 'present')}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs
                    bg-[var(--accent-green)]/10 text-[var(--accent-green)]
                    hover:bg-[var(--accent-green)]/20 transition-colors"
                >
                  <Check size={12} /> Present
                </button>
                <button
                  onClick={() => onQuickMark(subject.id, 'absent')}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs
                    bg-[var(--accent-red)]/10 text-[var(--accent-red)]
                    hover:bg-[var(--accent-red)]/20 transition-colors"
                >
                  <X size={12} /> Absent
                </button>
                <button
                  onClick={() => onQuickMark(subject.id, 'medical')}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs
                    bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)]
                    hover:bg-[var(--accent-yellow)]/20 transition-colors"
                >
                  <Clock size={12} /> Medical
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
