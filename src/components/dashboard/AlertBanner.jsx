import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Bell, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AlertBanner({ subjectStats = [], isTodayMarked = false }) {
  const [dismissed, setDismissed] = useState({});

  // Find subjects below 80% (early warning)
  const warningSubjects = subjectStats.filter(
    (s) => s.total > 0 && s.percent < 80 && s.percent >= 75
  );

  // Find subjects below 75% (critical)
  const criticalSubjects = subjectStats.filter(
    (s) => s.total > 0 && s.percent < 75
  );

  const alerts = [];

  // Daily reminder
  if (!isTodayMarked && subjectStats.length > 0) {
    alerts.push({
      id: 'daily-reminder',
      type: 'info',
      icon: Bell,
      message: "Did you mark today's attendance?",
      action: { label: 'Mark Now', to: '/mark' },
    });
  }

  // Critical alerts
  criticalSubjects.forEach((s) => {
    alerts.push({
      id: `critical-${s.id}`,
      type: 'critical',
      icon: AlertTriangle,
      message: `🚨 ${s.name} is at ${s.percent.toFixed(1)}% — you need to attend ${s.classesNeeded} more classes!`,
      action: { label: 'View Calculator', to: '/calculator' },
    });
  });

  // Warning alerts
  warningSubjects.forEach((s) => {
    alerts.push({
      id: `warning-${s.id}`,
      type: 'warning',
      icon: AlertTriangle,
      message: `⚠️ ${s.name} dropped to ${s.percent.toFixed(1)}% — approaching danger zone!`,
    });
  });

  const visibleAlerts = alerts.filter((a) => !dismissed[a.id]);
  if (visibleAlerts.length === 0) return null;

  const typeStyles = {
    info: 'border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/5 text-[var(--accent-cyan)]',
    warning:
      'border-[var(--accent-yellow)]/30 bg-[var(--accent-yellow)]/5 text-[var(--accent-yellow)]',
    critical:
      'border-[var(--accent-red)]/30 bg-[var(--accent-red)]/5 text-[var(--accent-red)]',
  };

  return (
    <div className="flex flex-col gap-2 mb-6">
      <AnimatePresence>
        {visibleAlerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                typeStyles[alert.type] || typeStyles.info
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <p className="text-sm flex-1">{alert.message}</p>
              {alert.action && (
                <Link
                  to={alert.action.to}
                  className="flex items-center gap-1 text-xs font-medium opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  {alert.action.label}
                  <ChevronRight size={12} />
                </Link>
              )}
              <button
                onClick={() =>
                  setDismissed((prev) => ({ ...prev, [alert.id]: true }))
                }
                className="p-0.5 rounded hover:bg-white/10 transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
