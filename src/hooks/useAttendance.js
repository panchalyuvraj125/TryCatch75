import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatDateKey } from '../utils/dateHelpers';
import { ATTENDANCE_STATUS } from '../utils/constants';

export function useAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStorageKey = useCallback(() => `attendance_${user?.id}`, [user]);

  const fetchAttendance = useCallback(() => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
      const sorted = stored.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecords(sorted.map(r => ({ ...r, subjectId: r.subject_id, markedAt: r.marked_at })));
    } catch (e) {
      console.error('Error fetching attendance:', e);
      setRecords([]);
    }
    setLoading(false);
  }, [user, getStorageKey]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const markAttendance = useCallback(
    async (date, subjectId, status, note = '') => {
      if (!user) return;

      const dateStr = typeof date === 'string' ? date : formatDateKey(date);

      try {
        const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        const index = stored.findIndex(r => r.subject_id === subjectId && r.date === dateStr);
        
        const record = {
          id: index !== -1 && stored[index].id ? stored[index].id : 'att_' + Date.now().toString() + Math.random().toString(36).substr(2, 9),
          user_id: user.id,
          subject_id: subjectId,
          date: dateStr,
          status,
          note,
          marked_at: new Date().toISOString(),
        };

        if (index !== -1) {
          stored[index] = record;
        } else {
          stored.push(record);
        }

        localStorage.setItem(getStorageKey(), JSON.stringify(stored));
        fetchAttendance();
      } catch (e) {
        console.error('Error marking attendance:', e);
      }
    },
    [user, getStorageKey, fetchAttendance]
  );

  const bulkMark = useCallback(
    async (date, subjectIds, status, note = '') => {
      if (!user || !subjectIds.length) return;

      const dateStr = typeof date === 'string' ? date : formatDateKey(date);

      try {
        const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        
        subjectIds.forEach(subjectId => {
          const index = stored.findIndex(r => r.subject_id === subjectId && r.date === dateStr);
          
          const record = {
            id: index !== -1 && stored[index].id ? stored[index].id : 'att_' + Date.now().toString() + Math.random().toString(36).substr(2, 9),
            user_id: user.id,
            subject_id: subjectId,
            date: dateStr,
            status,
            note: note,
            marked_at: new Date().toISOString(),
          };

          if (index !== -1) {
            stored[index] = record;
          } else {
            stored.push(record);
          }
        });

        localStorage.setItem(getStorageKey(), JSON.stringify(stored));
        fetchAttendance();
      } catch (e) {
        console.error('Error bulk marking attendance:', e);
      }
    },
    [user, getStorageKey, fetchAttendance]
  );

  const deleteAttendance = useCallback(
    async (recordId) => {
      if (!user) return;

      try {
        const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        const filtered = stored.filter(r => r.id !== recordId);
        localStorage.setItem(getStorageKey(), JSON.stringify(filtered));
        fetchAttendance();
      } catch (e) {
        console.error('Error deleting attendance:', e);
      }
    },
    [user, getStorageKey, fetchAttendance]
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
      const official = subRecords.filter((r) => r.status === ATTENDANCE_STATUS.OFFICIAL).length;
      const holiday = subRecords.filter((r) => r.status === ATTENDANCE_STATUS.HOLIDAY).length;
      // Medical and Official leaves are excused (they don't count towards the total denominator)
      const total = present + absent;

      return { present, absent, medical, official, holiday, total };
    },
    [records]
  );

  const isTodayMarked = useCallback(() => {
    const today = formatDateKey(new Date());
    return records.some((r) => r.date === today);
  }, [records]);

  const getCurrentStreak = useCallback(() => {
    const dates = [...new Set(records.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).map((r) => r.date))].sort().reverse();
    const holidays = JSON.parse(localStorage.getItem(`holidays_${user?.id}`) || '[]');

    let streak = 0;
    const today = formatDateKey(new Date());
    let checkDate = today;

    // We check back up to 60 days to find the streak
    for (let i = 0; i < 60; i++) {
      if (holidays.includes(checkDate)) {
        // Skip holiday
      } else if (dates.includes(checkDate)) {
        streak++;
      } else if (checkDate === today) {
        // Today might not be marked yet, that's fine, don't break streak
      } else {
        const d = new Date(checkDate);
        if (d.getDay() !== 0) { // If it's a weekday and not marked and not holiday, streak breaks
          break;
        }
      }

      const d = new Date(checkDate);
      d.setDate(d.getDate() - 1);
      checkDate = formatDateKey(d);
    }

    return streak;
  }, [records, user?.id]);

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
