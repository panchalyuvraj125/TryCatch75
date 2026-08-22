import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, BarChart3, Calendar, Target, Sparkles, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAttendanceForCourse, getOverallAttendance, getRemainingClasses } from '../utils/storage';
import { exportAttendancePDF } from '../utils/pdfExport';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 shadow-lg border-border">
      <p className="text-xs font-semibold mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5 font-medium" style={{ color: p.color }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}
          </span>
          <span className="font-bold">{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const { state } = useApp();
  const overall = getOverallAttendance(state);

  // Subject-wise bar chart data
  const subjectData = useMemo(() => {
    return state.courses.map((course) => {
      const stats = getAttendanceForCourse(state, course.id);
      return {
        name: course.code,
        fullName: course.name,
        attendance: stats.percentage,
        attended: stats.attended,
        total: stats.total,
        color: course.color,
        min: course.minAttendance,
      };
    });
  }, [state]);

  // Attendance trend over time (line chart)
  const trendData = useMemo(() => {
    const logs = [...state.attendanceLog].sort((a, b) => a.date.localeCompare(b.date));
    if (logs.length === 0) return [];

    const dateMap = {};
    logs.forEach((log) => {
      if (!dateMap[log.date]) dateMap[log.date] = { present: 0, total: 0 };
      if (log.status !== 'cancelled') {
        dateMap[log.date].total++;
        if (log.status === 'present') dateMap[log.date].present++;
      }
    });

    let runningPresent = 0;
    let runningTotal = 0;
    return Object.entries(dateMap).map(([date, { present, total }]) => {
      runningPresent += present;
      runningTotal += total;
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        percentage: runningTotal > 0 ? Math.round((runningPresent / runningTotal) * 100) : 0,
      };
    });
  }, [state.attendanceLog]);

  // Weekly heatmap data
  const heatmapData = useMemo(() => {
    const logs = state.attendanceLog;
    if (logs.length === 0) return [];

    const dateMap = {};
    logs.forEach((log) => {
      if (log.status === 'cancelled') return;
      if (!dateMap[log.date]) dateMap[log.date] = { present: 0, total: 0 };
      dateMap[log.date].total++;
      if (log.status === 'present') dateMap[log.date].present++;
    });

    const weeks = [];
    const dates = Object.keys(dateMap).sort();
    if (dates.length === 0) return [];

    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);

    let current = new Date(startDate);
    current.setDate(current.getDate() - current.getDay()); // Start of week

    while (current <= endDate) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = current.toISOString().slice(0, 10);
        const entry = dateMap[dateStr];
        week.push({
          date: dateStr,
          day: d,
          rate: entry ? Math.round((entry.present / entry.total) * 100) : null,
        });
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  }, [state.attendanceLog]);

  // Prediction Data
  const predictionData = useMemo(() => {
    return state.courses.map((course) => {
      const stats = getAttendanceForCourse(state, course.id);
      const remaining = getRemainingClasses(state, course.id);
      
      const totalFuture = stats.total + remaining;
      const maxPossible = totalFuture > 0 ? Math.round(((stats.attended + remaining) / totalFuture) * 100) : stats.percentage;
      const minPossible = totalFuture > 0 ? Math.round((stats.attended / totalFuture) * 100) : stats.percentage;
      
      return {
        ...course,
        stats,
        remaining,
        maxPossible,
        minPossible
      };
    });
  }, [state]);

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getHeatColor = (rate) => {
    if (rate === null) return 'var(--bg-tertiary)';
    if (rate >= 80) return 'var(--success)';
    if (rate >= 50) return 'var(--warning)';
    if (rate > 0) return 'var(--danger)';
    return 'var(--danger)';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Analytics
            </h2>
            <p className="text-sm text-text-muted mt-0.5">
              Detailed attendance insights and trends.
            </p>
          </div>
          <button
            onClick={() => exportAttendancePDF(state)}
            className="btn btn-primary btn-sm hidden sm:flex"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </motion.div>

        {/* Overall Stats Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="stat-card">
            <Target className="w-5 h-5 mb-2 text-accent" />
            <span className="stat-card-value">{overall.percentage}%</span>
            <span className="stat-card-label">Overall</span>
          </div>
          <div className="stat-card">
            <Calendar className="w-5 h-5 mb-2 text-text-muted" />
            <span className="stat-card-value">{overall.total}</span>
            <span className="stat-card-label">Total Classes</span>
          </div>
          <div className="stat-card">
            <TrendingUp className="w-5 h-5 mb-2 text-success" />
            <span className="stat-card-value text-success">{overall.attended}</span>
            <span className="stat-card-label">Attended</span>
          </div>
          <div className="stat-card">
            <BarChart3 className="w-5 h-5 mb-2 text-danger" />
            <span className="stat-card-value text-danger">{overall.missed}</span>
            <span className="stat-card-label">Missed</span>
          </div>
        </motion.div>

        {/* Mobile Export Button */}
        <motion.div variants={fadeUp} className="mb-6 sm:hidden">
          <button
            onClick={() => exportAttendancePDF(state)}
            className="btn btn-primary w-full"
          >
            <Download className="w-4 h-4" />
            Export PDF Report
          </button>
        </motion.div>

        {/* Subject-wise Bar Chart */}
        <motion.div variants={fadeUp} className="card p-4 sm:p-5 mb-6">
          <h3 className="section-header">
            <BarChart3 className="w-4 h-4" />
            Subject-wise Comparison
          </h3>
          {subjectData.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border-color)' }}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickCount={6}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-elevated)', opacity: 0.5 }} />
                  <Bar dataKey="attendance" name="Attendance" radius={[4, 4, 0, 0]}>
                    {subjectData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              <BarChart3 className="empty-state-icon" />
              <h3 className="empty-state-title">No Data Available</h3>
              <p className="empty-state-text">Add courses and mark attendance to see comparisons.</p>
            </div>
          )}
        </motion.div>

        {/* Attendance Trend Line Chart */}
        <motion.div variants={fadeUp} className="card p-4 sm:p-5 mb-6">
          <h3 className="section-header">
            <TrendingUp className="w-4 h-4" />
            Attendance Trend
          </h3>
          {trendData.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border-color)' }}
                    tickLine={false}
                    dy={10}
                    minTickGap={30}
                  />
                  <YAxis
                    domain={['auto', 100]}
                    tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickCount={6}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    name="Attendance"
                    stroke="var(--accent)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--bg-primary)', stroke: 'var(--accent)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'var(--accent)', stroke: 'var(--bg-primary)', strokeWidth: 2 }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              <TrendingUp className="empty-state-icon" />
              <h3 className="empty-state-title">No Trends Yet</h3>
              <p className="empty-state-text">Start marking attendance to see how your percentage changes over time.</p>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Heatmap */}
          <motion.div variants={fadeUp} className="card p-4 sm:p-5">
            <h3 className="section-header">
              <Calendar className="w-4 h-4" />
              Attendance Heatmap
            </h3>
            {heatmapData.length > 0 ? (
              <div>
                <div className="flex gap-1 items-start overflow-x-auto pb-2">
                  <div className="flex flex-col gap-1 mr-2 pt-0 shrink-0">
                    {dayLabels.map((d, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 flex items-center justify-center text-[9px] text-text-muted font-medium"
                      >
                        {i % 2 === 1 ? d : ''}
                      </div>
                    ))}
                  </div>
                  {heatmapData.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1 shrink-0">
                      {week.map((cell) => (
                        <div
                          key={cell.date}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-[3px] transition-colors"
                          style={{
                            backgroundColor: getHeatColor(cell.rate),
                            opacity: cell.rate === null ? 0.2 : 0.6 + (cell.rate / 100) * 0.4,
                          }}
                          title={`${cell.date}: ${cell.rate !== null ? cell.rate + '%' : 'No data'}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-[10px] font-medium text-text-muted">
                  <span>Less</span>
                  {[0, 50, 80, 100].map((v) => (
                    <div
                      key={v}
                      className="w-3 h-3 rounded-[2px]"
                      style={{ backgroundColor: getHeatColor(v), opacity: 0.6 + (v / 100) * 0.4 }}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p className="text-sm text-text-muted">No attendance data yet.</p>
              </div>
            )}
          </motion.div>

          {/* Predictions */}
          <motion.div variants={fadeUp} className="card p-4 sm:p-5">
            <h3 className="section-header mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              Semester Forecast
            </h3>
            {(!state.semester.start || !state.semester.end) ? (
              <div className="empty-state border border-dashed border-border rounded-xl">
                <p className="text-sm text-text-muted mb-4">Set your semester dates in Setup to see end-of-semester predictions.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {predictionData.map(data => (
                  <div key={data.id} className="p-3 rounded-lg bg-bg-tertiary border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: data.color }} />
                        <span className="text-sm font-medium truncate">{data.name}</span>
                        <span className="badge badge-muted shrink-0 text-[9px] py-0.5">
                          {data.remaining} left
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted">
                        Current: <strong className="text-text-primary">{data.stats.percentage}%</strong>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0 bg-bg-primary/50 p-2 rounded-md border border-border">
                      <div className="text-center">
                        <p className="text-[9px] font-medium text-text-muted uppercase tracking-wider mb-0.5">Worst</p>
                        <p className={`text-sm font-bold ${data.minPossible < data.minAttendance ? 'text-danger' : 'text-warning'}`}>{data.minPossible}%</p>
                      </div>
                      <div className="w-px h-6 bg-border" />
                      <div className="text-center">
                        <p className="text-[9px] font-medium text-text-muted uppercase tracking-wider mb-0.5">Best</p>
                        <p className="text-sm font-bold text-success">{data.maxPossible}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
