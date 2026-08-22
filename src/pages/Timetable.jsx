import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarClock,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

import {
  FULL_TIMETABLE_METADATA,
  AM2_SCHEDULE,
  DAY_NAMES,
  getNextClass,
  getCurrentClass,
} from '../utils/timetableData';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export default function Timetable() {
  const { state, update } = useApp();
  const todayDayIdx = new Date().getDay();
  const todayDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][todayDayIdx];
  const todayISO = new Date().toISOString().slice(0, 10);
  const [selectedDay, setSelectedDay] = useState(todayDay);

  const _nextClass = useMemo(() => getNextClass(state), [state]);
  const currentClass = useMemo(() => getCurrentClass(state), [state]);

  // Get classes for the selected day
  const dayClasses = useMemo(() => {
    const daySchedule = state.timetable?.[selectedDay] || {};
    const classes = [];

    Object.entries(daySchedule).forEach(([period, courseId]) => {
      if (courseId) {
        const course = state.courses.find(c => c.id === courseId);
        const time = state.periodTimes[parseInt(period)];
        const meta = FULL_TIMETABLE_METADATA[selectedDay]?.[parseInt(period)];
        if (course) {
          classes.push({
            period: parseInt(period),
            course,
            time,
            teacher: meta?.teacher || '',
            location: meta?.location || '',
            batch: meta?.batch || '',
          });
        }
      }
    });

    return classes.sort((a, b) => a.period - b.period);
  }, [state, selectedDay]);

  // AM2 specific classes for selected day
  const am2Classes = AM2_SCHEDULE[selectedDay] || [];

  // Quick attendance
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

  const isToday = selectedDay === todayDay;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-accent" />
            Timetable
          </h2>
          <p className="text-sm text-text-muted mt-0.5">
            S.Y.B.Tech CSE-AIML · Semester III · AM2 Batch
          </p>
        </motion.div>

        {/* Day Selector */}
        <motion.div variants={fadeUp} className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-accent text-white'
                  : day === todayDay
                  ? 'bg-accent/10 text-accent border border-accent/30'
                  : 'bg-bg-secondary text-text-secondary border border-border hover:bg-bg-tertiary'
              }`}
              aria-label={DAY_NAMES[day]}
              aria-current={selectedDay === day ? 'true' : undefined}
            >
              {DAY_NAMES[day]}
              {day === todayDay && selectedDay !== day && (
                <span className="ml-1 text-[9px]">●</span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Desktop Timetable Grid */}
        <motion.div variants={fadeUp} className="hidden sm:block mb-6">
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[11px] font-mono text-text-muted uppercase tracking-wider p-3 w-16">
                      Period
                    </th>
                    <th className="text-left text-[11px] font-mono text-text-muted uppercase tracking-wider p-3">
                      Time
                    </th>
                    <th className="text-left text-[11px] font-mono text-text-muted uppercase tracking-wider p-3">
                      Subject
                    </th>
                    <th className="text-left text-[11px] font-mono text-text-muted uppercase tracking-wider p-3">
                      Teacher
                    </th>
                    <th className="text-left text-[11px] font-mono text-text-muted uppercase tracking-wider p-3">
                      Location
                    </th>
                    {isToday && (
                      <th className="text-right text-[11px] font-mono text-text-muted uppercase tracking-wider p-3 w-24">
                        Attendance
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dayClasses.length > 0 ? (
                    dayClasses.map(({ period, course, time, teacher, location }) => {
                      const log = isToday ? getLogStatus(course.id, period) : null;
                      const isCurrent = isToday && currentClass?.period === period;
                      
                      return (
                        <tr
                          key={`${course.id}-${period}`}
                          className={`border-b border-border last:border-b-0 transition-colors ${
                            isCurrent ? 'bg-accent/5' : 'hover:bg-bg-tertiary/50'
                          }`}
                        >
                          <td className="p-3">
                            <span className="text-xs font-mono text-text-muted">P{period + 1}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-xs font-mono text-text-secondary tabular-nums">
                              {time?.start || '—'} – {time?.end || '—'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: course.color }}
                              />
                              <div>
                                <span className="text-sm font-medium">{course.name}</span>
                                {isCurrent && (
                                  <span className="ml-2 badge badge-success">Now</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-xs text-text-muted">{teacher || '—'}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-xs text-text-muted">{location || '—'}</span>
                          </td>
                          {isToday && (
                            <td className="p-3 text-right">
                              {log ? (
                                <span className={`badge ${
                                  log === 'present' ? 'badge-success' :
                                  log === 'absent' ? 'badge-danger' :
                                  'badge-muted'
                                }`}>
                                  {log}
                                </span>
                              ) : (
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => markQuick(course.id, period, 'present')}
                                    className="btn btn-sm btn-icon"
                                    style={{ background: 'var(--success-soft)', color: 'var(--success)' }}
                                    title="Present"
                                    aria-label={`Mark ${course.name} present`}
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => markQuick(course.id, period, 'absent')}
                                    className="btn btn-sm btn-icon"
                                    style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}
                                    title="Absent"
                                    aria-label={`Mark ${course.name} absent`}
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={isToday ? 6 : 5} className="p-8 text-center text-sm text-text-muted">
                        No classes scheduled for {DAY_NAMES[selectedDay]}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Mobile Timeline View */}
        <motion.div variants={fadeUp} className="sm:hidden mb-6">
          {dayClasses.length > 0 ? (
            <div className="space-y-2">
              {dayClasses.map(({ period, course, time, teacher, location }) => {
                const log = isToday ? getLogStatus(course.id, period) : null;
                const isCurrent = isToday && currentClass?.period === period;

                return (
                  <div
                    key={`${course.id}-${period}`}
                    className={`card p-3 border-l-3 ${isCurrent ? 'border-l-accent' : ''}`}
                    style={!isCurrent ? { borderLeftColor: course.color } : {}}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium truncate">{course.name}</span>
                          {isCurrent && <span className="badge badge-success">Now</span>}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span className="font-mono tabular-nums">{time?.start}–{time?.end}</span>
                            <span>· P{period + 1}</span>
                          </div>
                          {teacher && (
                            <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                              <User className="w-3 h-3 shrink-0" />
                              <span>{teacher}</span>
                            </div>
                          )}
                          {location && (
                            <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span>{location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {isToday && (
                        <div className="shrink-0">
                          {log ? (
                            <span className={`badge ${
                              log === 'present' ? 'badge-success' :
                              log === 'absent' ? 'badge-danger' :
                              'badge-muted'
                            }`}>
                              {log}
                            </span>
                          ) : (
                            <div className="flex gap-1">
                              <button
                                onClick={() => markQuick(course.id, period, 'present')}
                                className="btn btn-sm btn-icon"
                                style={{ background: 'var(--success-soft)', color: 'var(--success)' }}
                                aria-label="Present"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => markQuick(course.id, period, 'absent')}
                                className="btn btn-sm btn-icon"
                                style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}
                                aria-label="Absent"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <CalendarClock className="w-6 h-6 text-text-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm text-text-muted">No classes on {DAY_NAMES[selectedDay]}</p>
            </div>
          )}
        </motion.div>

        {/* AM2 Batch-Specific Schedule Reference */}
        {am2Classes.length > 0 && (
          <motion.div variants={fadeUp}>
            <h3 className="section-header">
              <span className="badge badge-accent">AM2</span>
              Batch-Specific Classes
            </h3>
            <div className="space-y-2">
              {am2Classes.map((cls, i) => (
                <div key={i} className="card p-3 border-l-3 border-l-accent">
                  <p className="text-sm font-medium">{cls.subject}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-[11px] text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {cls.startTime} – {cls.endTime}
                    </span>
                    <span className="text-[11px] text-text-muted flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {cls.teacher}
                    </span>
                    <span className="text-[11px] text-text-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {cls.location}
                    </span>
                    <span className="badge badge-muted">{cls.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
