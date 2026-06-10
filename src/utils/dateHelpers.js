/**
 * TryCatch75 — Date Helper Utilities
 * Uses date-fns for all date operations
 */
import {
  format,
  parse,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWeekend,
  isSameDay,
  addDays,
  differenceInCalendarDays,
  getDay,
  isWithinInterval,
} from 'date-fns';

/**
 * Format a date as YYYY-MM-DD (for Firestore document IDs)
 * @param {Date} date
 * @returns {string}
 */
export function formatDateKey(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Format date for display
 * @param {Date|string} date
 * @param {string} fmt - date-fns format string
 * @returns {string}
 */
export function formatDisplay(date, fmt = 'dd MMM yyyy') {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, fmt);
}

/**
 * Parse a YYYY-MM-DD string to Date
 * @param {string} dateStr
 * @returns {Date}
 */
export function parseDateKey(dateStr) {
  return parse(dateStr, 'yyyy-MM-dd', new Date());
}

/**
 * Get the day name (lowercase) from a date
 * @param {Date} date
 * @returns {string} e.g., 'monday', 'tuesday'
 */
export function getDayName(date) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[getDay(date)];
}

/**
 * Get all dates in the current week (Mon-Sat)
 * @param {Date} date - Any date in the target week
 * @returns {Date[]}
 */
export function getWeekDates(date) {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).filter((d) => getDay(d) !== 0); // Exclude Sunday
}

/**
 * Get all dates in a month
 * @param {Date} date - Any date in the target month
 * @returns {Date[]}
 */
export function getMonthDates(date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
}

/**
 * Count working days between two dates (Mon-Sat, excluding Sundays)
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {string[]} holidays - Array of YYYY-MM-DD strings for holidays
 * @returns {number}
 */
export function countWorkingDays(startDate, endDate, holidays = []) {
  if (startDate > endDate) return 0;
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return days.filter((d) => {
    if (getDay(d) === 0) return false; // Skip Sundays
    if (holidays.includes(formatDateKey(d))) return false;
    return true;
  }).length;
}

/**
 * Get remaining working days in semester
 * @param {Date} semesterEnd
 * @param {string[]} holidays
 * @returns {number}
 */
export function getRemainingDays(semesterEnd, holidays = []) {
  const today = new Date();
  if (today > semesterEnd) return 0;
  return countWorkingDays(addDays(today, 1), semesterEnd, holidays);
}

/**
 * Check if a date is today
 * @param {Date|string} date
 * @returns {boolean}
 */
export function isToday(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return isSameDay(d, new Date());
}

/**
 * Get the current semester week number
 * @param {Date} semesterStart
 * @returns {number}
 */
export function getCurrentWeek(semesterStart) {
  const today = new Date();
  const days = differenceInCalendarDays(today, semesterStart);
  return Math.max(1, Math.ceil(days / 7));
}

/**
 * Check if a date falls within exam period
 * @param {Date} date
 * @param {{ start: Date, end: Date }} examPeriod
 * @returns {boolean}
 */
export function isExamPeriod(date, examPeriod) {
  if (!examPeriod || !examPeriod.start || !examPeriod.end) return false;
  return isWithinInterval(date, { start: examPeriod.start, end: examPeriod.end });
}

/**
 * Get a human-readable relative date string
 * @param {Date|string} date
 * @returns {string}
 */
export function getRelativeDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diff = differenceInCalendarDays(today, d);

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff === -1) return 'Tomorrow';
  if (diff > 0 && diff <= 7) return `${diff} days ago`;
  return formatDisplay(d);
}
