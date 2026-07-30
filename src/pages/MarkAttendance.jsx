import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, MinusCircle, CalendarDays, CheckCheck, XOctagon, Undo2, Redo2, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getClassesForDate } from '../utils/storage';
import { showToast } from '../components/ui/Toast';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function MarkAttendance() {
  const { state, update } = useApp();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  
  const [history, setHistory] = useState(() => [{ logs: state.attendanceLog, desc: 'Initial state' }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [editingNote, setEditingNote] = useState(null);

  const classes = useMemo(() => getClassesForDate(state, selectedDate), [state, selectedDate]);

  const getLogStatus = (courseId, period) => {
    const log = state.attendanceLog.find(
      (l) => l.date === selectedDate && l.courseId === courseId && l.period === period
    );
    return log?.status || null;
  };

  const getLogNote = (courseId, period) => {
    const log = state.attendanceLog.find(
      (l) => l.date === selectedDate && l.courseId === courseId && l.period === period
    );
    return log?.note || '';
  };

  const commitChange = (newLogs, desc) => {
    update({ attendanceLog: newLogs });
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ logs: newLogs, desc });
    if (newHistory.length > 20) {
      newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(19);
    } else {
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      update({ attendanceLog: history[newIndex].logs });
      showToast(`Undone: ${history[historyIndex].desc}`, 'info');
    }
  }, [historyIndex, history, update]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      update({ attendanceLog: history[newIndex].logs });
      showToast(`Redone: ${history[newIndex].desc}`, 'info');
    }
  }, [historyIndex, history, update]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        redo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const markStatus = (courseId, period, status) => {
    const logs = [...state.attendanceLog];
    const idx = logs.findIndex(
      (l) => l.date === selectedDate && l.courseId === courseId && l.period === period
    );

    let actionDesc = '';
    const courseCode = classes.find(c => c.course.id === courseId)?.course.code || 'Course';

    if (idx >= 0) {
      if (logs[idx].status === status) {
        logs.splice(idx, 1);
        actionDesc = `${courseCode} P${period + 1} cleared`;
      } else {
        actionDesc = `${courseCode} P${period + 1} ${logs[idx].status} → ${status}`;
        logs[idx] = { ...logs[idx], status };
      }
    } else {
      logs.push({ date: selectedDate, courseId, period, status });
      actionDesc = `${courseCode} P${period + 1} marked ${status}`;
    }

    commitChange(logs, actionDesc);
  };

  const saveNote = (courseId, period, note) => {
    const logs = [...state.attendanceLog];
    const idx = logs.findIndex(
      (l) => l.date === selectedDate && l.courseId === courseId && l.period === period
    );

    const courseCode = classes.find(c => c.course.id === courseId)?.course.code || 'Course';

    if (idx >= 0) {
      logs[idx] = { ...logs[idx], note };
      commitChange(logs, `${courseCode} P${period + 1} note updated`);
    } else {
      logs.push({ date: selectedDate, courseId, period, status: 'present', note });
      commitChange(logs, `${courseCode} P${period + 1} marked present with note`);
    }
    setEditingNote(null);
  };

  const bulkMark = (status) => {
    const logs = state.attendanceLog.filter(
      (l) => !(l.date === selectedDate && classes.some((c) => c.course.id === l.courseId && c.period === l.period))
    );
    classes.forEach(({ course, period }) => {
      logs.push({ date: selectedDate, courseId: course.id, period, status });
    });
    commitChange(logs, `Marked all ${status} for ${selectedDate}`);
    showToast(`All classes marked as ${status}`, 'success');
  };

  const statusBtn = (courseId, period, status, icon, label, activeColor) => {
    const current = getLogStatus(courseId, period);
    const isActive = current === status;
    return (
      <button
        onClick={() => markStatus(courseId, period, status)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
          isActive
            ? 'text-white'
            : 'text-text-secondary bg-bg-tertiary hover:bg-bg-elevated'
        }`}
        style={isActive ? { backgroundColor: activeColor } : {}}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight mb-1">Mark Attendance</h2>
          <p className="text-xs text-text-muted">
            Select a date and mark attendance for each class.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className={`p-2 rounded-lg transition-all ${historyIndex > 0 ? 'bg-bg-tertiary hover:bg-bg-elevated text-text-primary cursor-pointer' : 'bg-transparent text-text-muted opacity-50 cursor-not-allowed'}`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded-lg transition-all ${historyIndex < history.length - 1 ? 'bg-bg-tertiary hover:bg-bg-elevated text-text-primary cursor-pointer' : 'bg-transparent text-text-muted opacity-50 cursor-not-allowed'}`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Date Picker */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="card p-4 mb-6">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-4 h-4 text-text-muted" />
          <label className="text-xs font-medium text-text-muted">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="!w-auto"
          />
        </div>
      </motion.div>

      {/* Bulk Actions */}
      {classes.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex gap-2 mb-4"
        >
          <button
            onClick={() => bulkMark('present')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-bg-tertiary hover:bg-bg-elevated text-text-secondary transition-all cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} />
            Mark All Present
          </button>
          <button
            onClick={() => bulkMark('absent')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-bg-tertiary hover:bg-bg-elevated text-text-secondary transition-all cursor-pointer"
          >
            <XOctagon className="w-3.5 h-3.5" style={{ color: 'var(--danger)' }} />
            Mark All Absent
          </button>
        </motion.div>
      )}

      {/* Class List */}
      {classes.length > 0 ? (
        <div className="space-y-2">
          {classes.map(({ period, course, time }, i) => (
            <motion.div
              key={`${course.id}-${period}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="card p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-10 rounded-full shrink-0"
                  style={{ backgroundColor: course.color }}
                />
                <div>
                  <p className="text-sm font-medium">{course.name}</p>
                  <p className="text-[11px] text-text-muted font-mono">
                    {course.code} • P{period + 1} • {time.start}–{time.end}
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5 sm:gap-2">
                {statusBtn(
                  course.id,
                  period,
                  'present',
                  <CheckCircle2 className="w-3.5 h-3.5" />,
                  'Present',
                  'var(--success)'
                )}
                {statusBtn(
                  course.id,
                  period,
                  'absent',
                  <XCircle className="w-3.5 h-3.5" />,
                  'Absent',
                  'var(--danger)'
                )}
                {statusBtn(
                  course.id,
                  period,
                  'cancelled',
                  <MinusCircle className="w-3.5 h-3.5" />,
                  'Cancelled',
                  'var(--text-muted)'
                )}
                <button
                  onClick={() => setEditingNote(editingNote?.courseId === course.id && editingNote?.period === period ? null : { courseId: course.id, period })}
                  className={`p-1.5 rounded-lg transition-all ${getLogNote(course.id, period) ? 'text-accent bg-accent/10' : 'text-text-secondary hover:bg-bg-elevated'}`}
                  title="Add Note"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
              {editingNote?.courseId === course.id && editingNote?.period === period && (
                <div className="w-full mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    defaultValue={getLogNote(course.id, period)}
                    placeholder="Add a remark (e.g., Late, Proxy)"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveNote(course.id, period, e.target.value);
                      if (e.key === 'Escape') setEditingNote(null);
                    }}
                    onBlur={(e) => saveNote(course.id, period, e.target.value)}
                  />
                </div>
              )}
              {getLogNote(course.id, period) && !(editingNote?.courseId === course.id && editingNote?.period === period) && (
                <div className="w-full mt-2 text-xs text-text-muted bg-bg-tertiary p-2 rounded border border-border">
                  <span className="font-semibold text-text-secondary mr-1">Note:</span>
                  {getLogNote(course.id, period)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card p-8 sm:p-12 text-center">
          <CalendarDays className="w-8 h-8 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold mb-1">No classes scheduled</h3>
          <p className="text-sm text-text-muted">
            There are no classes in your timetable for this day.
          </p>
        </div>
      )}
    </div>
  );
}
