import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import MarkAttendance from './pages/MarkAttendance';
import Analytics from './pages/Analytics';
import BunkCalculator from './pages/BunkCalculator';
import Timetable from './pages/Timetable';
import History from './pages/History';
import { useApp } from './context/AppContext';

export default function App() {
  const { state } = useApp();

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={state.setupComplete ? '/dashboard' : '/setup'} replace />
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/mark" element={<MarkAttendance />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/history" element={<History />} />
        <Route path="/bunk" element={<BunkCalculator />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
