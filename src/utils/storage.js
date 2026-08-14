const STORAGE_KEY = 'trycatch75_data_v6';

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
  overrides: {},
  attendanceLog: [],
  holidays: [],
  semester: { start: '', end: '' },
  setupComplete: false,
};

const DEFAULT_GLOBAL_DATA = {
  "activeSemesterId": "demo-sem",
  "semesters": {
    "demo-sem": {
      "id": "demo-sem",
      "label": "Demo Semester",
      "personalInfo": {
        "name": "Jane Doe",
        "rollNumber": "2024CS101",
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
          "code": "25AFAIMD306",
          "name": "Multi-Disciplinary Minor Course",
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
        }
      ],
      "timetable": {
        "Mon": {
          "0": "c8",
          "1": "c1",
          "2": "c1",
          "3": "c2",
          "4": "c3"
        },
        "Tue": {
          "0": "c6",
          "1": "c6",
          "3": "c2",
          "5": "c11",
          "6": "c12",
          "7": "c12",
          "8": "c10"
        },
        "Wed": {
          "1": "c1",
          "2": "c12",
          "3": "c12",
          "4": "c8",
          "5": "c3"
        },
        "Thu": {
          "0": "c10",
          "2": "c9",
          "3": "c5",
          "4": "c5",
          "5": "c8",
          "7": "c6",
          "8": "c8"
        },
        "Fri": {
          "0": "c4",
          "1": "c7",
          "2": "c3",
          "3": "c2",
          "4": "c4"
        },
        "Sat": {
          "2": "c9",
          "3": "c9"
        }
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
        }
      ],
      "attendanceLog": [
        {
          "date": "2026-08-03",
          "courseId": "c8",
          "period": 0,
          "status": "cancelled"
        },
        {
          "date": "2026-08-03",
          "courseId": "c1",
          "period": 1,
          "status": "present"
        },
        {
          "date": "2026-08-03",
          "courseId": "c1",
          "period": 2,
          "status": "present"
        },
        {
          "date": "2026-08-03",
          "courseId": "c2",
          "period": 3,
          "status": "present"
        },
        {
          "date": "2026-08-03",
          "courseId": "c3",
          "period": 4,
          "status": "present"
        },
        {
          "date": "2026-08-05",
          "courseId": "c1",
          "period": 1,
          "status": "present"
        },
        {
          "date": "2026-08-05",
          "courseId": "c12",
          "period": 2,
          "status": "present"
        },
        {
          "date": "2026-08-05",
          "courseId": "c12",
          "period": 3,
          "status": "present"
        },
        {
          "date": "2026-08-05",
          "courseId": "c8",
          "period": 4,
          "status": "present"
        },
        {
          "date": "2026-08-05",
          "courseId": "c3",
          "period": 5,
          "status": "present"
        },
        {
          "date": "2026-08-06",
          "courseId": "c12",
          "period": 3,
          "status": "present"
        },
        {
          "date": "2026-08-06",
          "courseId": "c12",
          "period": 4,
          "status": "present"
        },
        {
          "date": "2026-08-06",
          "courseId": "c6",
          "period": 5,
          "status": "present"
        },
        {
          "date": "2026-08-07",
          "courseId": "c7",
          "period": 1,
          "status": "absent"
        },
        {
          "date": "2026-08-07",
          "courseId": "c4",
          "period": 2,
          "status": "absent"
        },
        {
          "date": "2026-08-07",
          "courseId": "c2",
          "period": 3,
          "status": "absent"
        },
        {
          "date": "2026-08-07",
          "courseId": "c3",
          "period": 4,
          "status": "absent"
        },
        {
          "date": "2026-08-10",
          "courseId": "c8",
          "period": 0,
          "status": "cancelled"
        },
        {
          "date": "2026-08-10",
          "courseId": "c1",
          "period": 1,
          "status": "present"
        },
        {
          "date": "2026-08-10",
          "courseId": "c1",
          "period": 2,
          "status": "present"
        },
        {
          "date": "2026-08-10",
          "courseId": "c2",
          "period": 3,
          "status": "present"
        },
        {
          "date": "2026-08-10",
          "courseId": "c3",
          "period": 4,
          "status": "present"
        },
        {
          "date": "2026-08-11",
          "courseId": "c6",
          "period": 0,
          "status": "present"
        },
        {
          "date": "2026-08-11",
          "courseId": "c6",
          "period": 1,
          "status": "present"
        },
        {
          "date": "2026-08-11",
          "courseId": "c2",
          "period": 3,
          "status": "present"
        },
        {
          "date": "2026-08-11",
          "courseId": "c11",
          "period": 5,
          "status": "cancelled"
        },
        {
          "date": "2026-08-11",
          "courseId": "c12",
          "period": 6,
          "status": "cancelled"
        },
        {
          "date": "2026-08-11",
          "courseId": "c12",
          "period": 7,
          "status": "cancelled"
        },
        {
          "date": "2026-08-11",
          "courseId": "c10",
          "period": 8,
          "status": "cancelled"
        },
        {
          "date": "2026-08-12",
          "courseId": "c1",
          "period": 1,
          "status": "present"
        },
        {
          "date": "2026-08-12",
          "courseId": "c12",
          "period": 2,
          "status": "present"
        },
        {
          "date": "2026-08-12",
          "courseId": "c12",
          "period": 3,
          "status": "present"
        },
        {
          "date": "2026-08-12",
          "courseId": "c8",
          "period": 4,
          "status": "cancelled"
        },
        {
          "date": "2026-08-12",
          "courseId": "c3",
          "period": 5,
          "status": "present"
        },
        {
          "date": "2026-08-13",
          "courseId": "c10",
          "period": 0,
          "status": "present"
        },
        {
          "date": "2026-08-13",
          "courseId": "c9",
          "period": 2,
          "status": "present"
        },
        {
          "date": "2026-08-13",
          "courseId": "c5",
          "period": 3,
          "status": "present"
        },
        {
          "date": "2026-08-13",
          "courseId": "c5",
          "period": 4,
          "status": "present"
        },
        {
          "date": "2026-08-13",
          "courseId": "c8",
          "period": 5,
          "status": "present"
        },
        {
          "date": "2026-08-13",
          "courseId": "c6",
          "period": 7,
          "status": "absent"
        },
        {
          "date": "2026-08-13",
          "courseId": "c8",
          "period": 8,
          "status": "cancelled"
        }
      ],
      "holidays": [
        {
          "id": "h1",
          "date": "2026-08-15",
          "label": "Independence Day"
        },
        {
          "id": "h2",
          "date": "2026-09-05",
          "label": "Teacher's Day"
        }
      ],
      "semester": {
        "start": "2026-08-03",
        "end": "2026-12-15"
      },
      "setupComplete": true
    }
  },
  "theme": "dark"
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

function getUniqueClassLogs(logs) {
  const latestLogByClass = new Map();
  logs.forEach((log) => {
    if (!log?.date || !log?.courseId || typeof log.period !== 'number') return;
    latestLogByClass.set(`${log.date}|${log.courseId}|${log.period}`, log);
  });
  return Array.from(latestLogByClass.values());
}

export function getAttendanceForCourse(data, courseId) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const startStr = data.semester?.start || '1970-01-01';

  const logs = getUniqueClassLogs(data.attendanceLog.filter((l) => 
    l.courseId === courseId &&
    l.date >= startStr &&
    l.date <= todayStr
  ));
  const total = logs.filter((l) => l.status !== 'cancelled').length;
  const attended = logs.filter((l) => l.status === 'present').length;
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
  return { total, attended, missed: total - attended, percentage };
}

export function getOverallAttendance(data) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const startStr = data.semester?.start || '1970-01-01';

  const logs = getUniqueClassLogs(data.attendanceLog.filter((l) => 
    l.status !== 'cancelled' &&
    l.date >= startStr &&
    l.date <= todayStr
  ));
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
