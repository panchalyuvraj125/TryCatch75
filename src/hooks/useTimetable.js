import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDayName } from '../utils/dateHelpers';

export function useTimetable() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);

  const getStorageKey = useCallback(() => `timetables_${user?.id}`, [user]);

  const fetchTimetable = useCallback(() => {
    if (!user) {
      setTimetable({});
      setLoading(false);
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
      const ttData = {};
      stored.forEach((item) => {
        ttData[item.day] = { periods: item.periods || [] };
      });
      setTimetable(ttData);
    } catch (e) {
      console.error('Error fetching timetable:', e);
      setTimetable({});
    }
    setLoading(false);
  }, [user, getStorageKey]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const setDaySchedule = useCallback(
    async (day, periods) => {
      if (!user) return;

      try {
        const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        const index = stored.findIndex(t => t.day === day);
        
        const updateData = {
          user_id: user.id,
          day,
          periods,
          updated_at: new Date().toISOString(),
        };

        if (index !== -1) {
          stored[index] = updateData;
        } else {
          stored.push(updateData);
        }

        localStorage.setItem(getStorageKey(), JSON.stringify(stored));
        fetchTimetable();
      } catch (e) {
        console.error('Error setting day schedule:', e);
      }
    },
    [user, getStorageKey, fetchTimetable]
  );

  const getTodaySchedule = useCallback(() => {
    const today = getDayName(new Date());
    const dayData = timetable[today];
    return dayData?.periods || [];
  }, [timetable]);

  const getTodaySubjectIds = useCallback(() => {
    const periods = getTodaySchedule();
    return [...new Set(periods.filter((p) => p.subjectId || p.subject_id).map((p) => p.subjectId || p.subject_id))];
  }, [getTodaySchedule]);

  const getDaySchedule = useCallback(
    (day) => {
      const dayData = timetable[day];
      return dayData?.periods || [];
    },
    [timetable]
  );

  return {
    timetable,
    loading,
    setDaySchedule,
    getTodaySchedule,
    getTodaySubjectIds,
    getDaySchedule,
    refresh: fetchTimetable,
  };
}
