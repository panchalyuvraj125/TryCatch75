export const STORAGE_KEY = 'trycatch75_data_v14';

const DEFAULT_DATA = {
  personalInfo: {
    name: 'Yuvraj Panchal ',
    rollNumber: 'BA43',
    branch: 'AI & ML',
    year: '2',
    semester: '3',
    section: 'AM2',
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
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    { start: '13:00', end: '14:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' },
  ],
  overrides: {},
  attendanceLog: [],
  holidays: [],
  semester: { start: '2026-08-03', end: '2026-12-15' },
  setupComplete: true,
};

export const DEFAULT_GLOBAL_DATA = {
  "activeSemesterId": "demo-sem",
  "semesters": {
    "demo-sem": {
      "personalInfo": {
        "name": "Yuvraj Panchal ",
        "rollNumber": "BA43",
        "branch": "AI & ML",
        "year": "2",
        "semester": "3",
        "section": "AM2"
      },
      "courses": [
        {
          "id": "c1",
          "code": "25AF1XXXOEM305X",
          "name": "Open Elective (E-Business)",
          "minAttendance": 75,
          "goalAttendance": 85,
          "color": "#ef4444"
        },
        {
          "id": "c2",
          "code": "25AF1245PC303",
          "name": "Discrete Mathematics",
          "minAttendance": 75,
          "goalAttendance": 80,
          "color": "#3b82f6"
        },
        {
          "id": "c3",
          "code": "25AF1000VE310",
          "name": "Universal Human Values-II",
          "minAttendance": 75,
          "goalAttendance": 90,
          "color": "#10b981"
        },
        {
          "id": "c4",
          "code": "25AFAIPC304",
          "name": "Artificial Intelligence",
          "minAttendance": 75,
          "goalAttendance": 75,
          "color": "#f59e0b"
        },
        {
          "id": "c5",
          "code": "25AFAIPCL311",
          "name": "Artificial Intelligence Laboratory",
          "minAttendance": 75,
          "goalAttendance": 75,
          "color": "#8b5cf6"
        },
        {
          "id": "c6",
          "code": "25AF1245PC302",
          "name": "Data Structures",
          "minAttendance": 75,
          "goalAttendance": 75,
          "color": "#ec4899"
        },
        {
          "id": "c7",
          "code": "25AF1000VE308A",
          "name": "Life of Chhatrapati Shivaji Maharaj",
          "minAttendance": 75,
          "goalAttendance": 75,
          "color": "#14b8a6"
        },
        {
          "id": "c8",
          "code": "25AF1000BS301",
          "name": "Engineering Mathematics-III",
          "minAttendance": 75,
          "goalAttendance": 75,
          "color": "#6366f1"
        },
        {
          "id": "c9",
          "code": "25AFAIPC307",
          "name": "Prompt Engineering",
          "minAttendance": 75,
          "goalAttendance": 75,
          "color": "#84cc16"
        },
        {
          "id": "c10",
          "code": "25AF1245MD306B-TH",
          "name": "MINOR-OOP",
          "minAttendance": 75,
          "goalAttendance": 75,
          "color": "#f43f5e"
        },
        {
          "id": "c11",
          "code": "25AFAIPCL309-TH",
          "name": "Data Structures Laboratory with Python (Theory)",
          "minAttendance": 75,
          "goalAttendance": 75,
          "color": "#a855f7"
        },
        {
          "id": "c12",
          "code": "25AFAIPCL309-PR",
          "name": "Data Structures Laboratory with Python (Practical)",
          "minAttendance": 75,
          "goalAttendance": 75,
          "color": "#d946ef"
        },
        {
          "id": "c9f57314-fbda-4cde-8f09-356e16f7cb41",
          "code": "25AF1245MDL306B-PR",
          "name": "MINOR-OOPSL",
          "minAttendance": 75,
          "goalAttendance": 85,
          "color": "#0070f3"
        }
      ],
      "timetable": {
        "Mon": {
          "0": "c4",
          "1": "c1",
          "2": "c1",
          "3": "c2",
          "4": "c3"
        },
        "Tue": {
          "2": "c9",
          "3": "c2",
          "5": "c6",
          "6": "c6",
          "7": "c11",
          "8": "c12",
          "9": "c12"
        },
        "Wed": {
          "2": "c9f57314-fbda-4cde-8f09-356e16f7cb41",
          "3": "c9f57314-fbda-4cde-8f09-356e16f7cb41",
          "4": "c8",
          "5": "c3",
          "7": "c1"
        },
        "Thu": {
          "0": "c10",
          "1": "c10",
          "2": "c8",
          "3": "c5",
          "4": "c5",
          "5": "c8",
          "7": "c6",
          "8": "c9"
        },
        "Fri": {
          "0": "c4",
          "1": "c7",
          "2": "c3",
          "3": "c2",
          "4": "c12",
          "5": "c12"
        },
        "Sat": {}
      },
      "periodTimes": [
        {
          "start": "08:00",
          "end": "09:00"
        },
        {
          "start": "09:00",
          "end": "10:00"
        },
        {
          "start": "10:00",
          "end": "11:00"
        },
        {
          "start": "11:00",
          "end": "12:00"
        },
        {
          "start": "12:00",
          "end": "13:00"
        },
        {
          "start": "13:00",
          "end": "14:00"
        },
        {
          "start": "14:00",
          "end": "15:00"
        },
        {
          "start": "15:00",
          "end": "16:00"
        },
        {
          "start": "16:00",
          "end": "17:00"
        },
        {
          "start": "17:00",
          "end": "18:00"
        }
      ],
      "overrides": {
        "2026-09-02": {
          "0": null,
          "1": "c3",
          "2": "c5",
          "3": "c5",
          "4": "c8",
          "5": null,
          "7": "c1"
        },
        "2026-09-03": {
          "0": "c10",
          "1": "c10",
          "2": "c8",
          "3": "c12",
          "4": "c12",
          "5": "c8",
          "7": "c6",
          "8": "c9"
        }
      },
      "attendanceLog": [],
      "holidays": [
        {
          "id": "h1",
          "date": "2026-08-15",
          "label": "Independence Day"
        },
        {
          "id": "788a6137-eb5e-4a52-abe1-8cd2cc894907",
          "date": "2026-08-26",
          "label": "Milab-un-Nabi"
        },
        {
          "id": "6cd399de-d7e1-4dfc-8241-e0060fb48c24",
          "date": "2026-08-28",
          "label": "Raksha Bandhan"
        }
      ],
      "semester": {
        "start": "2026-08-03",
        "end": "2026-12-15"
      },
      "setupComplete": true,
      "id": "demo-sem",
      "label": "Semester 3"
    }
  },
  "theme": "dark"
};

