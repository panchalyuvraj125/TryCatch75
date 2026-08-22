/**
 * AM2 Batch Timetable Data
 * S.Y.B.Tech CSE-AIML, Semester III, Academic Year 2026–27, Version I
 *
 * This file contains the official AM2 batch schedule
 * with teacher names, locations, and subject metadata.
 */

// Subject master data with teacher mapping
export const SUBJECT_MASTER = {
  EM3: {
    code: 'EM3',
    fullName: 'Engineering Mathematics III',
    teacher: 'Prof. Mayur Gohil',
    type: 'theory',
  },
  DM: {
    code: 'DM',
    fullName: 'Discrete Mathematics',
    teacher: 'Prof. Tooba Shaikh',
    type: 'theory',
  },
  AI: {
    code: 'AI',
    fullName: 'Artificial Intelligence',
    teacher: 'Prof. Sureshsingh Rajpurohit',
    type: 'theory',
  },
  AIL: {
    code: 'AIL',
    fullName: 'Artificial Intelligence Lab',
    teacher: 'Prof. Sureshsingh Rajpurohit',
    type: 'lab',
  },
  DS: {
    code: 'DS',
    fullName: 'Data Structures',
    teacher: 'Prof. Avina Devadiga',
    type: 'theory',
  },
  PE: {
    code: 'PE',
    fullName: 'Prompt Engineering',
    teacher: 'Prof. Aneri Sheth',
    type: 'theory',
  },
  EB: {
    code: 'EB',
    fullName: 'E-Business',
    teacher: 'Govind Wakure',
    type: 'theory',
  },
  OOP: {
    code: 'OOP',
    fullName: 'Object Oriented Programming',
    teacher: 'Prof. Jharna Nagpal',
    type: 'theory',
  },
  OOPL: {
    code: 'OOPL',
    fullName: 'Object Oriented Programming Lab',
    teacher: 'Prof. Jharna Nagpal',
    type: 'lab',
  },
  'UHV-II': {
    code: 'UHV-II',
    fullName: 'Universal Human Values II',
    teacher: 'Prof. Neeraj Suchak',
    type: 'theory',
  },
  DSPPL: {
    code: 'DSPPL',
    fullName: 'Data Structures and Python Programming',
    teacher: 'Prof. Adarsh Chaube',
    type: 'theory',
  },
  'DSPPL LAB': {
    code: 'DSPPL LAB',
    fullName: 'Data Structures and Python Programming Lab',
    teacher: 'Prof. Adarsh Chaube',
    type: 'lab',
  },
  LCSM: {
    code: 'LCSM',
    fullName: 'Life of Chhatrapati Shivaji Maharaj',
    teacher: 'Prof. Prasad Dhuri',
    type: 'theory',
  },
  MDM: {
    code: 'MDM',
    fullName: 'Multi-Disciplinary Minor Course',
    teacher: '',
    type: 'theory',
  },
};

/**
 * AM2 batch-specific classes — only the sessions that are specifically for AM2.
 * Organized by day with real times and locations.
 */
export const AM2_SCHEDULE = {
  Mon: [],
  Tue: [
    {
      subject: 'DSPPL LAB',
      startTime: '16:00',
      endTime: '18:00',
      teacher: 'Prof. Adarsh Chaube',
      location: 'LAB-II, 5th Floor, SBMP',
      type: 'lab',
      batch: 'AM2',
    },
  ],
  Wed: [
    {
      subject: 'OOPL',
      startTime: '10:00',
      endTime: '12:00',
      teacher: 'Prof. Jharna Nagpal',
      location: 'CC1',
      type: 'lab',
      batch: 'AM2',
    },
    {
      subject: 'OOP',
      startTime: '11:00',
      endTime: '12:00',
      teacher: 'Prof. Jharna Nagpal',
      location: 'CC1',
      type: 'theory',
      batch: 'AM2',
      note: 'Lecture within OOP Lab slot',
    },
  ],
  Thu: [
    {
      subject: 'AIL',
      startTime: '11:00',
      endTime: '13:00',
      teacher: 'Prof. Sureshsingh Rajpurohit',
      location: 'CC1',
      type: 'lab',
      batch: 'AM2',
    },
    {
      subject: 'AI',
      startTime: '11:00',
      endTime: '12:00',
      teacher: 'Prof. Sureshsingh Rajpurohit',
      location: 'CC1',
      type: 'theory',
      batch: 'AM2',
      note: 'Lecture within AI Lab slot',
    },
  ],
  Fri: [
    {
      subject: 'DSPPL',
      startTime: '12:00',
      endTime: '14:00',
      teacher: 'Prof. Adarsh Chaube',
      location: '3rd Floor, HW Lab',
      type: 'lab',
      batch: 'AM2',
    },
  ],
  Sat: [],
};

