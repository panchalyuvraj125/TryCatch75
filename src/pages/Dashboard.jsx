import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getOverallAttendance,
  getAttendanceForCourse,
  getTodayClasses,
} from '../utils/storage';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const overall = getOverallAttendance(state);
  const todayClasses = getTodayClasses(state);

  const getStatusColor = (pct, min = 75) => {
    if (pct >= min + 10) return 'var(--success)';
    if (pct >= min) return 'var(--warning)';
    return 'var(--danger)';
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const dayName = days[today.getDay()];
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-text-muted mt-1">
          {dayName}, {dateStr}
        </p>
      </motion.div>

      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Overall Stats Row */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* Overall % */}
          <div className="card p-4 sm:col-span-2 flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
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
                <span className="text-lg font-bold">{overall.percentage}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">Overall Attendance</p>
              <p className="text-2xl font-bold tracking-tight">{overall.percentage}%</p>
              <p className="text-[11px] text-text-muted mt-0.5">
                {overall.attended} of {overall.total} classes
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-5 h-5 mb-1" style={{ color: 'var(--success)' }} />
            <p className="text-xl font-bold">{overall.attended}</p>
            <p className="text-[10px] text-text-muted font-medium">Present</p>
          </div>
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <XCircle className="w-5 h-5 mb-1" style={{ color: 'var(--danger)' }} />
            <p className="text-xl font-bold">{overall.missed}</p>
            <p className="text-[10px] text-text-muted font-medium">Missed</p>
          </div>
        </motion.div>

        {/* Today's Classes */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Today's Classes
            </h3>
            <button
              onClick={() => navigate('/mark')}
              className="text-xs text-accent hover:text-accent-hover font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              Mark Attendance <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {todayClasses.length > 0 ? (
            <div className="space-y-2">
              {todayClasses.map(({ period, course, time }) => {
                const todayStr = new Date().toISOString().slice(0, 10);
                const log = state.attendanceLog.find(
                  (l) => l.date === todayStr && l.courseId === course.id && l.period === period
                );
                return (
                  <div key={period} className="card p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-8 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <div>
                        <p className="text-sm font-medium">{course.name}</p>
                        <p className="text-[11px] text-text-muted font-mono">
                          {course.code} • P{period + 1} • {time.start}–{time.end}
                        </p>
                      </div>
                    </div>
                    {log && (
                      <span
                        className="text-[10px] font-semibold uppercase px-2 py-1 rounded-md"
                        style={{
                          color:
                            log.status === 'present'
                              ? 'var(--success)'
                              : log.status === 'absent'
                              ? 'var(--danger)'
                              : 'var(--text-muted)',
                          backgroundColor:
                            log.status === 'present'
                              ? 'rgba(0, 200, 83, 0.1)'
                              : log.status === 'absent'
                              ? 'rgba(255, 71, 87, 0.1)'
                              : 'var(--bg-tertiary)',
                        }}
                      >
                        {log.status}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-6 text-center">
              <Clock className="w-6 h-6 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">No classes scheduled for today</p>
            </div>
          )}
        </motion.div>

        {/* Subject-wise Attendance */}
        <motion.div variants={fadeUp}>
          <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Subject-wise Attendance
          </h3>
          {state.courses.length > 0 ? (
            <div className="space-y-2">
              {state.courses.map((course) => {
                const stats = getAttendanceForCourse(state, course.id);
                return (
                  <div key={course.id} className="card p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="text-sm font-medium truncate">{course.name}</span>
                        <span className="text-[10px] font-mono text-text-muted">{course.code}</span>
                      </div>
                      <span
                        className="text-sm font-bold shrink-0"
                        style={{ color: getStatusColor(stats.percentage, course.minAttendance) }}
                      >
                        {stats.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-bg-tertiary rounded-full relative">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: getStatusColor(stats.percentage, course.minAttendance) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      />
                      {(course.goalAttendance || 85) > 0 && (
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-text-primary/50"
                          style={{ left: `${course.goalAttendance || 85}%` }}
                          title={`Goal: ${course.goalAttendance || 85}%`}
                        />
                      )}
                    </div>
                    <p className="text-[10px] text-text-muted mt-1.5">
                      {stats.attended}/{stats.total} attended • {stats.missed} missed
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-6 text-center">
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
      </motion.div>
    </div>
  );
}
