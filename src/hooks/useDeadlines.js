import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useDeadlines() {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState([]);

  const getStorageKey = useCallback(() => `deadlines_${user?.id}`, [user]);

  const fetchDeadlines = useCallback(() => {
    if (!user) {
      setDeadlines([]);
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
      // Sort by date ascending
      const sorted = stored.sort((a, b) => new Date(a.date) - new Date(b.date));
      // Filter out past deadlines (older than 1 day)
      const now = new Date();
      now.setDate(now.getDate() - 1);
      const active = sorted.filter(d => new Date(d.date) > now);
      
      // Save if filtered
      if (active.length !== stored.length) {
        localStorage.setItem(getStorageKey(), JSON.stringify(active));
      }
      setDeadlines(active);
    } catch (e) {
      console.error('Error fetching deadlines:', e);
      setDeadlines([]);
    }
  }, [user, getStorageKey]);

  useEffect(() => {
    fetchDeadlines();
  }, [fetchDeadlines]);

  const addDeadline = useCallback(
    (deadlineData) => {
      if (!user) return;
      try {
        const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        const newDeadline = {
          id: 'dl_' + Date.now().toString(),
          title: deadlineData.title,
          date: deadlineData.date, // ISO string
          type: deadlineData.type || 'exam', // exam, assignment, project
        };
        stored.push(newDeadline);
        localStorage.setItem(getStorageKey(), JSON.stringify(stored));
        fetchDeadlines();
      } catch (e) {
        console.error('Error adding deadline:', e);
      }
    },
    [user, getStorageKey, fetchDeadlines]
  );

  const deleteDeadline = useCallback(
    (id) => {
      if (!user) return;
      try {
        const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        const filtered = stored.filter(d => d.id !== id);
        localStorage.setItem(getStorageKey(), JSON.stringify(filtered));
        fetchDeadlines();
      } catch (e) {
        console.error('Error deleting deadline:', e);
      }
    },
    [user, getStorageKey, fetchDeadlines]
  );

  return {
    deadlines,
    addDeadline,
    deleteDeadline,
  };
}
