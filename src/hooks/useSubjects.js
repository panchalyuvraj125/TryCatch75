import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useSubjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    const fetchSubjects = async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setSubjects(data.map(s => ({ ...s, id: s.id, subjectId: s.id })));
      }
      setLoading(false);
    };

    fetchSubjects();

    const channel = supabase
      .channel('subjects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subjects', filter: `user_id=eq.${user.id}` },
        () => fetchSubjects()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addSubject = useCallback(
    async (subjectData) => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('subjects')
        .insert({
          user_id: user.id,
          name: subjectData.name,
          type: subjectData.type || 'theory',
          credits: subjectData.credits || 3,
          teacher_name: subjectData.teacherName || '',
          contact_note: subjectData.contactNote || '',
          semester: subjectData.semester || 1,
          target_attendance: subjectData.targetAttendance || 75,
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error adding subject:', error);
        return null;
      }

      return data?.id;
    },
    [user]
  );

  const updateSubject = useCallback(
    async (subjectId, updates) => {
      if (!user) return;

      const updateData = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.credits !== undefined) updateData.credits = updates.credits;
      if (updates.teacherName !== undefined) updateData.teacher_name = updates.teacherName;
      if (updates.contactNote !== undefined) updateData.contact_note = updates.contactNote;
      if (updates.semester !== undefined) updateData.semester = updates.semester;
      if (updates.targetAttendance !== undefined) updateData.target_attendance = updates.targetAttendance;

      await supabase
        .from('subjects')
        .update(updateData)
        .eq('id', subjectId)
        .eq('user_id', user.id);
    },
    [user]
  );

  const deleteSubject = useCallback(
    async (subjectId) => {
      if (!user) return;

      await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId)
        .eq('user_id', user.id);
    },
    [user]
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
  };
}