export function getData() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    
    // Auto-migrate to v10
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GLOBAL_DATA));
      return DEFAULT_GLOBAL_DATA;
    }
    
    let parsed = JSON.parse(raw);
    
    if (parsed.courses && !parsed.semesters) {
      const semData = { ...DEFAULT_DATA, ...parsed };
      delete semData.theme;
      parsed = {
        activeSemesterId: 'demo-sem',
        semesters: {
          'demo-sem': { id: 'demo-sem', label: 'Semester 3 (Version-III)', ...semData }
        },
        theme: parsed.theme || 'dark'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    
    // Safety merge: ensure active semester has all DEFAULT_DATA fields
    const finalData = { ...DEFAULT_GLOBAL_DATA, ...parsed };
    if (finalData.semesters && finalData.activeSemesterId) {
       const activeId = finalData.activeSemesterId;
       if (finalData.semesters[activeId]) {
         finalData.semesters[activeId] = { ...DEFAULT_DATA, ...finalData.semesters[activeId] };
       }
    }
    return finalData;
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
                'default': { id: 'default', label: 'Semester 3', ...DEFAULT_DATA, ...semData }
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

/**
 * Filters out orphan/phantom attendance log entries that don't match
 * the actual schedule (timetable + overrides) for their date.
 */
function getValidLogs(data) {
  const scheduleCache = {};
  const getScheduleSet = (dateStr) => {
    if (!scheduleCache[dateStr]) {
      const classes = getClassesForDate(data, dateStr);
      scheduleCache[dateStr] = new Set(classes.map(c => `${c.course.id}::${c.period}`));
    }
    return scheduleCache[dateStr];
  };

  return data.attendanceLog.filter(log => {
    const validSet = getScheduleSet(log.date);
    return validSet.has(`${log.courseId}::${log.period}`);
  });
}

export function getAttendanceForCourse(data, courseId) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const startStr = data.semester?.start || '1970-01-01';

  const logs = getValidLogs(data).filter((l) => 
    l.courseId === courseId &&
    l.date >= startStr &&
    l.date <= todayStr
  );
  const total = logs.filter((l) => l.status !== 'cancelled').length;
  const presentCount = logs.filter((l) => l.status === 'present').length;
  const odCount = logs.filter((l) => l.status === 'od').length;
  const medicalCount = logs.filter((l) => l.status === 'medical').length;
  const attended = presentCount + odCount + medicalCount;
  const missed = logs.filter((l) => l.status === 'absent').length;
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
  return { total, attended, presentCount, odCount, medicalCount, missed, percentage };
}

export function getOverallAttendance(data) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const startStr = data.semester?.start || '1970-01-01';

  const logs = getValidLogs(data).filter((l) => 
    l.status !== 'cancelled' &&
    l.date >= startStr &&
    l.date <= todayStr
  );
  const total = logs.length;
  const presentCount = logs.filter((l) => l.status === 'present').length;
  const odCount = logs.filter((l) => l.status === 'od').length;
  const medicalCount = logs.filter((l) => l.status === 'medical').length;
  const attended = presentCount + odCount + medicalCount;
  const missed = logs.filter((l) => l.status === 'absent').length;
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
  return { total, attended, presentCount, odCount, medicalCount, missed, percentage };
}

export function getTodayClasses(data) {
  const dateStr = new Date().toISOString().slice(0, 10);
  if (data.holidays && data.holidays.some(h => h.date === dateStr)) {
    return [];
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = days[new Date().getDay()];
  const daySchedule = data.timetable?.[today] || {};
  const dateOverrides = data.overrides?.[dateStr] || {};
  
  const mergedSchedule = { ...daySchedule, ...dateOverrides };
  const classes = [];

  Object.entries(mergedSchedule).forEach(([period, courseId]) => {
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
  const daySchedule = data.timetable?.[day] || {};
  const dateOverrides = data.overrides?.[dateStr] || {};

  const mergedSchedule = { ...daySchedule, ...dateOverrides };
  const classes = [];

  Object.entries(mergedSchedule).forEach(([period, courseId]) => {
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
