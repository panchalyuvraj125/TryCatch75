import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatDateKey } from '../utils/dateHelpers';

export function useHolidays() {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);

  const getStorageKey = useCallback(() => `holidays_${user?.id}`, [user]);

  const fetchHolidays = useCallback(() => {
    if (!user) {
      setHolidays([]);
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
      setHolidays(stored);
    } catch (e) {
      console.error('Error fetching holidays:', e);
      setHolidays([]);
    }
  }, [user, getStorageKey]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const toggleHoliday = useCallback(
    (date) => {
      if (!user) return;
      const dateStr = typeof date === 'string' ? date : formatDateKey(date);

      try {
        const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        let newHolidays;
        
        if (stored.includes(dateStr)) {
          newHolidays = stored.filter(d => d !== dateStr);
        } else {
          newHolidays = [...stored, dateStr];
        }
        
        localStorage.setItem(getStorageKey(), JSON.stringify(newHolidays));
        fetchHolidays();
      } catch (e) {
        console.error('Error toggling holiday:', e);
      }
    },
    [user, getStorageKey, fetchHolidays]
  );

  const isHoliday = useCallback(
    (date) => {
      const dateStr = typeof date === 'string' ? date : formatDateKey(date);
      return holidays.includes(dateStr);
    },
    [holidays]
  );

  return {
    holidays,
    toggleHoliday,
    isHoliday,
  };
}
