import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useSubjects } from './hooks/useSubjects';
import { useTimetable } from './hooks/useTimetable';
import { parseShareLink } from './utils/calendarUtils';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import ProtectedRoute from './components/layout/ProtectedRoute';
import OnboardingTour from './components/onboarding/OnboardingTour';


import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import MarkAttendance from './pages/MarkAttendance';
import TimetablePage from './pages/Timetable';
import Calculator from './pages/Calculator';
import BunkPlanner from './pages/BunkPlanner';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import History from './pages/History';
import NotFound from './pages/NotFound';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/mark" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper><Dashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <PageWrapper><Subjects /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <PageWrapper><History /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mark"
          element={
            <ProtectedRoute>
              <PageWrapper><MarkAttendance /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/timetable"
          element={
            <ProtectedRoute>
              <PageWrapper><TimetablePage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calculator"
          element={
            <ProtectedRoute>
              <PageWrapper><Calculator /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bunk-planner"
          element={
            <ProtectedRoute>
              <PageWrapper><BunkPlanner /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <PageWrapper><Analytics /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageWrapper><Settings /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function ImportHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addSubject } = useSubjects();
  const { setDaySchedule } = useTimetable();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const importDataStr = searchParams.get('import');
    
    if (importDataStr) {
      try {
        const data = parseShareLink(importDataStr);
        if (data && data.subjects && data.timetable) {
          if (window.confirm('Import shared timetable? This will add new subjects and overwrite existing schedule slots.')) {
            // Import logic
            const subjectIdMap = {};
            data.subjects.forEach(sub => {
              // Create a dummy subject or actually add it
              const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              subjectIdMap[sub.id] = id;
              addSubject({ ...sub, id });
            });

            // Re-map subject IDs in timetable
            Object.entries(data.timetable).forEach(([day, dayData]) => {
              if (dayData && dayData.periods) {
                const mappedPeriods = dayData.periods.map(p => ({
                  ...p,
                  subjectId: subjectIdMap[p.subjectId] || p.subjectId
                }));
                setDaySchedule(day, mappedPeriods);
              }
            });
            toast.success('Timetable imported successfully!');
          }
        }
      } catch (err) {
        toast.error('Failed to import timetable');
      }
      
      // Clean up URL
      searchParams.delete('import');
      const newUrl = searchParams.toString() ? `${location.pathname}?${searchParams.toString()}` : location.pathname;
      navigate(newUrl, { replace: true });
    }
  }, [location.search, navigate, addSubject, setDaySchedule]);

  return null;
}

function AppLayout() {
  const location = useLocation();

  // Don't show layout on login page
  if (location.pathname === '/login') {
    return <AnimatedRoutes />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      <ImportHandler />
      <OnboardingTour />
      <Navbar />
      <main className="pt-16 transition-all duration-300 mx-auto max-w-7xl">
        <div className="p-4 lg:p-6 lg:px-12">
          <AnimatedRoutes />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppLayout />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
                fontSize: '14px',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
