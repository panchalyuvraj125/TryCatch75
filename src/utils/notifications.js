export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return Promise.resolve(false);
  }
  
  if (Notification.permission === 'granted') {
    return Promise.resolve(true);
  }

  return Notification.requestPermission().then(permission => {
    return permission === 'granted';
  });
}

export function scheduleClassNotifications(state) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const dayStr = days[now.getDay()];
  const dateStr = now.toISOString().slice(0, 10);

  // Check holidays
  if (state.holidays && state.holidays.some(h => h.date === dateStr)) return;

  const daySchedule = state.timetable?.[dayStr] || {};
  
  Object.entries(daySchedule).forEach(([periodIdxStr, courseId]) => {
    const periodIdx = parseInt(periodIdxStr);
    const course = state.courses.find(c => c.id === courseId);
    const time = state.periodTimes[periodIdx];
    
    if (course && time && time.start) {
      const [hours, minutes] = time.start.split(':').map(Number);
      const classTime = new Date();
      classTime.setHours(hours, minutes, 0, 0);
      
      const timeUntilClass = classTime.getTime() - now.getTime();
      const tenMinutes = 10 * 60 * 1000;
      
      // If class is starting in exactly 10 minutes or less (but hasn't started)
      if (timeUntilClass > 0 && timeUntilClass <= tenMinutes) {
        // Only notify if we haven't already notified for this class today
        const notifiedKey = `notified_${dateStr}_${courseId}_${periodIdx}`;
        if (!localStorage.getItem(notifiedKey)) {
          new Notification('Class Starting Soon', {
            body: `${course.code} - ${course.name} starts in ${Math.round(timeUntilClass / 60000)} minutes.`,
            icon: '/icon-192.png' // assuming PWA icon exists
          });
          localStorage.setItem(notifiedKey, 'true');
        }
      }
    }
  });
}
