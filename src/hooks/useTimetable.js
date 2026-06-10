import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { DAYS_OF_WEEK } from '../utils/constants';
import { getDayName } from '../utils/dateHelpers';

const STORAGE_KEY = 'tc75_timetable';

function getLocalTimetable() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function setLocalTimetable(timetable) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timetable));
}

/**
 * Hook for timetable CRUD operations
 */
export function useTimetable() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState(() => getLocalTimetable());
  const [loading, setLoading] = useState(() => Object.keys(getLocalTimetable()).length === 0);

  useEffect(() => {
    if (!user) {
      setTimetable({});
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured) {
      setTimetable(getLocalTimetable());
      setLoading(false);
      return;
    }

    const ttRef = collection(db, 'users', user.uid, 'timetable');
    const unsubscribe = onSnapshot(
      ttRef,
      (snapshot) => {
        const data = {};
        snapshot.docs.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        setTimetable(data);
        setLocalTimetable(data);
        setLoading(false);
      },
      (error) => {
        console.error('Timetable listener error:', error);
        setTimetable(getLocalTimetable());
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  /**
   * Set timetable for a specific day
   * @param {string} day - e.g., 'monday'
   * @param {Array} periods - Array of { time, subjectId, room }
   */
  const setDaySchedule = useCallback(
    async (day, periods) => {
      if (!user) return;

      const dayData = { periods };

      if (!isFirebaseConfigured) {
        const existing = getLocalTimetable();
        existing[day] = dayData;
        setLocalTimetable(existing);
        setTimetable(existing);
        return;
      }

      const docRef = doc(db, 'users', user.uid, 'timetable', day);
      await setDoc(docRef, dayData);
    },
    [user]
  );

  /**
   * Get today's schedule
   */
  const getTodaySchedule = useCallback(() => {
    const today = getDayName(new Date());
    const dayData = timetable[today];
    return dayData?.periods || [];
  }, [timetable]);

  /**
   * Get today's subject IDs (unique)
   */
  const getTodaySubjectIds = useCallback(() => {
    const periods = getTodaySchedule();
    return [...new Set(periods.filter((p) => p.subjectId).map((p) => p.subjectId))];
  }, [getTodaySchedule]);

  /**
   * Get schedule for a specific day
   */
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
  };
}
