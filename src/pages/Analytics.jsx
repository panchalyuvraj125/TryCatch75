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
import { TrendingUp, BarChart3, Calendar, Target, Sparkles, ArrowRight, Download } from 'lucide-react';
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
    <div className="card p-2 text-xs shadow-lg">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value}%
        </p>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Analytics</h2>
          <p className="text-xs text-text-muted mt-1">
            Detailed attendance insights and trends.
          </p>
        </div>
        <button
          onClick={() => exportAttendancePDF(state)}
          className="h-9 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-lg transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Export PDF
        </button>
      </motion.div>

      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Overall Stats Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="card p-4 text-center">
            <Target className="w-5 h-5 mx-auto mb-1 text-accent" />
            <p className="text-xl font-bold">{overall.percentage}%</p>
            <p className="text-[10px] text-text-muted">Overall</p>
          </div>
          <div className="card p-4 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-text-muted" />
            <p className="text-xl font-bold">{overall.total}</p>
            <p className="text-[10px] text-text-muted">Total Classes</p>
          </div>
          <div className="card p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--success)' }} />
            <p className="text-xl font-bold">{overall.attended}</p>
            <p className="text-[10px] text-text-muted">Attended</p>
          </div>
          <div className="card p-4 text-center">
            <BarChart3 className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--danger)' }} />
            <p className="text-xl font-bold">{overall.missed}</p>
            <p className="text-[10px] text-text-muted">Missed</p>
          </div>
        </motion.div>

        {/* Attendance Trend Line Chart */}
        <motion.div variants={fadeUp} className="card p-4 sm:p-6 mb-6">
          <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Attendance Trend
          </h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  name="Attendance"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--accent)', r: 3 }}
                  activeDot={{ r: 5, fill: 'var(--accent)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-sm text-text-muted">No attendance data yet. Start marking attendance to see trends.</p>
            </div>
          )}
        </motion.div>

        {/* Subject-wise Bar Chart */}
        <motion.div variants={fadeUp} className="card p-4 sm:p-6 mb-6">
          <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Subject-wise Comparison
          </h3>
          {subjectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="attendance" name="Attendance" radius={[4, 4, 0, 0]}>
                  {subjectData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-sm text-text-muted">Add courses and mark attendance to see comparison.</p>
            </div>
          )}
        </motion.div>

        {/* Weekly Heatmap */}
        <motion.div variants={fadeUp} className="card p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Attendance Heatmap
          </h3>
          {heatmapData.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex gap-0.5 items-start">
                {/* Day labels */}
                <div className="flex flex-col gap-0.5 mr-1 pt-0">
                  {dayLabels.map((d, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 flex items-center justify-center text-[8px] text-text-muted font-mono"
                    >
                      {i % 2 === 1 ? d : ''}
                    </div>
                  ))}
                </div>
                {/* Weeks */}
                {heatmapData.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-0.5">
                    {week.map((cell) => (
                      <div
                        key={cell.date}
                        className="w-4 h-4 rounded-sm transition-colors"
                        style={{
                          backgroundColor: getHeatColor(cell.rate),
                          opacity: cell.rate === null ? 0.3 : 0.8 + (cell.rate / 100) * 0.2,
                        }}
                        title={`${cell.date}: ${cell.rate !== null ? cell.rate + '%' : 'No data'}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-2 mt-3 text-[10px] text-text-muted">
                <span>Less</span>
                {[0, 25, 50, 75, 100].map((v) => (
                  <div
                    key={v}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: getHeatColor(v), opacity: 0.8 }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-text-muted">No attendance data yet to display heatmap.</p>
            </div>
          )}
        </motion.div>

        {/* Predictions */}
        <motion.div variants={fadeUp} className="card p-4 sm:p-6 mt-6">
          <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            End of Semester Predictions
          </h3>
          {(!state.semester.start || !state.semester.end) ? (
            <div className="py-8 text-center border border-dashed border-border rounded-xl">
              <p className="text-sm text-text-muted mb-3">Set your semester dates in Setup to see predictions.</p>
              <button className="px-4 py-2 bg-bg-tertiary hover:bg-bg-elevated rounded-lg text-xs font-medium transition-colors">Go to Setup</button>
            </div>
          ) : (
            <div className="space-y-3">
              {predictionData.map(data => (
                <div key={data.id} className="p-4 rounded-xl bg-bg-tertiary flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.color }} />
                      <span className="text-sm font-semibold">{data.name}</span>
                      <span className="text-[10px] font-mono text-text-muted bg-bg-primary px-1.5 py-0.5 rounded-md border border-border">
                        {data.remaining} classes left
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      Currently at {data.stats.percentage}%
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] text-text-muted mb-0.5">If you bunk all</p>
                      <p className="text-sm font-bold text-danger">{data.minPossible}%</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted opacity-50" />
                    <div className="text-right">
                      <p className="text-[10px] text-text-muted mb-0.5">If you attend all</p>
                      <p className="text-sm font-bold text-success">{data.maxPossible}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
