import { motion } from 'framer-motion';
import { Calculator, TrendingUp, TrendingDown, AlertTriangle, PartyPopper } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAttendanceForCourse, calculateSafeBunks, calculateClassesNeeded } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function BunkCalculator() {
  const { state } = useApp();
  const navigate = useNavigate();

  const getStatusColor = (pct, min) => {
    if (pct >= min + 10) return 'var(--success)';
    if (pct >= min) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Bunk Calculator
        </h2>
        <p className="text-xs text-text-muted mt-1">
          See how many classes you can safely skip — or need to attend.
        </p>
      </motion.div>

      {state.courses.length > 0 ? (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          {state.courses.map((course) => {
            const stats = getAttendanceForCourse(state, course.id);
            const safeBunks = calculateSafeBunks(stats.attended, stats.total, course.minAttendance);
            const classesNeeded = calculateClassesNeeded(stats.attended, stats.total, course.minAttendance);
            const isAbove = stats.percentage >= course.minAttendance;
            const statusColor = getStatusColor(stats.percentage, course.minAttendance);

            return (
              <motion.div key={course.id} variants={fadeUp} className="card p-4 sm:p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: course.color }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{course.name}</p>
                      <p className="text-[10px] font-mono text-text-muted">{course.code}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold" style={{ color: statusColor }}>
                      {stats.percentage}%
                    </p>
                    <p className="text-[10px] text-text-muted">
                      Min: {course.minAttendance}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full h-2 bg-bg-tertiary rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: statusColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.percentage, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                  {/* Min threshold marker */}
                  <div
                    className="absolute top-0 h-full w-px bg-text-muted/50"
                    style={{ left: `${course.minAttendance}%` }}
                  />
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-[11px] text-text-muted mb-3">
                  <span>{stats.attended}/{stats.total} attended</span>
                  <span>{stats.missed} missed</span>
                </div>

                {/* Bunk Result */}
                {stats.total === 0 ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-bg-tertiary">
                    <AlertTriangle className="w-4 h-4 text-text-muted shrink-0" />
                    <p className="text-xs text-text-muted">
                      No classes recorded yet. Start marking attendance to see calculations.
                    </p>
                  </div>
                ) : isAbove ? (
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg"
                    style={{ backgroundColor: 'rgba(0, 200, 83, 0.08)' }}
                  >
                    <PartyPopper className="w-4 h-4 shrink-0" style={{ color: 'var(--success)' }} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
                        You can safely bunk {safeBunks} more {safeBunks === 1 ? 'class' : 'classes'}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        and still stay above {course.minAttendance}% attendance
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg"
                    style={{ backgroundColor: 'rgba(255, 71, 87, 0.08)' }}
                  >
                    <TrendingDown className="w-4 h-4 shrink-0" style={{ color: 'var(--danger)' }} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>
                        Attend {classesNeeded} consecutive {classesNeeded === 1 ? 'class' : 'classes'}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        to reach {course.minAttendance}% attendance
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Formula Reference */}
          <motion.div variants={fadeUp} className="card p-4 sm:p-5 mt-4">
            <h3 className="text-xs font-semibold text-text-secondary mb-2">How it works</h3>
            <div className="space-y-2 text-[11px] text-text-muted font-mono">
              <p>Attendance % = (Classes Attended / Total Classes Held) × 100</p>
              <p>Safe Bunks = classes you can skip while staying ≥ minimum %</p>
              <p>Classes Needed = consecutive classes to attend to reach minimum %</p>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <div className="card p-8 sm:p-12 text-center">
          <Calculator className="w-8 h-8 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold mb-1">No courses yet</h3>
          <p className="text-sm text-text-muted">
            Add courses in{' '}
            <button
              onClick={() => navigate('/setup')}
              className="text-accent hover:underline cursor-pointer"
            >
              Setup
            </button>{' '}
            to use the Bunk Calculator.
          </p>
        </div>
      )}
    </div>
  );
}
