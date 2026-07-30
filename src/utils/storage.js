const STORAGE_KEY = 'trycatch75_data';

const DEFAULT_DATA = {
  personalInfo: {
    name: '',
    rollNumber: '',
    branch: '',
    year: '',
    semester: '',
    section: '',
  },
  courses: [],
  timetable: {
    Mon: {},
    Tue: {},
    Wed: {},
    Thu: {},
    Fri: {},
    Sat: {},
  },
  periodTimes: [
    { start: '09:00', end: '09:50' },
    { start: '10:00', end: '10:50' },
    { start: '11:00', end: '11:50' },
    { start: '12:00', end: '12:50' },
    { start: '14:00', end: '14:50' },
    { start: '15:00', end: '15:50' },
    { start: '16:00', end: '16:50' },
    { start: '17:00', end: '17:50' },
  ],
  attendanceLog: [],
  holidays: [],
  semester: { start: '', end: '' },
  setupComplete: false,
};

const DEFAULT_GLOBAL_DATA = {
  activeSemesterId: 'default',
  semesters: {
    'default': { id: 'default', label: 'Semester 1', ...DEFAULT_DATA }
  },
  theme: 'dark'
};

export function getData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_GLOBAL_DATA };
    let parsed = JSON.parse(raw);
    
    if (parsed.courses && !parsed.semesters) {
      const semData = { ...parsed };
      delete semData.theme;
      parsed = {
        activeSemesterId: 'default',
        semesters: {
          'default': { id: 'default', label: 'Semester 1', ...semData }
        },
        theme: parsed.theme || 'dark'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    
    return { ...DEFAULT_GLOBAL_DATA, ...parsed };
  } catch {
    return { ...DEFAULT_GLOBAL_DATA };
  }
}

export function setData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateData(updater) {
  const data = getData();
  const updated = typeof updater === 'function' ? updater(data) : { ...data, ...updater };
  setData(updated);
  return updated;
}

export function exportData() {
  const data = getData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trycatch75_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data && typeof data === 'object') {
          let merged;
          if (data.courses && !data.semesters) {
            const semData = { ...data };
            delete semData.theme;
            merged = {
              ...DEFAULT_GLOBAL_DATA,
              activeSemesterId: 'default',
              semesters: {
                'default': { id: 'default', label: 'Semester 1', ...DEFAULT_DATA, ...semData }
              },
              theme: data.theme || 'dark'
            };
          } else {
            merged = { ...DEFAULT_GLOBAL_DATA, ...data };
          }
          setData(merged);
          resolve(merged);
        } else {
          reject(new Error('Invalid data format'));
        }
      } catch {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function getAttendanceForCourse(data, courseId) {
  const logs = data.attendanceLog.filter((l) => l.courseId === courseId);
  const total = logs.filter((l) => l.status !== 'cancelled').length;
  const attended = logs.filter((l) => l.status === 'present').length;
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
  return { total, attended, missed: total - attended, percentage };
}

export function getOverallAttendance(data) {
  const logs = data.attendanceLog.filter((l) => l.status !== 'cancelled');
  const total = logs.length;
  const attended = logs.filter((l) => l.status === 'present').length;
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
  return { total, attended, missed: total - attended, percentage };
}

export function getTodayClasses(data) {
  const dateStr = new Date().toISOString().slice(0, 10);
  if (data.holidays && data.holidays.some(h => h.date === dateStr)) {
    return [];
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = days[new Date().getDay()];
  const daySchedule = data.timetable[today] || {};
  const classes = [];

  Object.entries(daySchedule).forEach(([period, courseId]) => {
    if (courseId) {
      const course = data.courses.find((c) => c.id === courseId);
      const time = data.periodTimes[parseInt(period)] || {};
      if (course) {
        classes.push({ period: parseInt(period), course, time });
      }
    }
  });

  return classes.sort((a, b) => a.period - b.period);
}

export function getClassesForDate(data, dateStr) {
  if (data.holidays && data.holidays.some(h => h.date === dateStr)) {
    return [];
  }

  const date = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = days[date.getDay()];
  const daySchedule = data.timetable[day] || {};
  const classes = [];

  Object.entries(daySchedule).forEach(([period, courseId]) => {
    if (courseId) {
      const course = data.courses.find((c) => c.id === courseId);
      const time = data.periodTimes[parseInt(period)] || {};
      if (course) {
        classes.push({ period: parseInt(period), course, time });
      }
    }
  });

  return classes.sort((a, b) => a.period - b.period);
}

export function calculateSafeBunks(attended, total, minPercent = 75) {
  if (total === 0) return 0;
  const currentPercent = (attended / total) * 100;
  if (currentPercent < minPercent) return 0;
  let bunks = 0;
  let a = attended;
  let t = total;
  while (((a) / (t + 1)) * 100 >= minPercent) {
    t++;
    bunks++;
  }
  return bunks;
}

export function calculateClassesNeeded(attended, total, minPercent = 75) {
  if (total === 0) return 0;
  const currentPercent = (attended / total) * 100;
  if (currentPercent >= minPercent) return 0;
  let needed = 0;
  let a = attended;
  let t = total;
  while ((a / t) * 100 < minPercent) {
    a++;
    t++;
    needed++;
  }
  return needed;
}

export function getTheme() {
  return localStorage.getItem('trycatch75_theme') || 'dark';
}

export function setTheme(theme) {
  localStorage.setItem('trycatch75_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

export function getRemainingClasses(data, courseId) {
  if (!data.semester.start || !data.semester.end) return 0;
  const end = new Date(data.semester.end);
  const now = new Date();
  if (now >= end) return 0;

  const courseDays = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days.forEach((day, index) => {
    if (data.timetable[day]) {
      const occurrences = Object.values(data.timetable[day]).filter(id => id === courseId).length;
      if (occurrences > 0) courseDays.push({ index, occurrences });
    }
  });

  if (courseDays.length === 0) return 0;

  let remaining = 0;
  let curr = new Date(now);
  curr.setDate(curr.getDate() + 1); // Start from tomorrow

  while (curr <= end) {
    const dayStr = curr.toISOString().slice(0, 10);
    const isHoliday = data.holidays && data.holidays.some(h => h.date === dayStr);
    if (!isHoliday) {
      const match = courseDays.find(d => d.index === curr.getDay());
      if (match) {
        remaining += match.occurrences;
      }
    }
    curr.setDate(curr.getDate() + 1);
  }
  return remaining;
}
