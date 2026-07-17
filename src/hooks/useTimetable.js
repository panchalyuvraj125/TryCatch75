import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getDayName } from '../utils/dateHelpers';

export function useTimetable() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchTimetable = useCallback(async () => {
    if (!user) {
      setTimetable({});
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('timetables')
      .select('*')
      .eq('user_id', user.id);

    if (!error && data) {
      const ttData = {};
      data.forEach((item) => {
        ttData[item.day] = { periods: item.periods || [] };
      });
      setTimetable(ttData);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const setDaySchedule = useCallback(
    async (day, periods) => {
      if (!user) return;

      const { error } = await supabase
        .from('timetables')
        .upsert({
          user_id: user.id,
          day,
          periods,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,day' });

      if (!error) {
        await fetchTimetable();
      }
    },
    [user, fetchTimetable]
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
