/**
 * Generates an iCalendar (.ics) file from the app's timetable
 * for syncing with Google Calendar, Apple Calendar, Outlook, etc.
 */

import { FULL_TIMETABLE_METADATA } from './timetableData';

const DAY_OFFSETS = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function formatICSDate(dateObj, timeStr = '00:00') {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(dateObj);
  d.setHours(h, m, 0, 0);

  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    'T' +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    '00'
  );
}

export function generateICSContent(state) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TryCatch75//Student Attendance Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:TryCatch75 Timetable',
  ];

  const startDateStr = state.semester?.start || new Date().toISOString().slice(0, 10);
  const endDateStr = state.semester?.end || '2026-12-31';

  const semStart = new Date(startDateStr);
  const semEnd = new Date(endDateStr);

  const timetable = state.timetable || {};
  const courses = state.courses || [];
  const periodTimes = state.periodTimes || [];

  Object.entries(timetable).forEach(([day, periods]) => {
    const dayTargetIdx = DAY_OFFSETS[day];
    if (dayTargetIdx === undefined) return;

    // Find first date matching this day of week on or after semStart
    const eventFirstDate = new Date(semStart);
    let diff = (dayTargetIdx - semStart.getDay() + 7) % 7;
    eventFirstDate.setDate(eventFirstDate.getDate() + diff);

    Object.entries(periods).forEach(([pIdxStr, courseId]) => {
      if (!courseId) return;
      const pIdx = parseInt(pIdxStr);
      const course = courses.find((c) => c.id === courseId);
      const time = periodTimes[pIdx];
      if (!course || !time) return;

      const meta = FULL_TIMETABLE_METADATA[day]?.[pIdx] || {};
      const teacher = meta.teacher || '';
      const location = meta.location || '';

      const dtStart = formatICSDate(eventFirstDate, time.start);
      const dtEnd = formatICSDate(eventFirstDate, time.end);
      const untilDate = formatICSDate(semEnd, '23:59');

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:trycatch75-${course.id}-${day}-P${pIdx + 1}@app`);
      lines.push(`DTSTAMP:${formatICSDate(new Date(), '00:00')}Z`);
      lines.push(`DTSTART:${dtStart}`);
      lines.push(`DTEND:${dtEnd}`);
      lines.push(`RRULE:FREQ=WEEKLY;UNTIL=${untilDate}`);
      lines.push(`SUMMARY:${course.code} - ${course.name}`);
      if (location) lines.push(`LOCATION:${location}`);
      lines.push(
        `DESCRIPTION:Period ${pIdx + 1} (${time.start} - ${time.end})\\nTeacher: ${teacher || 'N/A'}\\nCourse: ${course.name}`
      );
      lines.push('STATUS:CONFIRMED');
      lines.push('END:VEVENT');
    });
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function exportTimetableToICal(state) {
  const content = generateICSContent(state);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TryCatch75_Timetable_${state.personalInfo?.section || 'Class'}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
