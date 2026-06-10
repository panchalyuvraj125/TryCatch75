import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../ui/Card';

const COLORS = [
  '#00f5ff',
  '#8b5cf6',
  '#00ff88',
  '#ff4444',
  '#ffd700',
  '#ff69b4',
  '#1e90ff',
  '#ff8c00',
];

export default function SubjectPieChart({ subjectStats = [] }) {
  const data = subjectStats
    .filter((s) => s.total > 0)
    .map((s, i) => ({
      name: s.name,
      value: s.present,
      total: s.total,
      percent: s.percent,
      color: COLORS[i % COLORS.length],
    }));

  if (data.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-[var(--text-muted)]">No data to display</p>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-[var(--text-primary)]">{d.name}</p>
        <p className="text-xs" style={{ color: d.color }}>
          {d.value}/{d.total} ({d.percent.toFixed(1)}%)
        </p>
      </div>
    );
  };

  const renderLegend = ({ payload }) => (
    <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2">
      {payload.map((entry, i) => (
        <span key={i} className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </span>
      ))}
    </div>
  );

  return (
    <Card>
      <h4 className="font-heading text-sm font-semibold text-[var(--text-primary)] mb-4">
        🥧 Subject-wise Distribution
      </h4>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            stroke="var(--bg-card)"
            strokeWidth={2}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