/**
 * Full combined timetable reference (all batches visible).
 * This maps to the existing period structure (P1–P9, 08:00–17:00).
 * Teacher and location data is added where known.
 */
export const FULL_TIMETABLE_METADATA = {
  Mon: {
    0: { subject: 'EM3', location: '', teacher: 'Prof. Mayur Gohil' },
    1: { subject: 'EB', location: '', teacher: 'Govind Wakure' },
    2: { subject: 'EB', location: '', teacher: 'Govind Wakure' },
    3: { subject: 'DM', location: '', teacher: 'Prof. Tooba Shaikh' },
    4: { subject: 'UHV-II', location: '', teacher: 'Prof. Neeraj Suchak' },
  },
  Tue: {
    0: { subject: 'DS', location: '', teacher: 'Prof. Avina Devadiga' },
    1: { subject: 'DS', location: '', teacher: 'Prof. Avina Devadiga' },
    3: { subject: 'DM', location: '', teacher: 'Prof. Tooba Shaikh' },
    5: { subject: 'DSPPL', location: '', teacher: 'Prof. Adarsh Chaube', note: 'Theory' },
    6: { subject: 'DSPPL LAB', location: 'LAB-II, 5th Floor, SBMP', teacher: 'Prof. Adarsh Chaube' },
    7: { subject: 'DSPPL LAB', location: 'LAB-II, 5th Floor, SBMP', teacher: 'Prof. Adarsh Chaube' },
    8: { subject: 'MDM', location: '', teacher: '' },
  },
  Wed: {
    1: { subject: 'EB', location: '', teacher: 'Govind Wakure' },
    2: { subject: 'OOPL', location: 'CC1', teacher: 'Prof. Jharna Nagpal', batch: 'AM2' },
    3: { subject: 'OOPL', location: 'CC1', teacher: 'Prof. Jharna Nagpal', batch: 'AM2' },
    4: { subject: 'EM3', location: '', teacher: 'Prof. Mayur Gohil' },
    5: { subject: 'UHV-II', location: '', teacher: 'Prof. Neeraj Suchak' },
  },
  Thu: {
    0: { subject: 'MDM', location: '', teacher: '' },
    2: { subject: 'PE', location: '', teacher: 'Prof. Aneri Sheth' },
    3: { subject: 'AIL', location: 'CC1', teacher: 'Prof. Sureshsingh Rajpurohit', batch: 'AM2' },
    4: { subject: 'AIL', location: 'CC1', teacher: 'Prof. Sureshsingh Rajpurohit', batch: 'AM2' },
    5: { subject: 'EM3', location: '', teacher: 'Prof. Mayur Gohil' },
    7: { subject: 'DS', location: '', teacher: 'Prof. Avina Devadiga' },
    8: { subject: 'EM3', location: '', teacher: 'Prof. Mayur Gohil' },
  },
  Fri: {
    0: { subject: 'AI', location: '', teacher: 'Prof. Sureshsingh Rajpurohit' },
    1: { subject: 'LCSM', location: '', teacher: 'Prof. Prasad Dhuri' },
    2: { subject: 'UHV-II', location: '', teacher: 'Prof. Neeraj Suchak' },
    3: { subject: 'DM', location: '', teacher: 'Prof. Tooba Shaikh' },
    4: { subject: 'DSPPL', location: '3rd Floor, HW Lab', teacher: 'Prof. Adarsh Chaube', batch: 'AM2' },
  },
  Sat: {
    2: { subject: 'PE', location: '', teacher: 'Prof. Aneri Sheth' },
    3: { subject: 'PE', location: '', teacher: 'Prof. Aneri Sheth' },
  },
};

