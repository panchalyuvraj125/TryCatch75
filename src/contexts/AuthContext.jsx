import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Demo user for when Firebase isn't configured
const DEMO_USER = {
  uid: 'demo-user',
  email: 'demo@trycatch75.app',
  displayName: 'Demo Student',
  photoURL: null,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('tc75_local_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Simple local login: just store the username
    const newUser = {
      uid: username.toLowerCase().replace(/\s+/g, '-'),
      displayName: username,
      email: `${username.toLowerCase().replace(/\s+/g, '')}@local.app`,
    };
    setUser(newUser);
    localStorage.setItem('tc75_local_user', JSON.stringify(newUser));

    // Easter egg / specific seeding for Yuvraj AM2
    if (username.toLowerCase() === 'yuvraj' || username.toLowerCase() === 'yuvraj panchal') {
      // Force seed AM2 Subjects
      const am2Subjects = [
        { id: 'sub_egm', name: 'EGM (TH)', type: 'theory', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() },
        { id: 'sub_egm_pr', name: 'EGM (PR)', type: 'practical', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() },
        { id: 'sub_pps', name: 'PPS (TH)', type: 'theory', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() },
        { id: 'sub_pps_pr', name: 'PPS (PR)', type: 'practical', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() },
        { id: 'sub_cms', name: 'CMS (TH)', type: 'theory', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() },
        { id: 'sub_cms_pr', name: 'CMS (PR)', type: 'practical', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() },
        { id: 'sub_ech', name: 'ECH (TH)', type: 'theory', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() },
        { id: 'sub_ech_pr', name: 'ECH (PR)', type: 'practical', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() },
        { id: 'sub_german', name: 'GERMAN', type: 'theory', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() },
        { id: 'sub_yoga', name: 'YOGA (TH)', type: 'theory', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() },
        { id: 'sub_yoga_pr', name: 'YOGA (PR)', type: 'practical', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() },
        { id: 'sub_wsp', name: 'WSP (PR)', type: 'practical', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() },
        { id: 'sub_emt', name: 'EMT II (TH)', type: 'theory', semester: 2, targetAttendance: 75, createdAt: new Date().toISOString() }
      ];
      localStorage.setItem(`tc75_subjects_${newUser.uid}`, JSON.stringify(am2Subjects));

      // Force seed AM2 Timetable
      const am2Timetable = {
        monday: { periods: [
          { time: '08:00 - 09:00', subjectId: 'sub_egm', room: 'CR 108' },
          { time: '09:00 - 10:00', subjectId: 'sub_egm', room: 'CR 108' },
          { time: '11:00 - 12:00', subjectId: 'sub_pps', room: 'CR 108' },
          { time: '12:00 - 01:00', subjectId: 'sub_pps_pr', room: '3RD FL HARDWARE LAB' },
          { time: '01:00 - 02:00', subjectId: 'sub_pps_pr', room: '3RD FL HARDWARE LAB' },
          { time: '02:00 - 03:00', subjectId: 'sub_ech', room: 'CR 108' }
        ]},
        tuesday: { periods: [
          { time: '09:00 - 10:00', subjectId: 'sub_german', room: 'CR 107' },
          { time: '10:00 - 11:00', subjectId: 'sub_german', room: 'CR 107' },
          { time: '11:00 - 12:00', subjectId: 'sub_cms', room: 'CR 107' },
          { time: '12:00 - 01:00', subjectId: 'sub_cms', room: 'CR 107' },
          { time: '02:00 - 03:00', subjectId: 'sub_ech_pr', room: '1ST FL CHEM LAB' },
          { time: '03:00 - 04:00', subjectId: 'sub_ech_pr', room: '1ST FL CHEM LAB' }
        ]},
        wednesday: { periods: [
          { time: '08:00 - 09:00', subjectId: 'sub_yoga_pr', room: 'GCR 4TH FL' },
          { time: '09:00 - 10:00', subjectId: 'sub_yoga_pr', room: 'GCR 4TH FL' },
          { time: '10:00 - 11:00', subjectId: 'sub_yoga', room: 'CR 108' },
          { time: '11:00 - 12:00', subjectId: 'sub_pps', room: 'CR 108' },
          { time: '01:00 - 02:00', subjectId: 'sub_ech', room: 'CR 108' }
        ]},
        thursday: { periods: [
          { time: '08:00 - 09:00', subjectId: 'sub_wsp', room: 'OPP. TO CANTEEN' },
          { time: '09:00 - 10:00', subjectId: 'sub_wsp', room: 'OPP. TO CANTEEN' },
          { time: '11:00 - 12:00', subjectId: 'sub_egm', room: 'CR 107' },
          { time: '12:00 - 01:00', subjectId: 'sub_emt', room: 'CR 105' },
          { time: '01:00 - 02:00', subjectId: 'sub_emt', room: 'CR 105' }
        ]},
        friday: { periods: [
          { time: '08:00 - 09:00', subjectId: 'sub_egm_pr', room: '1ST FL APM LAB' },
          { time: '09:00 - 10:00', subjectId: 'sub_egm_pr', room: '1ST FL APM LAB' },
          { time: '10:00 - 11:00', subjectId: 'sub_cms_pr', room: '1ST FL COMP CENTRE' },
          { time: '11:00 - 12:00', subjectId: 'sub_cms_pr', room: '1ST FL COMP CENTRE' },
          { time: '12:00 - 01:00', subjectId: 'sub_emt', room: 'CR 108' },
          { time: '02:00 - 03:00', subjectId: 'sub_ech', room: 'CR 107' }
        ]},
        saturday: { periods: [
          { time: '12:00 - 01:00', subjectId: 'sub_wsp', room: 'OPP. TO CANTEEN' },
          { time: '01:00 - 02:00', subjectId: 'sub_wsp', room: 'OPP. TO CANTEEN' },
          { time: '02:00 - 03:00', subjectId: 'sub_wsp', room: 'OPP. TO CANTEEN' },
          { time: '03:00 - 04:00', subjectId: 'sub_wsp', room: 'OPP. TO CANTEEN' }
        ]}
      };
      localStorage.setItem(`tc75_timetable_${newUser.uid}`, JSON.stringify(am2Timetable));
      
      // We will reload the window to ensure hooks catch the new seeded data
      setTimeout(() => window.location.reload(), 100);
    }

    return newUser;
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('tc75_local_user');
  };

  const value = {
    user,
    loading,
    login,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
