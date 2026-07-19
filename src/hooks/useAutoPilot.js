import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAttendance } from './useAttendance';
import { useTimetable } from './useTimetable';
import { useHolidays } from './useHolidays';
import { formatDateKey, getDayName } from '../utils/dateHelpers';
import { subDays, isToday, isFuture } from 'date-fns';

export function useAutoPilot() {
  const { user, profile } = useAuth();
  const { records, bulkMark, getRecordsByDate } = useAttendance();
  const { getDaySchedule } = useTimetable();
  const { isHoliday } = useHolidays();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!user || !profile?.autoPilotEnabled || hasRun.current || !records) return;

    const checkAutoPilot = async () => {
      hasRun.current = true;
      
      // We check up to 3 days back to catch up (e.g. over a weekend)
      for (let i = 1; i <= 3; i++) {
        const dateToCheck = subDays(new Date(), i);
        const dateStr = formatDateKey(dateToCheck);
        
        // Skip holidays and Sundays
        if (isHoliday(dateStr) || dateToCheck.getDay() === 0) continue;

        const dayName = getDayName(dateToCheck);
        const schedule = getDaySchedule(dayName);
        const subjectIds = [...new Set(schedule.filter(p => p.subjectId).map(p => p.subjectId))];

        // If there are classes scheduled for this day
        if (subjectIds.length > 0) {
          const existingRecords = getRecordsByDate(dateStr);
          
          // If NO attendance was marked for this day, auto-mark it present
          if (existingRecords.length === 0) {
            console.log(`[Auto-Pilot] Auto-marking ${dateStr} as present for ${subjectIds.length} subjects.`);
            await bulkMark(dateStr, subjectIds, 'present', 'Auto-Pilot');
          }
        }
      }
    };

    checkAutoPilot();
  }, [user, profile, records, bulkMark, getRecordsByDate, getDaySchedule, isHoliday]);
}
