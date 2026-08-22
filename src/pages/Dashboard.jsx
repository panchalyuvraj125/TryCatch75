import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Calendar,
  ArrowRight,
  AlertTriangle,
  Flame,
  Target,
  ChevronRight,
  MapPin,
  User,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getOverallAttendance,
  getAttendanceForCourse,
  getTodayClasses,
  calculateSafeBunks,
  calculateClassesNeeded,
} from '../utils/storage';
import { getNextClass, getCurrentClass, enrichClassWithMetadata, DAY_NAMES } from '../utils/timetableData';
import OverrideModal from '../components/OverrideModal';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getHealthStatus(pct) {
  if (pct >= 85) return { label: 'Excellent', className: 'badge-success', icon: '🎯' };
  if (pct >= 75) return { label: 'Good', className: 'badge-accent', icon: '✅' };
  if (pct >= 65) return { label: 'Needs Attention', className: 'badge-warning', icon: '⚠️' };
  return { label: 'Critical', className: 'badge-danger', icon: '🚨' };
}

function getStatusColor(pct, min = 75) {
  if (pct >= min + 10) return 'var(--success)';
  if (pct >= min) return 'var(--accent)';
  if (pct >= min - 10) return 'var(--warning)';
  return 'var(--danger)';
}

export default function Dashboard() {
  const { state, update } = useApp();
  const navigate = useNavigate();
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const overall = getOverallAttendance(state);
  const todayClasses = getTodayClasses(state);
  const nextClass = useMemo(() => getNextClass(state), [state]);
  const currentClass = useMemo(() => getCurrentClass(state), [state]);
  const health = getHealthStatus(overall.percentage);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const todayISO = today.toISOString().slice(0, 10);
  const firstName = state.personalInfo?.name?.split(' ')[0] || '';

  // Sort subjects by attendance (lowest first) for attention section
  const sortedCourses = useMemo(() => {
    return state.courses
      .map(c => ({ ...c, stats: getAttendanceForCourse(state, c.id) }))
      .sort((a, b) => a.stats.percentage - b.stats.percentage);
  }, [state]);

  const coursesNeedingAttention = sortedCourses.filter(c => c.stats.total > 0 && c.stats.percentage < 75);

  // Attendance streak
  const streak = useMemo(() => {
    const logs = [...state.attendanceLog]
      .filter(l => l.status !== 'cancelled')
      .sort((a, b) => b.date.localeCompare(a.date));
    
    let currentStreak = 0;
    let lastDate = null;
    
    for (const log of logs) {
      if (log.status === 'absent') break;
      if (log.status === 'present') {
        if (!lastDate || log.date === lastDate) {
          currentStreak++;
          lastDate = log.date;
        } else if (log.date < lastDate) {
          currentStreak++;
          lastDate = log.date;
        }
      }
    }
    return currentStreak;
  }, [state.attendanceLog]);

  // Quick attendance marking
  const markQuick = (courseId, period, status) => {
    const logs = [...state.attendanceLog];
    const idx = logs.findIndex(
      l => l.date === todayISO && l.courseId === courseId && l.period === period
    );
    if (idx >= 0) {
      if (logs[idx].status === status) {
        logs.splice(idx, 1);
      } else {
        logs[idx] = { ...logs[idx], status };
      }
    } else {
      logs.push({ date: todayISO, courseId, period, status });
    }
    update({ attendanceLog: logs });
  };

  const getLogStatus = (courseId, period) => {
    return state.attendanceLog.find(
      l => l.date === todayISO && l.courseId === courseId && l.period === period
    )?.status || null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Greeting */}
        <motion.div variants={fadeUp} className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            {getGreeting()}{firstName ? `, ${firstName}` : ''}
          </h2>
          <p className="text-sm text-text-muted mt-0.5">{dateStr}</p>
        </motion.div>

        {/* Overall Stats Row */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {/* Overall % Card */}
          <div className="card p-4 sm:col-span-2 flex items-center gap-4">
            <div className="relative w-14 h-14 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--bg-tertiary)"
                  strokeWidth="3"
                />
                <motion.path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={getStatusColor(overall.percentage)}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 100' }}
                  animate={{ strokeDasharray: `${overall.percentage} 100` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-bold tabular-nums">{overall.percentage}%</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Overall</p>
              <p className="text-2xl font-bold tracking-tight tabular-nums">{overall.percentage}%</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`badge ${health.className}`}>{health.label}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="stat-card items-center text-center">
            <CheckCircle2 className="w-4 h-4 mb-0.5" style={{ color: 'var(--success)' }} />
            <span className="stat-card-value tabular-nums">{overall.attended}</span>
            <span className="stat-card-label">Present</span>
          </div>
          <div className="stat-card items-center text-center">
            <XCircle className="w-4 h-4 mb-0.5" style={{ color: 'var(--danger)' }} />
            <span className="stat-card-value tabular-nums">{overall.missed}</span>
            <span className="stat-card-label">Missed</span>
          </div>
        </motion.div>

        {/* Streak + Quick Info Row */}
        {(streak > 2 || overall.total > 0) && (
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-5">
            {streak > 2 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary border border-border">
                <Flame className="w-4 h-4 text-warning" />
                <span className="text-xs font-medium">{streak} class streak</span>
              </div>
            )}
            {overall.total > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary border border-border">
                <Target className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium tabular-nums">{overall.total} total classes</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Low Attendance Alerts */}
        {coursesNeedingAttention.length > 0 && (
          <motion.div variants={fadeUp} className="mb-5 space-y-2">
            {coursesNeedingAttention.slice(0, 3).map(c => {
              const needed = calculateClassesNeeded(c.stats.attended, c.stats.total, c.minAttendance);
              return (
                <div key={c.id} className="alert alert-warning">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">{c.name}</span> is at {c.stats.percentage}%.
                    {needed > 0 && <span> Attend {needed} more {needed === 1 ? 'class' : 'classes'} to reach {c.minAttendance}%.</span>}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Next / Current Class Card */}
        {(currentClass || nextClass) && (
          <motion.div variants={fadeUp} className="mb-5">
            <div className="card p-4 border-l-4" style={{ borderLeftColor: (currentClass || nextClass).course.color }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: currentClass ? 'var(--success)' : 'var(--accent)' }}>
                    {currentClass ? '● Now' : 'Next Class'}
                    {nextClass && !nextClass.isToday && !currentClass && (
                      <span className="text-text-muted ml-1 normal-case tracking-normal font-medium">
                        · {DAY_NAMES[nextClass.day]}
                      </span>
                    )}
                  </p>
                  <p className="text-sm font-semibold">{(currentClass || nextClass).course.name}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {(currentClass || nextClass).time.start} – {(currentClass || nextClass).time.end}
                    </span>
                    {(currentClass || nextClass).metadata?.teacher && (
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {(currentClass || nextClass).metadata.teacher}
                      </span>
                    )}
                    {(currentClass || nextClass).metadata?.location && (
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {(currentClass || nextClass).metadata.location}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => navigate('/mark')}
                  className="btn btn-sm btn-secondary"
                >
                  Mark <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Today's Classes */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-header mb-0">
              <Calendar className="w-4 h-4" />
              Today's Classes
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOverrideModal(true)}
                className="btn btn-sm btn-ghost text-text-muted"
              >
                Edit
              </button>
              <button
                onClick={() => navigate('/mark')}
                className="btn btn-sm btn-ghost text-accent"
              >
                Mark All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          {todayClasses.length > 0 ? (
            <div className="space-y-2">
              {todayClasses.map(({ period, course, time }) => {
                const log = getLogStatus(course.id, period);
                const meta = enrichClassWithMetadata(
                  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][today.getDay()],
                  period
                );

                return (
                  <div key={`${course.id}-${period}`} className="card p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-1.5 h-10 rounded-full shrink-0"
                        style={{ backgroundColor: course.color }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{course.name}</p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="text-[11px] text-text-muted font-mono">
                            {time.start}–{time.end}
                          </span>
                          {meta?.teacher && (
                            <span className="text-[11px] text-text-muted">
                              {meta.teacher}
                            </span>
                          )}
                          {meta?.location && (
                            <span className="text-[11px] text-text-muted">
                              · {meta.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {log ? (
                        <span
                          className={`badge ${
                            log === 'present' ? 'badge-success' :
                            log === 'absent' ? 'badge-danger' :
                            'badge-muted'
                          }`}
                        >
                          {log}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => markQuick(course.id, period, 'present')}
                            className="btn btn-sm btn-icon"
                            style={{ background: 'var(--success-soft)', color: 'var(--success)' }}
                            title="Mark Present"
                            aria-label={`Mark ${course.name} present`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => markQuick(course.id, period, 'absent')}
                            className="btn btn-sm btn-icon"
                            style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}
                            title="Mark Absent"
                            aria-label={`Mark ${course.name} absent`}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Clock className="w-6 h-6 text-text-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm text-text-muted">No classes scheduled for today</p>
            </div>
          )}
        </motion.div>

        {/* Subject Health + Attendance */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-header mb-0">
              <BookOpen className="w-4 h-4" />
              Subjects
            </h3>
            <button
              onClick={() => navigate('/analytics')}
              className="btn btn-sm btn-ghost text-text-muted"
            >
              View Analytics <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {sortedCourses.length > 0 ? (
            <div className="space-y-2">
              {sortedCourses.map((course) => {
                const { stats } = course;
                const safeBunks = calculateSafeBunks(stats.attended, stats.total, course.minAttendance);
                const needed = calculateClassesNeeded(stats.attended, stats.total, course.minAttendance);
                const statusColor = getStatusColor(stats.percentage, course.minAttendance);

                return (
                  <div key={course.id} className="card p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="text-sm font-medium truncate">{course.name}</span>
                      </div>
                      <span
                        className="text-sm font-bold tabular-nums shrink-0"
                        style={{ color: statusColor }}
                      >
                        {stats.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-bg-tertiary rounded-full relative overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: statusColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(stats.percentage, 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-[11px] text-text-muted tabular-nums">
                        {stats.attended}/{stats.total} attended · {stats.missed} missed
                      </p>
                      {stats.total > 0 && (
                        <p className="text-[11px] font-medium" style={{ color: statusColor }}>
                          {stats.percentage >= course.minAttendance
                            ? safeBunks > 0 ? `Can skip ${safeBunks}` : 'At limit'
                            : `Need ${needed} more`
                          }
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-sm text-text-muted">
                No courses set up yet.{' '}
                <button
                  onClick={() => navigate('/setup')}
                  className="text-accent hover:underline cursor-pointer"
                >
                  Go to Setup
                </button>
              </p>
            </div>
          )}
        </motion.div>

        {/* Smart Tips */}
        {overall.total > 5 && (
          <motion.div variants={fadeUp} className="mt-5">
            <div className="card p-4 flex items-start gap-3">
              <Zap className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-text-secondary mb-0.5">Attendance Insight</p>
                <p className="text-xs text-text-muted">
                  {overall.percentage >= 85
                    ? `Great work! Your attendance is well above the 75% target. You have room to miss some classes if needed.`
                    : overall.percentage >= 75
                    ? `Your attendance is above the minimum. Keep it up to maintain your standing.`
                    : overall.percentage >= 65
                    ? `Your attendance needs attention. Try to attend consistently for the next few weeks.`
                    : `Your attendance is critically low. Focus on attending every class to recover.`
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <OverrideModal
        isOpen={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        dateStr={todayISO}
      />
    </div>
  );
}
