import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingDown, AlertTriangle, PartyPopper, Target, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAttendanceForCourse, calculateSafeBunks, calculateClassesNeeded } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

export default function BunkCalculator() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [selectedCourseId, setSelectedCourseId] = useState(state.courses[0]?.id || '');
  const [scenarioBunks, setScenarioBunks] = useState('');

  const selectedCourse = state.courses.find(c => c.id === selectedCourseId);
  const stats = selectedCourse ? getAttendanceForCourse(state, selectedCourse.id) : null;
  
  const minRequired = selectedCourse?.minAttendance || 75;
  const safeBunks = stats ? calculateSafeBunks(stats.attended, stats.total, minRequired) : 0;
  const classesNeeded = stats ? calculateClassesNeeded(stats.attended, stats.total, minRequired) : 0;

  // Scenario projection
  const currentPct = stats?.percentage || 0;
  const newTotal = stats ? stats.total + (parseInt(scenarioBunks) || 0) : 0;
  const projectedPct = stats && newTotal > 0 ? Math.round((stats.attended / newTotal) * 100) : currentPct;
  const scenarioWarning = projectedPct < minRequired;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-accent" />
            Bunk Calculator
          </h2>
          <p className="text-sm text-text-muted mt-0.5">
            Plan your attendance and see how missing classes affects your percentage.
          </p>
        </motion.div>

        {state.courses.length === 0 ? (
          <motion.div variants={fadeUp} className="card p-8 text-center">
            <BookOpen className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-50" />
            <p className="text-sm text-text-muted mb-4">You need to add courses first.</p>
            <button onClick={() => navigate('/setup')} className="btn btn-primary">
              Go to Setup
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Left Column: Selector & Stats */}
            <motion.div variants={fadeUp} className="space-y-5 sm:space-y-6">
              
              <div className="card p-4 sm:p-5">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Select Subject
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full h-11 text-sm bg-bg-tertiary border-border rounded-lg px-3 mb-4 focus:ring-2 focus:ring-accent/20"
                >
                  {state.courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {stats && (
                  <div className="bg-bg-tertiary rounded-xl p-4 border border-border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-text-secondary">Current Attendance</span>
                      <span className={`text-lg font-bold ${currentPct >= minRequired ? 'text-success' : 'text-danger'}`}>
                        {currentPct}%
                      </span>
                    </div>
                    <div className="progress-bar mb-3">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${Math.min(currentPct, 100)}%`,
                          backgroundColor: currentPct >= minRequired ? 'var(--success)' : 'var(--danger)'
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-text-muted tabular-nums font-medium">
                      <span>{stats.attended} Attended</span>
                      <span>{stats.missed} Missed</span>
                      <span>{stats.total} Total</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Card */}
              {stats && (
                <div className="card overflow-hidden border-0 shadow-sm relative">
                  {currentPct >= minRequired ? (
                    <div className="bg-success-soft border border-success/20 p-5 sm:p-6">
                      <div className="flex items-center gap-3 mb-3 text-success">
                        <PartyPopper className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">You're safe!</h3>
                      </div>
                      <p className="text-sm text-text-primary mb-1">
                        Target is <strong>{minRequired}%</strong>.
                      </p>
                      <p className="text-sm text-text-secondary">
                        You can safely bunk <strong className="text-success text-base">{safeBunks}</strong> more {safeBunks === 1 ? 'class' : 'classes'} without falling below the limit.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-danger-soft border border-danger/20 p-5 sm:p-6">
                      <div className="flex items-center gap-3 mb-3 text-danger">
                        <AlertTriangle className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">Critical Zone</h3>
                      </div>
                      <p className="text-sm text-text-primary mb-1">
                        Target is <strong>{minRequired}%</strong>.
                      </p>
                      <p className="text-sm text-text-secondary">
                        You need to attend the next <strong className="text-danger text-base">{classesNeeded}</strong> {classesNeeded === 1 ? 'class' : 'classes'} to reach the limit.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Right Column: Scenario Simulator */}
            <motion.div variants={fadeUp} className="space-y-5 sm:space-y-6">
              
              <div className="card p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-semibold text-text-primary">What if I bunk...</h3>
                </div>
                
                <div className="flex items-center gap-3 mb-5">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={scenarioBunks}
                    onChange={(e) => setScenarioBunks(e.target.value)}
                    className="w-20 h-11 text-center font-semibold text-lg bg-bg-tertiary border-border rounded-lg focus:ring-2 focus:ring-accent/20"
                  />
                  <span className="text-sm font-medium text-text-secondary">classes?</span>
                </div>

                <AnimatePresence mode="wait">
                  {scenarioBunks && parseInt(scenarioBunks) > 0 ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`p-4 rounded-xl border ${scenarioWarning ? 'bg-danger-soft border-danger/20' : 'bg-bg-tertiary border-border'}`}>
                        <p className="text-xs text-text-secondary uppercase font-semibold tracking-wide mb-1">Projected Attendance</p>
                        <div className="flex items-end gap-3 mb-2">
                          <span className={`text-3xl font-bold tabular-nums tracking-tight ${scenarioWarning ? 'text-danger' : 'text-text-primary'}`}>
                            {projectedPct}%
                          </span>
                          <span className="text-sm font-medium text-text-muted mb-1.5 flex items-center gap-1">
                            <TrendingDown className="w-3.5 h-3.5" />
                            from {currentPct}%
                          </span>
                        </div>
                        {scenarioWarning ? (
                          <p className="text-xs text-danger font-medium flex items-center gap-1.5 mt-2">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            This will drop you below {minRequired}%!
                          </p>
                        ) : (
                          <p className="text-xs text-text-muted mt-2">
                            You will still be above the {minRequired}% requirement.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-xl border border-border border-dashed text-center"
                    >
                      <p className="text-xs text-text-muted">Enter a number to see the projection</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
            
          </div>
        )}
      </motion.div>
    </div>
  );
}
