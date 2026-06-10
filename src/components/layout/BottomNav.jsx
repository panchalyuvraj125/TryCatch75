import { NavLink } from 'react-router-dom';
import {
  CheckSquare,
  BarChart3,
  Calendar,
  Clock,
  Calculator
} from 'lucide-react';

const navItems = [
  { path: '/mark', label: 'TODAY', icon: CheckSquare },
  { path: '/dashboard', label: 'STATS', icon: BarChart3 },
  { path: '/history', label: 'HISTORY', icon: Calendar },
  { path: '/timetable', label: 'SCHEDULE', icon: Clock },
  { path: '/calculator', label: 'CALC', icon: Calculator },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full z-50 bg-[var(--bg-primary)] border-t border-[var(--border-default)] pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors
                ${
                  isActive
                    ? 'text-[var(--accent-orange)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`
              }
            >
              <IconComponent size={20} strokeWidth={2} />
              <span className="text-[10px] font-mono tracking-wider font-semibold">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
