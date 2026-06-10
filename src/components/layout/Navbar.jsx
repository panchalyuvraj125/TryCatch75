import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, WifiOff, LogOut, User, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { format } from 'date-fns';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const todayStr = format(new Date(), 'EEEE, d MMM');

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-[var(--border-default)]"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6 max-w-7xl mx-auto">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 select-none">
            <span className="font-heading font-bold text-2xl text-[var(--text-primary)] tracking-tight">
              TryCatch<span className="text-[var(--accent-orange)] italic font-medium">75</span>
            </span>
          </div>
        </div>

        {/* Right: Date + Theme + Settings + User */}
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-xs font-mono text-[var(--text-muted)] hidden md:block">
            {todayStr}
          </span>

          {/* Offline Badge */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-yellow)]/15 text-[var(--accent-yellow)] text-xs font-medium"
            >
              <WifiOff size={12} />
              <span className="hidden sm:inline">Offline</span>
            </motion.div>
          )}

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              id="theme-toggle"
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--accent-orange)] hover:bg-[var(--bg-card)] transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
            
            {/* Settings */}
            <button
              onClick={() => navigate('/settings')}
              className="p-1.5 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--accent-orange)] hover:bg-[var(--bg-card)] transition-colors"
            >
              <Settings size={16} />
            </button>

            {/* User Profile Pill with Dropdown */}
            {user && user.displayName && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-card)] shadow-sm ml-2 hover:border-[var(--accent-orange)] transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-orange)] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {user.displayName}
                  </span>
                  <ChevronDown size={14} className="text-[var(--text-muted)] ml-1" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-xl overflow-hidden z-50">
                    <div className="p-3 border-b border-[var(--border-default)]">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {user.displayName}
                      </p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={async () => {
                          await signOut();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--accent-red)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors text-left"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
