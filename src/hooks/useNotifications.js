import { useEffect, useState } from 'react';
import { useTimetable } from './useTimetable';
import { useSubjects } from './useSubjects';

export function useNotifications() {
  const { getTodaySchedule } = useTimetable();
  const { subjects } = useSubjects();
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return false;
    const p = await Notification.requestPermission();
    setPermission(p);
    return p === 'granted';
  };

  useEffect(() => {
    if (permission !== 'granted') return;

    const periods = getTodaySchedule();
    if (!periods || periods.length === 0) return;

    // Check every minute for upcoming classes
    const interval = setInterval(() => {
      const now = new Date();
      
      periods.forEach(period => {
        if (!period.startTime) return;
        
        const [hours, minutes] = period.startTime.split(':');
        const classTime = new Date();
        classTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        // Notify 10 minutes before
        const diffMs = classTime - now;
        const diffMins = diffMs / 60000;
        
        if (diffMins > 9 && diffMins <= 10) {
          const subject = subjects.find(s => s.id === (period.subjectId || period.subject_id));
          const subName = subject ? subject.name : 'A class';
          
          new Notification('Upcoming Class! 📚', {
            body: `${subName} starts in 10 minutes.`,
            icon: '/favicon.svg'
          });
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [getTodaySchedule, subjects, permission]);

  return { permission, requestPermission };
}
