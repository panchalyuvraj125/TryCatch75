import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useSubjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStorageKey = useCallback(() => `subjects_${user?.id}`, [user]);

  const fetchSubjects = useCallback(() => {
    if (!user) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
      // Sort by created_at ascending (simulate Supabase order)
      const sorted = stored.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setSubjects(sorted);
    } catch (e) {
      console.error('Error fetching subjects:', e);
      setSubjects([]);
    }
    setLoading(false);
  }, [user, getStorageKey]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const addSubject = useCallback(
    async (subjectData) => {
      if (!user) return null;

      const newSubject = {
        id: 'sub_' + Date.now().toString() + Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        name: subjectData.name,
        type: subjectData.type || 'theory',
        credits: subjectData.credits || 3,
        teacher_name: subjectData.teacherName || '',
        contact_note: subjectData.contactNote || '',
        semester: subjectData.semester || 1,
        target_attendance: subjectData.targetAttendance || 75,
        created_at: new Date().toISOString(),
      };
      
      // Keep subjectId for compatibility
      newSubject.subjectId = newSubject.id;

      try {
        const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        stored.push(newSubject);
        localStorage.setItem(getStorageKey(), JSON.stringify(stored));
        fetchSubjects();
        return newSubject.id;
      } catch (e) {
        console.error('Error adding subject:', e);
        return null;
      }
    },
    [user, getStorageKey, fetchSubjects]
  );

  const updateSubject = useCallback(
    async (subjectId, updates) => {
      if (!user) return;

      try {
        const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        const index = stored.findIndex(s => s.id === subjectId);
        
        if (index !== -1) {
          const updateData = { ...stored[index] };
          if (updates.name !== undefined) updateData.name = updates.name;
          if (updates.type !== undefined) updateData.type = updates.type;
          if (updates.credits !== undefined) updateData.credits = updates.credits;
          if (updates.teacherName !== undefined) updateData.teacher_name = updates.teacherName;
          if (updates.contactNote !== undefined) updateData.contact_note = updates.contactNote;
          if (updates.semester !== undefined) updateData.semester = updates.semester;
          if (updates.targetAttendance !== undefined) updateData.target_attendance = updates.targetAttendance;
          
          stored[index] = updateData;
          localStorage.setItem(getStorageKey(), JSON.stringify(stored));
          fetchSubjects();
        }
      } catch (e) {
        console.error('Error updating subject:', e);
      }
    },
    [user, getStorageKey, fetchSubjects]
  );

  const deleteSubject = useCallback(
    async (subjectId) => {
      if (!user) return;

      try {
        const stored = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        const filtered = stored.filter(s => s.id !== subjectId);
        localStorage.setItem(getStorageKey(), JSON.stringify(filtered));
        fetchSubjects();
      } catch (e) {
        console.error('Error deleting subject:', e);
      }
    },
    [user, getStorageKey, fetchSubjects]
  );

  const getSubjectsBySemester = useCallback(
    (semester) => {
      return subjects.filter((s) => s.semester === semester);
    },
    [subjects]
  );

  return {
    subjects,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectsBySemester,
    refresh: fetchSubjects,
  };
}
