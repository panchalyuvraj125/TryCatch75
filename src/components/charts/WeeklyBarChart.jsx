import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import Card from '../ui/Card';
import { getWeekDates, formatDateKey } from '../../utils/dateHelpers';
import { format } from 'date-fns';
import { ATTENDANCE_STATUS } from '../../utils/constants';

export default function WeeklyBarChart({ records = [] }) {
  const weekDates = getWeekDates(new Date());

  const data = weekDates.map((date) => {
    const dateStr = formatDateKey(date);
    const dayRecords = records.filter((r) => r.date === dateStr);
    const present = dayRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
    const absent = dayRecords.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
    const total = present + absent;

    return {
      day: format(date, 'EEE'),
      date: format(date, 'dd/MM'),
      present,
      absent,
      total,
      percent: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-[var(--text-primary)]">
          {d.day} ({d.date})
        </p>
        <p className="text-xs text-[var(--accent-green)]">Present: {d.present}</p>
        <p className="text-xs text-[var(--accent-red)]">Absent: {d.absent}</p>
      </div>
    );
  };

  return (
    <Card>
      <h4 className="font-heading text-sm font-semibold text-[var(--text-primary)] mb-4">
        📊 This Week's Attendance
      </h4>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-default)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border-default)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="present"
            fill="var(--accent-green)"
            radius={[4, 4, 0, 0]}
            opacity={0.8}
          />
          <Bar
            dataKey="absent"
            fill="var(--accent-red)"
            radius={[4, 4, 0, 0]}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
