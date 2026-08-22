import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  History as HistoryIcon,
  Search,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

export default function History() {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');

  // Get all unique months from logs
  const months = useMemo(() => {
    const monthSet = new Set();
    state.attendanceLog.forEach(log => {
      if (log.date) monthSet.add(log.date.slice(0, 7)); // YYYY-MM
    });
    return [...monthSet].sort().reverse();
  }, [state.attendanceLog]);

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    let logs = [...state.attendanceLog].sort((a, b) => {
      const dateComp = b.date.localeCompare(a.date);
      if (dateComp !== 0) return dateComp;
      return a.period - b.period;
    });

    // Status filter
    if (statusFilter !== 'all') {
      logs = logs.filter(l => l.status === statusFilter);
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      logs = logs.filter(l => l.courseId === subjectFilter);
    }

    // Month filter
    if (monthFilter !== 'all') {
      logs = logs.filter(l => l.date?.startsWith(monthFilter));
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      logs = logs.filter(l => {
        const course = state.courses.find(c => c.id === l.courseId);
        return (
          course?.name?.toLowerCase().includes(q) ||
          course?.code?.toLowerCase().includes(q) ||
          l.date?.includes(q) ||
          l.note?.toLowerCase().includes(q)
        );
      });
    }

    return logs;
  }, [state.attendanceLog, state.courses, statusFilter, subjectFilter, monthFilter, searchQuery]);

  // Group logs by date
  const groupedLogs = useMemo(() => {
    const groups = {};
    filteredLogs.forEach(log => {
      if (!groups[log.date]) groups[log.date] = [];
      groups[log.date].push(log);
    });
    return Object.entries(groups);
  }, [filteredLogs]);

  const statusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success)' }} />;
      case 'absent':
        return <XCircle className="w-4 h-4" style={{ color: 'var(--danger)' }} />;
      case 'cancelled':
        return <MinusCircle className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />;
      default:
        return null;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-5">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-accent" />
            Attendance History
          </h2>
          <p className="text-sm text-text-muted mt-0.5">
            {filteredLogs.length} {filteredLogs.length === 1 ? 'record' : 'records'}
            {statusFilter !== 'all' || subjectFilter !== 'all' || monthFilter !== 'all' ? ' (filtered)' : ''}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeUp} className="card p-3 sm:p-4 mb-5">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="search"
              placeholder="Search by subject, code, date, or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="!pl-9"
              aria-label="Search attendance history"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="!w-auto !h-8 text-xs"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="!w-auto !h-8 text-xs"
              aria-label="Filter by subject"
            >
              <option value="all">All Subjects</option>
              {state.courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="!w-auto !h-8 text-xs"
              aria-label="Filter by month"
            >
              <option value="all">All Months</option>
              {months.map(m => (
                <option key={m} value={m}>
                  {new Date(m + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>

            {(statusFilter !== 'all' || subjectFilter !== 'all' || monthFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSubjectFilter('all');
                  setMonthFilter('all');
                  setSearchQuery('');
                }}
                className="btn btn-sm btn-ghost text-text-muted"
              >
                Clear Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Log List */}
        {groupedLogs.length > 0 ? (
          <div className="space-y-4">
            {groupedLogs.map(([date, logs]) => (
              <motion.div key={date} variants={fadeUp}>
                {/* Date Header */}
                <div className="flex items-center gap-2 mb-2 px-1">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-xs font-semibold text-text-secondary">
                    {formatDate(date)}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono">
                    ({logs.length} {logs.length === 1 ? 'class' : 'classes'})
                  </span>
                </div>

                {/* Log Cards */}
                <div className="space-y-1.5">
                  {logs.map((log, idx) => {
                    const course = state.courses.find(c => c.id === log.courseId);
                    const time = state.periodTimes[log.period];

                    if (!course) return null;

                    return (
                      <div
                        key={`${log.date}-${log.courseId}-${log.period}-${idx}`}
                        className="card p-3 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0">{statusIcon(log.status)}</div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{course.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-text-muted font-mono">
                                P{log.period + 1}
                              </span>
                              {time && (
                                <span className="text-[11px] text-text-muted font-mono tabular-nums">
                                  {time.start}–{time.end}
                                </span>
                              )}
                              {log.note && (
                                <span className="text-[11px] text-accent">
                                  "{log.note}"
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`badge shrink-0 ${
                            log.status === 'present' ? 'badge-success' :
                            log.status === 'absent' ? 'badge-danger' :
                            'badge-muted'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <HistoryIcon className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-semibold mb-1">No records found</h3>
            <p className="text-sm text-text-muted">
              {state.attendanceLog.length === 0
                ? 'Start marking attendance to see your history here.'
                : 'Try adjusting your filters to see more records.'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
