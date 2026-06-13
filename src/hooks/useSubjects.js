import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const getStorageKey = (uid) => `tc75_subjects_${uid || 'guest'}`;

function getLocalSubjects(uid) {
  try {
    const data = localStorage.getItem(getStorageKey(uid));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalSubjects(uid, subjects) {
  if (!uid) return;
  localStorage.setItem(getStorageKey(uid), JSON.stringify(subjects));
}

/**
 * Hook for subject CRUD operations
 */
export function useSubjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState(() => getLocalSubjects(user?.uid));
  const [loading, setLoading] = useState(() => getLocalSubjects(user?.uid).length === 0);

  useEffect(() => {
    if (!user) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured) {
      setSubjects(getLocalSubjects(user.uid));
      setLoading(false);
      return;
    }

    const subRef = collection(db, 'users', user.uid, 'subjects');
    const unsubscribe = onSnapshot(
      subRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSubjects(data);
        setLocalSubjects(user.uid, data); // Cache locally
        setLoading(false);
      },
      (error) => {
        console.error('Subjects listener error:', error);
        setSubjects(getLocalSubjects(user.uid));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  /**
   * Add a new subject
   */
  const addSubject = useCallback(
    async (subjectData) => {
      if (!user) return null;

      const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const subject = {
        ...subjectData,
        createdAt: new Date().toISOString(),
      };

      if (!isFirebaseConfigured) {
        const existing = getLocalSubjects(user.uid);
        existing.push({ ...subject, id });
        setLocalSubjects(user.uid, existing);
        setSubjects(existing);
        return id;
      }

      const docRef = doc(db, 'users', user.uid, 'subjects', id);
      await setDoc(docRef, {
        ...subject,
        createdAt: serverTimestamp(),
      });
      return id;
    },
    [user]
  );

  /**
   * Update an existing subject
   */
  const updateSubject = useCallback(
    async (subjectId, updates) => {
      if (!user) return;

      if (!isFirebaseConfigured) {
        const existing = getLocalSubjects(user.uid);
        const idx = existing.findIndex((s) => s.id === subjectId);
        if (idx >= 0) {
          existing[idx] = { ...existing[idx], ...updates };
          setLocalSubjects(user.uid, existing);
          setSubjects(existing);
        }
        return;
      }

      const docRef = doc(db, 'users', user.uid, 'subjects', subjectId);
      await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
    },
    [user]
  );

  /**
   * Delete a subject
   */
  const deleteSubject = useCallback(
    async (subjectId) => {
      if (!user) return;

      if (!isFirebaseConfigured) {
        const existing = getLocalSubjects(user.uid).filter((s) => s.id !== subjectId);
        setLocalSubjects(user.uid, existing);
        setSubjects(existing);
        return;
      }

      const docRef = doc(db, 'users', user.uid, 'subjects', subjectId);
      await deleteDoc(docRef);
    },
    [user]
  );

  /**
   * Get subjects filtered by semester
   */
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
