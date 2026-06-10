import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import Card from '../ui/Card';
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { ATTENDANCE_STATUS } from '../../utils/constants';

export default function MonthlyTrendChart({ records = [], threshold = 75 }) {
  const data = useMemo(() => {
    // Get weeks of the current month
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const weeks = eachWeekOfInterval(
      { start: monthStart, end: monthEnd },
      { weekStartsOn: 1 }
    );

    return weeks.map((weekStart, idx) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekRecords = records.filter((r) => {
        const d = new Date(r.date);
        return d >= weekStart && d <= weekEnd;
      });

      const present = weekRecords.filter(
        (r) => r.status === ATTENDANCE_STATUS.PRESENT
      ).length;
      const total = weekRecords.filter(
        (r) =>
          r.status === ATTENDANCE_STATUS.PRESENT ||
          r.status === ATTENDANCE_STATUS.ABSENT ||
          r.status === ATTENDANCE_STATUS.MEDICAL
      ).length;

      return {
        week: `W${idx + 1}`,
        label: format(weekStart, 'dd MMM'),
        percent: total > 0 ? Math.round((present / total) * 100) : null,
        present,
        total,
      };
    });
  }, [records]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-[var(--text-primary)]">
          {d.week} ({d.label})
        </p>
        <p className="text-xs text-[var(--accent-cyan)]">
          Attendance: {d.percent !== null ? `${d.percent}%` : 'N/A'}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          {d.present}/{d.total} classes
        </p>
      </div>
    );
  };

  return (
    <Card>
      <h4 className="font-heading text-sm font-semibold text-[var(--text-primary)] mb-4">
        📈 Monthly Attendance Trend
      </h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-default)"
            vertical={false}
          />
          <XAxis
            dataKey="week"
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border-default)' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={threshold}
            stroke="var(--accent-red)"
            strokeDasharray="5 5"
            label={{
              value: `${threshold}%`,
              position: 'right',
              fill: 'var(--accent-red)',
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="percent"
            stroke="var(--accent-cyan)"
            strokeWidth={2}
            dot={{ fill: 'var(--accent-cyan)', r: 4 }}
            activeDot={{ r: 6, fill: 'var(--accent-cyan)', stroke: 'var(--bg-card)', strokeWidth: 2 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
