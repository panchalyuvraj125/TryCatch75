import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  PenLine,
  TrendingUp,
  BookOpen,
  Settings,
  Moon,
  Sun,
  CheckSquare,
  CalendarClock,
  History,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { setTheme } from '../utils/storage';
import { useApp } from '../context/AppContext';
import { scheduleClassNotifications } from '../utils/notifications';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { to: '/timetable', icon: CalendarClock, label: 'Timetable', key: 'timetable' },
  { to: '/mark', icon: PenLine, label: 'Attendance', key: 'mark' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics', key: 'analytics' },
  { to: '/history', icon: History, label: 'History', key: 'history' },
  { to: '/bunk', icon: BookOpen, label: 'Calculator', key: 'bunk' },
];

const mobileNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home', key: 'dashboard' },
  { to: '/timetable', icon: CalendarClock, label: 'Timetable', key: 'timetable' },
  { to: '/mark', icon: PenLine, label: 'Mark', key: 'mark' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics', key: 'analytics' },
  { to: '/setup', icon: Settings, label: 'Settings', key: 'setup' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const { globalState, updateGlobal } = useApp();
  const [theme, setThemeState] = useState(globalState.theme || 'dark');

  const activeSemesterId = globalState.activeSemesterId || 'default';
  const semesters = Object.values(globalState.semesters || {});

  const handleSemesterChange = (e) => {
    const id = e.target.value;
    if (id === 'NEW_SEMESTER') {
      const newId = uuid();
      updateGlobal((prev) => {
        const currentSem = prev.semesters[activeSemesterId];
        return {
          ...prev,
          activeSemesterId: newId,
          semesters: {
            ...prev.semesters,
            [newId]: {
              id: newId,
              label: `Semester ${Object.keys(prev.semesters).length + 1}`,
              courses: [],
              timetable: {},
              periodTimes: currentSem?.periodTimes || [],
              overrides: {},
              attendanceLog: [],
              holidays: [],
              semester: { start: '', end: '' },
              setupComplete: false
            }
          }
        };
      });
    } else {
      updateGlobal({ activeSemesterId: id });
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const semData = globalState.semesters?.[activeSemesterId] || {};
    const interval = setInterval(() => {
      scheduleClassNotifications(semData);
    }, 60000);
    scheduleClassNotifications(semData);
    return () => clearInterval(interval);
  }, [globalState, activeSemesterId]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    setTheme(next);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[220px] bg-bg-secondary border-r border-border z-40 flex-col hidden lg:flex" role="navigation" aria-label="Main navigation">
        {/* Logo */}
        <div className="px-4 py-4 flex items-center gap-2.5 border-b border-border">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <CheckSquare className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight leading-tight">TryCatch75</h1>
              <p className="text-[10px] text-text-muted font-mono leading-tight">Attendance</p>
            </div>
          </NavLink>
        </div>

        {/* Semester Selector */}
        <div className="px-3 py-3 border-b border-border">
          <select
            value={activeSemesterId}
            onChange={handleSemesterChange}
            className="w-full text-xs bg-bg-tertiary border-none py-2 cursor-pointer rounded-lg"
            aria-label="Select semester"
          >
            {semesters.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
            <option disabled>──────────</option>
            <option value="NEW_SEMESTER">+ New Semester</option>
          </select>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                }`
              }
            >
              <item.icon className="w-[16px] h-[16px] shrink-0" />
              {item.label}
            </NavLink>
          ))}

          {/* Settings Section */}
          <div className="pt-4 pb-1">
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-text-muted">
              Settings
            </span>
          </div>
          <NavLink
            to="/setup"
            className={({ isActive }) =>
              `group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              }`
            }
          >
            <Settings className="w-[16px] h-[16px] shrink-0" />
            Configuration
          </NavLink>
        </nav>

        {/* Theme Toggle */}
        <div className="px-2 py-3 border-t border-border">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-150 cursor-pointer"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Moon className="w-[16px] h-[16px] shrink-0" />
            ) : (
              <Sun className="w-[16px] h-[16px] shrink-0" />
            )}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-13 bg-bg-secondary/90 backdrop-blur-xl border-b border-border z-40 flex items-center justify-between px-4" role="banner">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">TryCatch75</span>
        </NavLink>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all cursor-pointer"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-secondary/95 backdrop-blur-xl border-t border-border z-40 flex items-center justify-around px-1" role="navigation" aria-label="Mobile navigation">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-150 min-w-[52px] ${
                isActive ? 'text-accent' : 'text-text-muted'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main Content */}
      <main className="lg:ml-[220px] pt-13 lg:pt-0 pb-20 lg:pb-0 min-h-screen" role="main">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      {/* Toast Container */}
      <div id="toast-container" role="alert" aria-live="polite" />
    </div>
  );
}
