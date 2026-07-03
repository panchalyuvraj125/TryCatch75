import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDateKey } from '../utils/dateHelpers';
import { ATTENDANCE_STATUS } from '../utils/constants';

export function useAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(async () => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (!error && data) {
      setRecords(data.map(r => ({ ...r, subjectId: r.subject_id, markedAt: r.marked_at })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const markAttendance = useCallback(
    async (date, subjectId, status, note = '') => {
      if (!user) return;

      const dateStr = typeof date === 'string' ? date : formatDateKey(date);

      const { error } = await supabase
        .from('attendance')
        .upsert({
          user_id: user.id,
          subject_id: subjectId,
          date: dateStr,
          status,
          note,
          marked_at: new Date().toISOString(),
        }, { onConflict: 'user_id,subject_id,date' });

      if (!error) {
        await fetchAttendance();
      }
    },
    [user, fetchAttendance]
  );

  const bulkMark = useCallback(
    async (date, subjectIds, status) => {
      if (!user || !subjectIds.length) return;

      const dateStr = typeof date === 'string' ? date : formatDateKey(date);

      const inserts = subjectIds.map((subjectId) => ({
        user_id: user.id,
        subject_id: subjectId,
        date: dateStr,
        status,
        note: '',
        marked_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('attendance')
        .upsert(inserts, { onConflict: 'user_id,subject_id,date' });

      if (!error) {
        await fetchAttendance();
      }
    },
    [user, fetchAttendance]
  );

  const deleteAttendance = useCallback(
    async (recordId) => {
      if (!user) return;

      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', recordId)
        .eq('user_id', user.id);

      if (!error) {
        await fetchAttendance();
      }
    },
    [user, fetchAttendance]
  );

  const getRecordsByDate = useCallback(
    (date) => {
      const dateStr = typeof date === 'string' ? date : formatDateKey(date);
      return records.filter((r) => r.date === dateStr);
    },
    [records]
  );

  const getRecordsBySubject = useCallback(
    (subjectId) => {
      return records.filter((r) => r.subject_id === subjectId || r.subjectId === subjectId);
    },
    [records]
  );

  const getSubjectStats = useCallback(
    (subjectId) => {
      const subRecords = records.filter((r) => r.subject_id === subjectId || r.subjectId === subjectId);
      const present = subRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
      const absent = subRecords.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
      const medical = subRecords.filter((r) => r.status === ATTENDANCE_STATUS.MEDICAL).length;
      const holiday = subRecords.filter((r) => r.status === ATTENDANCE_STATUS.HOLIDAY).length;
      const total = present + absent + medical;

      return { present, absent, medical, holiday, total };
    },
    [records]
  );

  const isTodayMarked = useCallback(() => {
    const today = formatDateKey(new Date());
    return records.some((r) => r.date === today);
  }, [records]);

  const getCurrentStreak = useCallback(() => {
    const dates = [...new Set(records.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).map((r) => r.date))].sort().reverse();

    let streak = 0;
    const today = formatDateKey(new Date());
    let checkDate = today;

    for (const date of dates) {
      if (date === checkDate || date === today) {
        streak++;
        const d = new Date(date);
        d.setDate(d.getDate() - 1);
        if (d.getDay() === 0) d.setDate(d.getDate() - 1);
        checkDate = formatDateKey(d);
      } else {
        break;
      }
    }

    return streak;
  }, [records]);

  const getLongestStreak = useCallback(() => {
    const presentDates = [...new Set(records.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).map((r) => r.date))].sort();

    let longest = 0;
    let current = 0;

    for (let i = 0; i < presentDates.length; i++) {
      if (i === 0) {
        current = 1;
      } else {
        const prev = new Date(presentDates[i - 1]);
        const curr = new Date(presentDates[i]);
        const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
        if (diff <= 2) {
          current++;
        } else {
          current = 1;
        }
      }
      longest = Math.max(longest, current);
    }

    return longest;
  }, [records]);

  return {
    records,
    loading,
    markAttendance,
    bulkMark,
    deleteAttendance,
    getRecordsByDate,
    getRecordsBySubject,
    getSubjectStats,
    isTodayMarked,
    getCurrentStreak,
    getLongestStreak,
    refresh: fetchAttendance,
  };
}
