/**
 * TryCatch75 — Constants and University Presets
 */

/** Default attendance threshold */
export const DEFAULT_THRESHOLD = 75;

/** Attendance statuses */
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  HOLIDAY: 'holiday',
  MEDICAL: 'medical',
  OFFICIAL: 'official',
};

/** Subject types */
export const SUBJECT_TYPES = {
  THEORY: 'theory',
  LAB: 'lab',
  TUTORIAL: 'tutorial',
};

/** Subject type labels */
export const SUBJECT_TYPE_LABELS = {
  theory: 'Theory',
  lab: 'Lab / Practical',
  tutorial: 'Tutorial',
};

/** Lecture type slot multipliers (labs count as 2 slots) */
export const SLOT_MULTIPLIERS = {
  theory: 1,
  lab: 2,
  tutorial: 1,
};

/** Days of the week (Mon-Sat for Indian engineering colleges) */
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export const DAY_LABELS = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
};

export const DAY_FULL_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
};

/** Maximum periods per day */
export const MAX_PERIODS = 8;

/** Semester options */
export const SEMESTERS = [
  { value: 1, label: 'Semester 1' },
  { value: 2, label: 'Semester 2' },
  { value: 3, label: 'Semester 3' },
  { value: 4, label: 'Semester 4' },
  { value: 5, label: 'Semester 5' },
  { value: 6, label: 'Semester 6' },
  { value: 7, label: 'Semester 7' },
  { value: 8, label: 'Semester 8' },
];

/** Year options */
export const YEARS = [
  { value: 'FE', label: 'First Year (FE)' },
  { value: 'SE', label: 'Second Year (SE)' },
  { value: 'TE', label: 'Third Year (TE)' },
  { value: 'BE', label: 'Final Year (BE)' },
];

/** Branch options (common Indian engineering branches) */
export const BRANCHES = [
  'Computer Science & Engineering',
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Artificial Intelligence & Data Science',
  'AI & Machine Learning',
  'Robotics & Automation',
  'Other',
];

/**
 * University presets
 * Each preset configures the attendance system for a specific Indian university
 */
export const UNIVERSITY_PRESETS = {
  dbatu: {
    id: 'dbatu',
    name: 'DBATU (Dr. Babasaheb Ambedkar Technological University)',
    shortName: 'DBATU',
    location: 'Lonere, Maharashtra',
    threshold: 75,
    totalSemesters: 8,
    labWeightage: 2,
    hasLabSeparateAttendance: true,
    workingDaysPerWeek: 6,
    medicalLeaveExcused: false,
  },
  mumbai: {
    id: 'mumbai',
    name: 'University of Mumbai',
    shortName: 'Mumbai Uni',
    location: 'Mumbai, Maharashtra',
    threshold: 75,
    totalSemesters: 8,
    labWeightage: 2,
    hasLabSeparateAttendance: true,
    workingDaysPerWeek: 6,
    medicalLeaveExcused: true,
  },
  pune: {
    id: 'pune',
    name: 'Savitribai Phule Pune University (SPPU)',
    shortName: 'Pune Uni',
    location: 'Pune, Maharashtra',
    threshold: 75,
    totalSemesters: 8,
    labWeightage: 2,
    hasLabSeparateAttendance: true,
    workingDaysPerWeek: 6,
    medicalLeaveExcused: true,
  },
  vtu: {
    id: 'vtu',
    name: 'Visvesvaraya Technological University',
    shortName: 'VTU',
    location: 'Belagavi, Karnataka',
    threshold: 75,
    totalSemesters: 8,
    labWeightage: 2,
    hasLabSeparateAttendance: true,
    workingDaysPerWeek: 5,
    medicalLeaveExcused: true,
  },
  gtu: {
    id: 'gtu',
    name: 'Gujarat Technological University',
    shortName: 'GTU',
    location: 'Ahmedabad, Gujarat',
    threshold: 75,
    totalSemesters: 8,
    labWeightage: 2,
    hasLabSeparateAttendance: true,
    workingDaysPerWeek: 6,
    medicalLeaveExcused: false,
  },
  rtu: {
    id: 'rtu',
    name: 'Rajasthan Technical University',
    shortName: 'RTU',
    location: 'Kota, Rajasthan',
    threshold: 75,
    totalSemesters: 8,
    labWeightage: 2,
    hasLabSeparateAttendance: true,
    workingDaysPerWeek: 6,
    medicalLeaveExcused: false,
  },
  custom: {
    id: 'custom',
    name: 'Custom University',
    shortName: 'Custom',
    location: '',
    threshold: 75,
    totalSemesters: 8,
    labWeightage: 2,
    hasLabSeparateAttendance: true,
    workingDaysPerWeek: 6,
    medicalLeaveExcused: false,
  },
};

/** Navigation items for sidebar */
export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/subjects', label: 'Subjects', icon: 'BookOpen' },
  { path: '/mark', label: 'Mark Attendance', icon: 'CheckSquare' },
  { path: '/timetable', label: 'Timetable', icon: 'Calendar' },
  { path: '/calculator', label: 'Calculator', icon: 'Calculator' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];
