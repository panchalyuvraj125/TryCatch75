import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { formatDateKey } from '../utils/dateHelpers';
import { ATTENDANCE_STATUS } from '../utils/constants';

const STORAGE_KEY = 'tc75_attendance';

function getLocalAttendance() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalAttendance(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * Hook for attendance CRUD operations
 * Uses Firestore when configured, falls back to localStorage
 */
export function useAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState(() => getLocalAttendance());
  const [loading, setLoading] = useState(() => getLocalAttendance().length === 0);

  // Load attendance records
  useEffect(() => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured) {
      setRecords(getLocalAttendance());
      setLoading(false);
      return;
    }

    const attRef = collection(db, 'users', user.uid, 'attendance');
    const unsubscribe = onSnapshot(
      attRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecords(data);
        setLocalAttendance(data); // Cache locally
        setLoading(false);
      },
      (error) => {
        console.error('Attendance listener error:', error);
        setRecords(getLocalAttendance());
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  /**
   * Mark attendance for a subject on a date
   */
  const markAttendance = useCallback(
    async (date, subjectId, status, note = '') => {
      if (!user) return;

      const dateStr = typeof date === 'string' ? date : formatDateKey(date);
      const docId = `${dateStr}_${subjectId}`;
      const record = {
        date: dateStr,
        subjectId,
        status,
        note,
        markedAt: new Date().toISOString(),
      };

      if (!isFirebaseConfigured) {
        const existing = getLocalAttendance();
        const idx = existing.findIndex((r) => r.id === docId);
        if (idx >= 0) {
          existing[idx] = { ...record, id: docId };
        } else {
          existing.push({ ...record, id: docId });
        }
        setLocalAttendance(existing);
        setRecords(existing);
        return;
      }

      const docRef = doc(db, 'users', user.uid, 'attendance', docId);
      await setDoc(docRef, record, { merge: true });
    },
    [user]
  );

  /**
   * Bulk mark all subjects for a date
   */
  const bulkMark = useCallback(
    async (date, subjectIds, status) => {
      if (!user || !subjectIds.length) return;

      const dateStr = typeof date === 'string' ? date : formatDateKey(date);

      if (!isFirebaseConfigured) {
        const existing = getLocalAttendance();
        subjectIds.forEach((subjectId) => {
          const docId = `${dateStr}_${subjectId}`;
          const record = {
            id: docId,
            date: dateStr,
            subjectId,
            status,
            note: '',
            markedAt: new Date().toISOString(),
          };
          const idx = existing.findIndex((r) => r.id === docId);
          if (idx >= 0) existing[idx] = record;
          else existing.push(record);
        });
        setLocalAttendance(existing);
        setRecords(existing);
        return;
      }

      const batch = writeBatch(db);
      subjectIds.forEach((subjectId) => {
        const docId = `${dateStr}_${subjectId}`;
        const docRef = doc(db, 'users', user.uid, 'attendance', docId);
        batch.set(docRef, {
          date: dateStr,
          subjectId,
          status,
          note: '',
          markedAt: new Date().toISOString(),
        });
      });
      await batch.commit();
    },
    [user]
  );

  /**
   * Delete an attendance record
   */
  const deleteAttendance = useCallback(
    async (docId) => {
      if (!user) return;

      if (!isFirebaseConfigured) {
        const existing = getLocalAttendance().filter((r) => r.id !== docId);
        setLocalAttendance(existing);
        setRecords(existing);
        return;
      }

      const docRef = doc(db, 'users', user.uid, 'attendance', docId);
      await deleteDoc(docRef);
    },
    [user]
  );

  /**
   * Get records for a specific date
   */
  const getRecordsByDate = useCallback(
    (date) => {
      const dateStr = typeof date === 'string' ? date : formatDateKey(date);
      return records.filter((r) => r.date === dateStr);
    },
    [records]
  );

  /**
   * Get records for a specific subject
   */
  const getRecordsBySubject = useCallback(
    (subjectId) => {
      return records.filter((r) => r.subjectId === subjectId);
    },
    [records]
  );

  /**
   * Get attendance stats for a subject
   */
  const getSubjectStats = useCallback(
    (subjectId) => {
      const subRecords = records.filter((r) => r.subjectId === subjectId);
      const present = subRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
      const absent = subRecords.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
      const medical = subRecords.filter((r) => r.status === ATTENDANCE_STATUS.MEDICAL).length;
      const holiday = subRecords.filter((r) => r.status === ATTENDANCE_STATUS.HOLIDAY).length;
      const total = present + absent + medical; // Holidays don't count in total

      return { present, absent, medical, holiday, total };
    },
    [records]
  );

  /**
   * Check if attendance is marked for today
   */
  const isTodayMarked = useCallback(() => {
    const today = formatDateKey(new Date());
    return records.some((r) => r.date === today);
  }, [records]);

  /**
   * Get current streak (consecutive present days)
   */
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
        // Skip Sundays
        if (d.getDay() === 0) d.setDate(d.getDate() - 1);
        checkDate = formatDateKey(d);
      } else {
        break;
      }
    }

    return streak;
  }, [records]);

  /**
   * Get longest streak in records
   */
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
        // Allow 1 day gap (weekend) or consecutive
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
  };
}
