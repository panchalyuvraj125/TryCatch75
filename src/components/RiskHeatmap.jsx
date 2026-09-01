import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, AlertTriangle, ShieldCheck, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getClassesForDate, getOverallAttendance } from '../utils/storage';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function RiskHeatmap() {
  const { state } = useApp();
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date(2026, 8, 1)); // Default to Sept 2026
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const overallStats = getOverallAttendance(state);

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
    setSelectedDayInfo(null);
  };
  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
    setSelectedDayInfo(null);
  };

  // Evaluate risk per day
  const monthRiskData = useMemo(() => {
    const data = [];
    const minRequired = 75;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = dateObj.toISOString().slice(0, 10);
      const dayOfWeek = DAYS[dateObj.getDay()];

      const classes = getClassesForDate(state, dateStr);
      const isHoliday = state.holidays?.some(h => h.date === dateStr);
      const isWeekend = dayOfWeek === 'Sun' || (dayOfWeek === 'Sat' && classes.length === 0);

      let riskLevel = 'none'; // 'danger', 'caution', 'safe', 'holiday', 'none'
      let projectedPct = overallStats.percentage;

      if (isHoliday) {
        riskLevel = 'holiday';
      } else if (classes.length > 0) {
        // Project overall attendance if user bunks all classes on this date
        const newTotal = overallStats.total + classes.length;
        projectedPct = Math.round((overallStats.attended / newTotal) * 100);

        if (projectedPct < minRequired) {
          riskLevel = 'danger';
        } else if (projectedPct === minRequired || projectedPct < minRequired + 3) {
          riskLevel = 'caution';
        } else {
          riskLevel = 'safe';
        }
      }

      data.push({
        day,
        dateStr,
        dayOfWeek,
        classesCount: classes.length,
        classes,
        isHoliday,
        isWeekend,
        riskLevel,
        projectedPct,
      });
    }
    return data;
  }, [state, year, month, daysInMonth, overallStats]);

  const monthName = currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="card p-4 sm:p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">AI Bunk Risk Heatmap</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg bg-bg-tertiary hover:bg-bg-elevated text-text-secondary transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-text-primary px-2">{monthName}</span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg bg-bg-tertiary hover:bg-bg-elevated text-text-secondary transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-[11px] font-medium text-text-muted bg-bg-tertiary p-2.5 rounded-xl border border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Safe Bunk Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Caution</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span>Critical Danger</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-500/50" />
          <span>Holiday / Off</span>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {DAYS.map(d => (
          <span key={d} className="text-[11px] font-semibold text-text-muted uppercase">
            {d}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Empty leading cells */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-lg bg-transparent" />
        ))}

        {/* Date cells */}
        {monthRiskData.map((item) => {
          let bgClass = 'bg-bg-tertiary/50 border-border text-text-muted';
          if (item.riskLevel === 'safe') {
            bgClass = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold';
          } else if (item.riskLevel === 'caution') {
            bgClass = 'bg-amber-500/15 border-amber-500/40 text-amber-400 font-bold';
          } else if (item.riskLevel === 'danger') {
            bgClass = 'bg-rose-500/20 border-rose-500/50 text-rose-400 font-extrabold';
          } else if (item.riskLevel === 'holiday') {
            bgClass = 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300';
          }

          const isSelected = selectedDayInfo?.dateStr === item.dateStr;

          return (
            <button
              key={item.dateStr}
              onClick={() => setSelectedDayInfo(item)}
              className={`h-10 sm:h-12 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer relative ${bgClass} ${
                isSelected ? 'ring-2 ring-accent scale-105 shadow-lg' : 'hover:scale-102'
              }`}
            >
              <span className="text-xs">{item.day}</span>
              {item.classesCount > 0 && (
                <span className="text-[9px] opacity-80 mt-0.5">{item.classesCount} cl</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Info Box */}
      {selectedDayInfo && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3.5 rounded-xl bg-bg-tertiary border border-border"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-text-primary">
              Date: {selectedDayInfo.dateStr} ({selectedDayInfo.dayOfWeek})
            </h4>
            <span className="text-[11px] font-bold uppercase text-accent">
              Projected: {selectedDayInfo.projectedPct}%
            </span>
          </div>

          {selectedDayInfo.isHoliday ? (
            <p className="text-xs text-indigo-300 font-medium">🎉 Official Holiday / No Classes Scheduled</p>
          ) : selectedDayInfo.classesCount === 0 ? (
            <p className="text-xs text-text-muted">No classes scheduled on this day.</p>
          ) : (
            <div>
              <p className="text-xs text-text-secondary mb-2">
                Classes scheduled ({selectedDayInfo.classesCount}):
              </p>
              <ul className="space-y-1 mb-2">
                {selectedDayInfo.classes.map(({ course, period }) => (
                  <li key={`${course.id}-${period}`} className="text-xs text-text-muted flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: course.color }} />
                    <span className="font-mono">P{period + 1}:</span> {course.name}
                  </li>
                ))}
              </ul>

              {selectedDayInfo.riskLevel === 'danger' ? (
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Critical Danger! Bunking today drops overall attendance to {selectedDayInfo.projectedPct}%.</span>
                </div>
              ) : selectedDayInfo.riskLevel === 'caution' ? (
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-1.5">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Caution: Borderline zone if bunked.</span>
                </div>
              ) : (
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Safe Day: You have enough buffer to bunk this day without falling below 75%.</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
