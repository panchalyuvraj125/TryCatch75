import * as ics from 'ics';
import { getDayName } from './dateHelpers';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function getNextDateForDay(dayName) {
  const today = new Date();
  const currentDayIndex = today.getDay();
  const targetDayIndex = DAYS.indexOf(dayName.toLowerCase());
  
  let daysToAdd = targetDayIndex - currentDayIndex;
  if (daysToAdd < 0) {
    daysToAdd += 7; // Next occurrence
  }
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysToAdd);
  return targetDate;
}

export function exportTimetableToICS(timetable, subjects) {
  const events = [];
  
  // Set end of semester to roughly 4 months from now
  const untilDate = new Date();
  untilDate.setMonth(untilDate.getMonth() + 4);
  const untilStr = untilDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  Object.entries(timetable).forEach(([day, dayData]) => {
    if (!dayData?.periods) return;
    
    const targetDate = getNextDateForDay(day);
    const [year, month, date] = [targetDate.getFullYear(), targetDate.getMonth() + 1, targetDate.getDate()];

    dayData.periods.forEach(period => {
      if (!period.subjectId || !period.time) return;
      
      const subject = subjects.find(s => s.id === period.subjectId);
      if (!subject) return;

      // time format is e.g. "09:00 - 10:00" or just "09:00"
      let startHour = 9, startMin = 0, durationHours = 1, durationMins = 0;
      
      const parts = period.time.split('-');
      if (parts.length > 0) {
        const startParts = parts[0].trim().split(':');
        if (startParts.length === 2) {
          startHour = parseInt(startParts[0]);
          startMin = parseInt(startParts[1]);
        }
      }
      
      events.push({
        title: `${subject.name} ${subject.type === 'practical' ? '(PR)' : '(TH)'}`,
        description: `TryCatch75 Timetable Entry`,
        location: period.room || '',
        start: [year, month, date, startHour, startMin],
        duration: { hours: durationHours, minutes: durationMins },
        recurrenceRule: `FREQ=WEEKLY;UNTIL=${untilStr}`
      });
    });
  });

  if (events.length === 0) {
    return { error: 'No valid timetable entries found' };
  }

  const { error, value } = ics.createEvents(events);
  if (error) {
    console.error(error);
    return { error };
  }

  // Download logic
  const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'trycatch75_timetable.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return { success: true };
}

// Generate base64 share link
export function generateShareLink(timetable, subjects) {
  const data = { timetable, subjects };
  const str = JSON.stringify(data);
  const encoded = btoa(encodeURIComponent(str));
  const url = new URL(window.location.href);
  return `${url.origin}/?import=${encoded}`;
}

// Parse base64 share link
export function parseShareLink(encoded) {
  try {
    const str = decodeURIComponent(atob(encoded));
    return JSON.parse(str);
  } catch (err) {
    console.error('Failed to parse share link', err);
    return null;
  }
}
