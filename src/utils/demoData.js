import { formatDateKey } from './dateHelpers';

export const loadDemoData = (userId) => {
  if (!userId) return;

  // 1. Subjects
  const subjects = [
    { id: 'sub_demo_1', name: 'Data Structures & Algorithms', type: 'theory', target_attendance: 75 },
    { id: 'sub_demo_2', name: 'DSA Lab', type: 'lab', target_attendance: 100 },
    { id: 'sub_demo_3', name: 'Operating Systems', type: 'theory', target_attendance: 75 },
    { id: 'sub_demo_4', name: 'Computer Networks', type: 'theory', target_attendance: 75 },
    { id: 'sub_demo_5', name: 'Database Management', type: 'theory', target_attendance: 75 },
  ];
  localStorage.setItem(`subjects_${userId}`, JSON.stringify(subjects));

  // 2. Timetable
  const timetable = {
    monday: { periods: [
      { id: 'p1', startTime: '09:00', endTime: '10:00', subjectId: 'sub_demo_1' },
      { id: 'p2', startTime: '10:00', endTime: '11:00', subjectId: 'sub_demo_3' },
      { id: 'p3', startTime: '11:15', endTime: '13:15', subjectId: 'sub_demo_2' },
    ]},
    tuesday: { periods: [
      { id: 'p4', startTime: '09:00', endTime: '10:00', subjectId: 'sub_demo_4' },
      { id: 'p5', startTime: '10:00', endTime: '11:00', subjectId: 'sub_demo_5' },
      { id: 'p6', startTime: '11:15', endTime: '12:15', subjectId: 'sub_demo_1' },
    ]},
    wednesday: { periods: [
      { id: 'p7', startTime: '09:00', endTime: '10:00', subjectId: 'sub_demo_3' },
      { id: 'p8', startTime: '10:00', endTime: '11:00', subjectId: 'sub_demo_4' },
      { id: 'p9', startTime: '11:15', endTime: '13:15', subjectId: 'sub_demo_2' },
    ]},
    thursday: { periods: [
      { id: 'p10', startTime: '09:00', endTime: '10:00', subjectId: 'sub_demo_5' },
      { id: 'p11', startTime: '10:00', endTime: '11:00', subjectId: 'sub_demo_1' },
      { id: 'p12', startTime: '11:15', endTime: '12:15', subjectId: 'sub_demo_3' },
    ]},
    friday: { periods: [
      { id: 'p13', startTime: '09:00', endTime: '10:00', subjectId: 'sub_demo_4' },
      { id: 'p14', startTime: '10:00', endTime: '11:00', subjectId: 'sub_demo_5' },
    ]},
  };
  localStorage.setItem(`timetable_${userId}`, JSON.stringify(timetable));

  // 3. Attendance Records (Past 3 weeks)
  const records = [];
  const today = new Date();
  
  for (let i = 21; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[d.getDay()];

    if (dayName === 'sunday' || dayName === 'saturday') continue; // Skip weekends

    // Make one day a holiday
    if (i === 10) continue; 

    const daySchedule = timetable[dayName]?.periods || [];
    
    daySchedule.forEach(period => {
      // 80% chance present, 10% absent, 5% medical, 5% official
      const rand = Math.random();
      let status = 'present';
      if (rand > 0.95) status = 'official';
      else if (rand > 0.90) status = 'medical';
      else if (rand > 0.80) status = 'absent';
      
      // DSA Lab is 100% target, so let's make it almost always present
      if (period.subjectId === 'sub_demo_2' && Math.random() > 0.05) status = 'present';

      records.push({
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        subjectId: period.subjectId,
        date: dateStr,
        status: status,
        marked_at: new Date(d.setHours(14)).toISOString()
      });
    });
  }
  localStorage.setItem(`attendance_${userId}`, JSON.stringify(records));

  // 4. Holidays
  const holidayDate = new Date(today);
  holidayDate.setDate(holidayDate.getDate() - 10);
  localStorage.setItem(`holidays_${userId}`, JSON.stringify([formatDateKey(holidayDate)]));

  // 5. Deadlines
  const dl1 = new Date(today);
  dl1.setDate(dl1.getDate() + 2);
  const dl2 = new Date(today);
  dl2.setDate(dl2.getDate() + 5);
  const deadlines = [
    { id: 'dl_demo_1', title: 'OS Midsem Exam', date: dl1.toISOString(), type: 'exam' },
    { id: 'dl_demo_2', title: 'CN Assignment 3', date: dl2.toISOString(), type: 'assignment' },
  ];
  localStorage.setItem(`deadlines_${userId}`, JSON.stringify(deadlines));

  // 6. Settings flags
  const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
  if (profiles[userId]) {
    profiles[userId].autoPilotEnabled = true;
    profiles[userId].threshold = 75;
    localStorage.setItem('profiles', JSON.stringify(profiles));
  }

  // Refresh page to load everything seamlessly
  window.location.reload();
};

export const clearDemoData = (userId) => {
  if (!userId) return;
  localStorage.removeItem(`subjects_${userId}`);
  localStorage.removeItem(`timetable_${userId}`);
  localStorage.removeItem(`attendance_${userId}`);
  localStorage.removeItem(`holidays_${userId}`);
  localStorage.removeItem(`deadlines_${userId}`);
  window.location.reload();
};

export const clearDemoData = (userId) => {
  if (!userId) return;
  localStorage.removeItem(`subjects_${userId}`);
  localStorage.removeItem(`timetable_${userId}`);
  localStorage.removeItem(`attendance_${userId}`);
  localStorage.removeItem(`holidays_${userId}`);
  localStorage.removeItem(`deadlines_${userId}`);
  window.location.reload();
};
