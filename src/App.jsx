import { useState, useEffect, lazy, Suspense } from 'react';
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
import { useNotifications } from './hooks/useNotifications';
import { useAutoPilot } from './hooks/useAutoPilot';

// Lazy load pages for code-splitting
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Subjects = lazy(() => import('./pages/Subjects'));
const MarkAttendance = lazy(() => import('./pages/MarkAttendance'));
const TimetablePage = lazy(() => import('./pages/Timetable'));
const Calculator = lazy(() => import('./pages/Calculator'));
const BunkPlanner = lazy(() => import('./pages/BunkPlanner'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));
const History = lazy(() => import('./pages/History'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--text-muted)] text-sm">Loading...</p>
      </div>
    </div>
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

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          }
        />
        <Route path="/" element={<Navigate to="/mark" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Suspense fallback={<PageLoader />}>
                  <Subjects />
                </Suspense>
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Suspense fallback={<PageLoader />}>
                  <History />
                </Suspense>
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mark"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Suspense fallback={<PageLoader />}>
                  <MarkAttendance />
                </Suspense>
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/timetable"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Suspense fallback={<PageLoader />}>
                  <TimetablePage />
                </Suspense>
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calculator"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Suspense fallback={<PageLoader />}>
                  <Calculator />
                </Suspense>
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bunk-planner"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Suspense fallback={<PageLoader />}>
                  <BunkPlanner />
                </Suspense>
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Suspense fallback={<PageLoader />}>
                  <Analytics />
                </Suspense>
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Suspense fallback={<PageLoader />}>
                  <Settings />
                </Suspense>
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
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
            const subjectIdMap = {};
            data.subjects.forEach(sub => {
              const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              subjectIdMap[sub.id] = id;
              addSubject({ ...sub, id });
            });

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

      searchParams.delete('import');
      const newUrl = searchParams.toString() ? `${location.pathname}?${searchParams.toString()}` : location.pathname;
      navigate(newUrl, { replace: true });
    }
  }, [location.search, navigate, addSubject, setDaySchedule]);

  return null;
}

function NotificationEnabler() {
  useNotifications();
  return null;
}

function AutoPilotEnabler() {
  useAutoPilot();
  return null;
}

function AppLayout() {
  const location = useLocation();

  if (location.pathname === '/login') {
    return <AnimatedRoutes />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      <ImportHandler />
      <NotificationEnabler />
      <AutoPilotEnabler />
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
  const basename = import.meta.env.BASE_URL !== '/' ? import.meta.env.BASE_URL : undefined;

  return (
    <BrowserRouter basename={basename}>
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
