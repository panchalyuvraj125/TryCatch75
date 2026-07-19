import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import { useSubjects } from '../hooks/useSubjects';
import { useTimetable } from '../hooks/useTimetable';
import { useHolidays } from '../hooks/useHolidays';
import { formatDateKey, getDayName } from '../utils/dateHelpers';

export default function History() {
  const { records, deleteAttendance, markAttendance } = useAttendance();
  const { subjects } = useSubjects();
  const { timetable } = useTimetable();
  const { isHoliday, toggleHoliday } = useHolidays();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  // Get records for the selected date
  const selectedDateStr = formatDateKey(selectedDate);
  const selectedRecords = records.filter(r => r.date === selectedDateStr);

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
          <option>All Subjects</option>
          {subjects.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
        <select className="bg-[#111111] border border-[#27272a] text-[#f4f4f5] px-4 py-2.5 rounded-lg text-[13px] focus:outline-none focus:border-[var(--accent-orange)]">
          <option>All Status</option>
          <option>Present</option>
          <option>Absent</option>
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
              const isSelected = isSameDay(day, selectedDate);
              
              const dateStr = formatDateKey(day);
              const dayRecords = records.filter(r => r.date === dateStr);
              const dayName = getDayName(day);
              const hasCollege = timetable[dayName]?.periods?.length > 0;
              
              let dotColor = null;
              if (dayRecords.length > 0) {
                 const hasAbsent = dayRecords.some(r => r.status === 'absent');
                 const hasPresent = dayRecords.some(r => r.status === 'present');
                 if (hasAbsent) {
                   dotColor = 'bg-[#ef4444]'; // red dot
                 } else if (hasPresent) {
                   dotColor = 'bg-[#34d399]'; // green dot
                 } else {
                   dotColor = 'bg-[var(--accent-cyan)]'; // medical/cancelled
                 }
              } else if (!hasCollege || isHoliday(dateStr)) {
                 dotColor = 'bg-[#52525b]'; // gray dot (no college/holiday)
              } else {
                 // hasCollege is true, no records yet
                 const today = new Date();
                 today.setHours(23, 59, 59, 999);
                 if (day <= today) {
                   dotColor = 'bg-[var(--accent-orange)]'; // pending attendance
                 }
              }

              let bgColor = "bg-transparent";
              let textColor = "text-[#f4f4f5]";
              
              if (isCurrentMonth) {
                bgColor = "bg-[#111111] hover:bg-[#27272a]";
              } else {
                textColor = "text-[#52525b]";
              }

              if (isDayToday) {
                bgColor = "bg-[var(--accent-orange)] text-[#18181b] font-bold";
              }
              
              if (isSelected && !isDayToday) {
                bgColor += " ring-2 ring-[var(--accent-orange)] ring-offset-2 ring-offset-[#18181b]";
              }

              return (
                <div
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`relative aspect-square rounded-lg flex items-center justify-center text-[13px] ${bgColor} ${textColor} transition-all cursor-pointer`}
                >
                  {format(day, dateFormat)}
                  
                  {dotColor && (
                    <div className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${dotColor} ${isDayToday ? 'ring-1 ring-[#18181b]' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-[#27272a] flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#34d399]"></div>
            <span className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
            <span className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">Bunked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)]"></div>
            <span className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#52525b]"></div>
            <span className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">Holiday</span>
          </div>
        </div>
      </div>

      {/* Log Details */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-sm mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-medium text-[#f4f4f5]">
            {format(selectedDate, 'EEEE, d MMM yyyy')}
          </h3>
          <button 
            onClick={() => toggleHoliday(selectedDateStr)}
            className={`text-[11px] font-medium px-3 py-1.5 rounded-full border transition-colors ${
              isHoliday(selectedDateStr) 
                ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border-[var(--accent-cyan)]/20' 
                : 'bg-transparent text-[#71717a] border-[#27272a] hover:text-[#a1a1aa]'
            }`}
          >
            {isHoliday(selectedDateStr) ? '🌴 College Holiday' : 'Mark as Holiday'}
          </button>
        </div>
        
        {selectedRecords.length > 0 ? (
          <div className="space-y-1">
            {selectedRecords.map(record => {
              const subject = subjects.find(s => s.id === (record.subjectId || record.subject_id));
              let statusStyle = "";
              let statusLabel = record.status.toUpperCase();
              
              if (record.status === 'present') {
                statusStyle = "text-[#34d399] bg-[#34d399]/10";
              } else if (record.status === 'absent') {
                statusStyle = "text-[#ef4444] bg-[#ef4444]/10";
                statusLabel = "BUNKED";
              } else {
                statusStyle = "text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10";
              }

              return (
                <div key={record.id} className="flex items-center justify-between py-2.5 border-b border-[#27272a] last:border-0 group">
                  <span className="text-[13px] text-[#a1a1aa]">{subject?.name || 'Unknown Subject'}</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={record.status}
                      onChange={(e) => markAttendance(selectedDateStr, record.subjectId || record.subject_id, e.target.value)}
                      className={`text-[10px] font-mono tracking-widest px-2 py-1 rounded outline-none cursor-pointer appearance-none text-center ${statusStyle}`}
                    >
                      <option value="present">PRESENT</option>
                      <option value="absent">BUNKED</option>
                      <option value="holiday">HOLIDAY</option>
                      <option value="medical">MEDICAL</option>
                      <option value="official">OFFICIAL</option>
                    </select>
                    <button 
                      onClick={() => deleteAttendance(record.id)}
                      className="text-[#71717a] hover:text-[#ef4444] opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete Record"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-[13px] text-[#71717a]">No attendance marked on this date.</p>
          </div>
        )}
      </div>
    </div>
  );
}
