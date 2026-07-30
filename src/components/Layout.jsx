import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  PenLine,
  TrendingUp,
  BookOpen,
  Settings,
  Moon,
  Sun,
  CheckSquare,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { getTheme, setTheme } from '../utils/storage';
import { useApp } from '../context/AppContext';
import { scheduleClassNotifications } from '../utils/notifications';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { to: '/mark', icon: PenLine, label: 'Mark Attendance', key: 'mark' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics', key: 'analytics' },
  { to: '/bunk', icon: BookOpen, label: 'Bunk Calculator', key: 'bunk' },
];

const mobileNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { to: '/mark', icon: PenLine, label: 'Mark', key: 'mark' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics', key: 'analytics' },
  { to: '/bunk', icon: BookOpen, label: 'Bunk', key: 'bunk' },
  { to: '/setup', icon: Settings, label: 'Config', key: 'setup' },
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
      <aside className="fixed left-0 top-0 h-full w-[240px] bg-bg-secondary border-r border-border z-40 flex-col hidden lg:flex transition-all duration-300">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-border">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight">TryCatch75</h1>
              <p className="text-[11px] text-text-muted font-mono">v1.0.0</p>
            </div>
          </NavLink>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}

          {/* Settings Section */}
          <div className="pt-3 pb-1">
            <span className="px-3 text-[11px] font-mono uppercase tracking-wider text-text-muted">
              Settings
            </span>
          </div>
          <NavLink
            to="/setup"
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              }`
            }
          >
            <Settings className="w-[18px] h-[18px]" />
            Configuration
          </NavLink>
        </nav>

        {/* Semester Toggle */}
        <div className="px-3 py-3 border-t border-border">
          <label className="block text-[10px] font-mono text-text-muted mb-1 px-1 uppercase">Semester</label>
          <select
            value={activeSemesterId}
            onChange={handleSemesterChange}
            className="w-full text-xs bg-bg-tertiary border-none py-2 cursor-pointer"
          >
            {semesters.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
            <option disabled>──────────</option>
            <option value="NEW_SEMESTER">+ New Semester</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-200 cursor-pointer"
          >
            {theme === 'dark' ? (
              <Moon className="w-[18px] h-[18px]" />
            ) : (
              <Sun className="w-[18px] h-[18px]" />
            )}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-bg-secondary/80 backdrop-blur-xl border-b border-border z-40 flex items-center justify-between px-4">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">TryCatch75</span>
        </NavLink>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all cursor-pointer"
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-secondary/90 backdrop-blur-xl border-t border-border z-40 flex items-center justify-around px-2">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
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
      <main className="lg:ml-[240px] pt-14 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      {/* Toast Container */}
      <div id="toast-container" />
    </div>
  );
}
