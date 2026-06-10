import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function History() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday

  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-10">
      {/* Header */}
      <div>
        <p className="text-[10px] tracking-widest text-[#71717a] font-mono uppercase mb-2">
          03 · LOGBOOK
        </p>
        <h1 className="font-heading text-4xl font-bold text-[#f4f4f5] tracking-tight">
          History
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select className="bg-[#111111] border border-[#27272a] text-[#f4f4f5] px-4 py-2.5 rounded-lg text-[13px] focus:outline-none focus:border-[var(--accent-orange)]">
          <option>Date range</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
        <select className="bg-[#111111] border border-[#27272a] text-[#f4f4f5] px-4 py-2.5 rounded-lg text-[13px] focus:outline-none focus:border-[var(--accent-orange)]">
          <option>All Subjects</option>
        </select>
        <select className="bg-[#111111] border border-[#27272a] text-[#f4f4f5] px-4 py-2.5 rounded-lg text-[13px] focus:outline-none focus:border-[var(--accent-orange)]">
          <option>All Status</option>
          <option>Present</option>
          <option>Bunked</option>
        </select>
      </div>

      {/* Calendar Section */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 text-[#a1a1aa] hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-[16px] font-semibold text-[#f4f4f5]">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button onClick={nextMonth} className="p-2 text-[#a1a1aa] hover:text-white transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="w-full">
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-[10px] text-[#71717a] font-mono tracking-wider py-2">
                {day.toUpperCase()}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isDayToday = isToday(day);
              
              // Dummy logic for coloring
              let bgColor = "bg-transparent";
              let textColor = "text-[#f4f4f5]";
              
              if (isCurrentMonth) {
                const d = day.getDate();
                if (d % 5 === 0) bgColor = "bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/20";
                else if (d % 7 === 0) bgColor = "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20";
                else bgColor = "bg-[#111111] hover:bg-[#27272a]";
              } else {
                textColor = "text-[#52525b]";
              }

              if (isDayToday) {
                bgColor = "bg-[var(--accent-orange)] text-white font-bold";
              }

              return (
                <div
                  key={day.toString()}
                  className={`aspect-square rounded-lg flex items-center justify-center text-[13px] ${bgColor} ${textColor} transition-colors cursor-pointer`}
                >
                  {format(day, dateFormat)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Log Details */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-sm">
        <h3 className="text-[15px] font-medium text-[#f4f4f5] mb-4">
          Tuesday, 19 Nov
        </h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between py-2.5 border-b border-[#27272a] last:border-0">
            <span className="text-[13px] text-[#a1a1aa]">Database Management Systems</span>
            <span className="text-[10px] font-mono tracking-widest text-[#34d399] bg-[#34d399]/10 px-2 py-1 rounded">PRESENT</span>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-[#27272a] last:border-0">
            <span className="text-[13px] text-[#a1a1aa]">Operating Systems</span>
            <span className="text-[10px] font-mono tracking-widest text-[#ef4444] bg-[#ef4444]/10 px-2 py-1 rounded">BUNKED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
