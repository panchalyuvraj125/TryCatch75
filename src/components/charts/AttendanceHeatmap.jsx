import { useMemo } from 'react';
import Card from '../ui/Card';
import { format, subDays, isSameDay } from 'date-fns';
import { Calendar } from 'lucide-react';

export default function AttendanceHeatmap({ records }) {
  const days = useMemo(() => {
    const today = new Date();
    // 14 weeks * 7 days = 98 days
    return Array.from({ length: 98 }).map((_, i) => subDays(today, 97 - i));
  }, []);

  const heatmapData = useMemo(() => {
    return days.map((day) => {
      const dayRecords = records.filter(r => isSameDay(new Date(r.date), day));
      if (dayRecords.length === 0) return { date: day, status: 'empty' };
      
      const present = dayRecords.filter(r => r.status === 'present').length;
      const total = dayRecords.length;
      const ratio = present / total;

      if (ratio === 1) return { date: day, status: 'perfect' };
      if (ratio >= 0.5) return { date: day, status: 'good' };
      if (ratio > 0) return { date: day, status: 'bad' };
      return { date: day, status: 'zero' };
    });
  }, [days, records]);

  return (
    <Card className="border-[var(--accent-green)]/30 shadow-[0_0_15px_rgba(0,255,128,0.05)]">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={18} className="text-[var(--accent-green)]" />
        <h3 className="font-heading font-semibold text-[var(--text-primary)]">Activity Heatmap (Last 90 Days)</h3>
      </div>
      
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-1.5 min-w-max">
          {Array.from({ length: 14 }).map((_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1.5">
              {heatmapData.slice(weekIdx * 7, weekIdx * 7 + 7).map((dayData, i) => {
                let colorClass = 'bg-[var(--bg-secondary)] border-[var(--border-default)]';
                if (dayData.status === 'perfect') colorClass = 'bg-[var(--accent-green)] border-[var(--accent-green)] shadow-[0_0_5px_var(--accent-green)]';
                if (dayData.status === 'good') colorClass = 'bg-[var(--accent-cyan)] border-[var(--accent-cyan)]';
                if (dayData.status === 'bad') colorClass = 'bg-[var(--accent-yellow)] border-[var(--accent-yellow)]';
                if (dayData.status === 'zero') colorClass = 'bg-[var(--accent-red)] border-[var(--accent-red)]';

                return (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-sm border ${colorClass} opacity-80 hover:opacity-100 hover:scale-125 transition-all cursor-crosshair`}
                    title={`${format(dayData.date, 'MMM d, yyyy')}: ${dayData.status === 'empty' ? 'No classes' : dayData.status}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
        <span>Bunked</span>
        <div className="flex gap-1.5 mx-1">
          <div className="w-3 h-3 rounded-sm bg-[var(--accent-red)]"></div>
          <div className="w-3 h-3 rounded-sm bg-[var(--accent-yellow)]"></div>
          <div className="w-3 h-3 rounded-sm bg-[var(--bg-secondary)] border border-[var(--border-default)]"></div>
          <div className="w-3 h-3 rounded-sm bg-[var(--accent-cyan)]"></div>
          <div className="w-3 h-3 rounded-sm bg-[var(--accent-green)]"></div>
        </div>
        <span>Attended</span>
      </div>
    </Card>
  );
}