/**
 * Gets today's classes from the existing timetable data with AM2 metadata enrichment.
 */
export function enrichClassWithMetadata(day, periodIndex) {
  const meta = FULL_TIMETABLE_METADATA[day]?.[periodIndex];
  return meta || null;
}

/**
 * Gets the next upcoming class based on current time.
 * Uses the app's timetable data + AM2 metadata.
 */
export function getNextClass(state) {
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIdx = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const dateStr = now.toISOString().slice(0, 10);

  // Check if today is a holiday
  if (state.holidays?.some((h) => h.date === dateStr)) {
    return findNextDayClass(state, todayIdx, days);
  }

  const today = days[todayIdx];
  const daySchedule = state.timetable?.[today] || {};
  const dateOverrides = state.overrides?.[dateStr] || {};
  const mergedSchedule = { ...daySchedule, ...dateOverrides };

  // Find next class today
  const todayClasses = [];
  Object.entries(mergedSchedule).forEach(([period, courseId]) => {
    if (courseId) {
      const course = state.courses.find((c) => c.id === courseId);
      const time = state.periodTimes[parseInt(period)];
      if (course && time) {
        const [h, m] = time.start.split(':').map(Number);
        const startMinutes = h * 60 + m;
        todayClasses.push({
          course,
          time,
          period: parseInt(period),
          startMinutes,
          day: today,
          isToday: true,
          metadata: enrichClassWithMetadata(today, parseInt(period)),
        });
      }
    }
  });

  todayClasses.sort((a, b) => a.startMinutes - b.startMinutes);

  // Find next class that hasn't ended yet
  for (const cls of todayClasses) {
    const [eh, em] = cls.time.end.split(':').map(Number);
    const endMinutes = eh * 60 + em;
    if (endMinutes > currentMinutes) {
      return cls;
    }
  }

  // No more classes today, find next day
  return findNextDayClass(state, todayIdx, days);
}

function findNextDayClass(state, startDayIdx, days) {
  for (let offset = 1; offset <= 7; offset++) {
    const dayIdx = (startDayIdx + offset) % 7;
    const day = days[dayIdx];
    const daySchedule = state.timetable?.[day] || {};
    const classes = [];

    Object.entries(daySchedule).forEach(([period, courseId]) => {
      if (courseId) {
        const course = state.courses.find((c) => c.id === courseId);
        const time = state.periodTimes[parseInt(period)];
        if (course && time) {
          classes.push({
            course,
            time,
            period: parseInt(period),
            day,
            isToday: false,
            daysAway: offset,
            metadata: enrichClassWithMetadata(day, parseInt(period)),
          });
        }
      }
    });

    if (classes.length > 0) {
      classes.sort((a, b) => {
        const [ah, am] = a.time.start.split(':').map(Number);
        const [bh, bm] = b.time.start.split(':').map(Number);
        return ah * 60 + am - (bh * 60 + bm);
      });
      return classes[0];
    }
  }
  return null;
}

/**
 * Gets the current ongoing class (if any).
 */
export function getCurrentClass(state) {
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = days[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const dateStr = now.toISOString().slice(0, 10);

  if (state.holidays?.some((h) => h.date === dateStr)) return null;

  const daySchedule = state.timetable?.[today] || {};
  const dateOverrides = state.overrides?.[dateStr] || {};
  const mergedSchedule = { ...daySchedule, ...dateOverrides };

  for (const [period, courseId] of Object.entries(mergedSchedule)) {
    if (!courseId) continue;
    const course = state.courses.find((c) => c.id === courseId);
    const time = state.periodTimes[parseInt(period)];
    if (!course || !time) continue;

    const [sh, sm] = time.start.split(':').map(Number);
    const [eh, em] = time.end.split(':').map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    if (currentMinutes >= startMin && currentMinutes < endMin) {
      return {
        course,
        time,
        period: parseInt(period),
        day: today,
        metadata: enrichClassWithMetadata(today, parseInt(period)),
      };
    }
  }
  return null;
}

/**
 * Day display names
 */
export const DAY_NAMES = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};
