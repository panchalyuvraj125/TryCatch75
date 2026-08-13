import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function OverrideModal({ isOpen, onClose, dateStr }) {
  const { state, update } = useApp();
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    if (isOpen && dateStr) {
      const date = new Date(dateStr);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const day = days[date.getDay()];
      
      const baseSchedule = state.timetable?.[day] || {};
      const dateOverrides = state.overrides?.[dateStr] || {};
      
      setSchedule({ ...baseSchedule, ...dateOverrides });
    }
  }, [isOpen, dateStr, state]);

  if (!isOpen) return null;

  const handleCourseChange = (periodIdx, courseId) => {
    setSchedule(prev => ({
      ...prev,
      [periodIdx]: courseId === 'free' ? null : courseId
    }));
  };

  const handleSave = () => {
    const newOverrides = { ...state.overrides, [dateStr]: schedule };
    update({ overrides: newOverrides });
    onClose();
  };

  const handleReset = () => {
    const newOverrides = { ...state.overrides };
    delete newOverrides[dateStr];
    update({ overrides: newOverrides });
    onClose();
  };

  const displayDate = new Date(dateStr).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-bg-primary border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-bg-secondary/50">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Override Schedule</h2>
              <p className="text-xs text-text-muted mt-0.5">{displayDate}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1">
            <div className="space-y-4">
              {state.periodTimes.map((time, i) => {
                const currentCourseId = schedule[i] === undefined ? null : schedule[i];
                return (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-bg-secondary rounded-xl border border-border">
                    <div className="w-24 shrink-0 flex items-center gap-2">
                      <span className="text-xs font-mono text-text-muted uppercase tracking-wider">P{i + 1}</span>
                      <span className="text-[10px] text-text-muted">({time.start})</span>
                    </div>
                    <select
                      value={currentCourseId || 'free'}
                      onChange={(e) => handleCourseChange(i, e.target.value)}
                      className="flex-1 text-sm bg-bg-tertiary border-none rounded-lg py-2 cursor-pointer focus:ring-1 focus:ring-accent"
                    >
                      <option value="free">— Free Period / Canceled —</option>
                      {state.courses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.code} - {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-border bg-bg-secondary/50 flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Base
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
              >
                <Save className="w-4 h-4" />
                Save Override
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
