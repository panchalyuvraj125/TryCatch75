import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSubjects } from '../hooks/useSubjects';
import { useAttendance } from '../hooks/useAttendance';
import { useCalculator } from '../hooks/useCalculator';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Target, TrendingUp, TriangleAlert as AlertTriangle, Calendar, Clock, Zap, Coffee, Award } from 'lucide-react';
import {
  safeBunks,
  classesNeeded,
  whatIfBunk,
  whatIfAttend,
  weeklyBunkBudget,
  bunkMilestone,
} from '../utils/attendanceCalc';

export default function BunkPlanner() {
  const { subjects } = useSubjects();
  const { getSubjectStats } = useAttendance();
  const { subjectStats, calculateWhatIf } = useCalculator(subjects, getSubjectStats);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [bunkCount, setBunkCount] = useState(1);
  const [attendCount, setAttendCount] = useState(1);
  const [daysLeft, setDaysLeft] = useState(60);
  const [subjectsPerDay, setSubjectsPerDay] = useState(4);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate total bunk stats
  const totalBunksUsed = useMemo(() => {
    return subjectStats.reduce((acc, s) => acc + (s.absent || 0), 0);
  }, [subjectStats]);

  const milestone = useMemo(() => bunkMilestone(totalBunksUsed), [totalBunksUsed]);

  const whatIf = selectedSubject ? calculateWhatIf(selectedSubject, bunkCount, attendCount) : null;
  const currentSubject = subjectStats.find(s => s.id === selectedSubject);

  // Categorize subjects
  const safeSubjects = subjectStats.filter(s => s.total > 0 && s.percent >= 75);
  const dangerSubjects = subjectStats.filter(s => s.total > 0 && s.percent >= 65 && s.percent < 75);
  const criticalSubjects = subjectStats.filter(s => s.total > 0 && s.percent < 65);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <p className="text-[10px] tracking-widest text-[var(--text-muted)] font-mono uppercase mb-2">
          05 · PLANNER
        </p>
        <h1 className="font-heading text-4xl font-bold text-[var(--text-primary)] tracking-tight">
          Bunk <span className="text-[var(--accent-orange)] italic font-medium">Planner</span>
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-2">
          Know exactly how many classes you can afford to miss, or need to attend.
        </p>
      </div>

      {/* Achievement Banner */}
      {totalBunksUsed > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-[var(--accent-purple)]/20 via-[var(--accent-cyan)]/20 to-[var(--accent-orange)]/20 border border-[var(--border-default)] rounded-xl p-4 flex items-center gap-4"
        >
          <div className="text-4xl">{milestone.emoji}</div>
          <div>
            <p className="font-bold text-[var(--text-primary)]">{milestone.label}</p>
            <p className="text-sm text-[var(--text-secondary)]">
              You've strategically bunked {totalBunksUsed} classes total
            </p>
          </div>
        </motion.div>
      )}

      {subjects.length > 0 ? (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="text-center py-4">
              <div className="text-2xl font-bold text-[var(--accent-green)]">{safeSubjects.length}</div>
              <p className="text-xs text-[var(--text-muted)]">Safe Subjects</p>
            </Card>
            <Card className="text-center py-4">
              <div className="text-2xl font-bold text-[var(--accent-yellow)]">{dangerSubjects.length}</div>
              <p className="text-xs text-[var(--text-muted)]">In Danger</p>
            </Card>
            <Card className="text-center py-4">
              <div className="text-2xl font-bold text-[var(--accent-red)]">{criticalSubjects.length}</div>
              <p className="text-xs text-[var(--text-muted)]">Critical</p>
            </Card>
            <Card className="text-center py-4">
              <div className="text-2xl font-bold text-[var(--accent-cyan)]">
                {subjectStats.reduce((acc, s) => acc + (s.bunksLeft || 0), 0)}
              </div>
              <p className="text-xs text-[var(--text-muted)]">Total Safe Bunks</p>
            </Card>
          </div>

          {/* Critical Subjects Alert */}
          {criticalSubjects.length > 0 && (
            <Card variant="critical" className="border-[var(--accent-red)]">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="text-[var(--accent-red)]" size={24} />
                <h3 className="font-bold text-[var(--accent-red)]">
                  Critical Alert: {criticalSubjects.length} subject{criticalSubjects.length > 1 ? 's' : ''} at risk
                </h3>
              </div>
              <div className="space-y-2">
                {criticalSubjects.map(subject => (
                  <div key={subject.id} className="flex items-center justify-between bg-[var(--bg-secondary)] p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{subject.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {subject.percent.toFixed(1)}% attendance
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[var(--accent-red)]">
                        {subject.classesNeeded}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">must attend</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Safe Subjects with Bunk Budget */}
          {safeSubjects.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <Coffee size={16} /> Safe to Bunk
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {safeSubjects.map(subject => {
                  const weekly = weeklyBunkBudget(subject.present, subject.total, daysLeft, subjectsPerDay);
                  return (
                    <Card key={subject.id} variant="safe">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[var(--text-primary)]">{subject.name}</h4>
                        <Badge variant="safe">{subject.percent.toFixed(0)}%</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-[var(--bg-secondary)] p-2 rounded-lg">
                          <p className="text-2xl font-bold text-[var(--accent-green)]">{subject.bunksLeft}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">immediate bunks</p>
                        </div>
                        <div className="bg-[var(--bg-secondary)] p-2 rounded-lg">
                          <p className="text-2xl font-bold text-[var(--accent-cyan)]">{weekly}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">bunks/week</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Danger Zone Subjects */}
          {dangerSubjects.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--accent-yellow)] mb-3 flex items-center gap-2">
                <Zap size={16} /> Danger Zone (65-74%)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dangerSubjects.map(subject => (
                  <Card key={subject.id} variant="danger">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-[var(--text-primary)]">{subject.name}</h4>
                      <Badge variant="danger">{subject.percent.toFixed(0)}%</Badge>
                    </div>
                    <div className="bg-[var(--bg-secondary)] p-2 rounded-lg text-center">
                      <p className="text-xl font-bold text-[var(--accent-yellow)]">
                        {subject.bunksLeft > 0 ? `${subject.bunksLeft} bunks left` : 'Attend all classes'}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {subject.percent < 75 && `Need ${subject.classesNeeded} more to be safe`}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* What-If Calculator */}
          <Card>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Target size={20} className="text-[var(--accent-orange)]" />
              What-If Calculator
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-xs text-[var(--text-muted)] mb-2">Select Subject</label>
                <select
                  className="w-full cyber-input"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">Choose a subject...</option>
                  {subjectStats.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.percent.toFixed(1)}%)</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-[var(--text-muted)] mb-2">If I Bunk...</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={bunkCount}
                    onChange={(e) => setBunkCount(parseInt(e.target.value) || 0)}
                    className="cyber-input flex-1"
                  />
                  <span className="text-sm text-[var(--text-muted)]">classes</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-[var(--text-muted)] mb-2">Or If I Attend...</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={attendCount}
                    onChange={(e) => setAttendCount(parseInt(e.target.value) || 0)}
                    className="cyber-input flex-1"
                  />
                  <span className="text-sm text-[var(--text-muted)]">classes</span>
                </div>
              </div>
            </div>

            {whatIf && currentSubject && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-default)]">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 font-mono">
                    After Bunking {bunkCount}
                  </p>
                  <div className="flex items-end gap-3">
                    <span className={`text-3xl font-bold ${whatIf.afterBunk >= 75 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                      {whatIf.afterBunk.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    {whatIf.afterBunk >= 75
                      ? `Still safe! ${Math.max(0, currentSubject.bunksLeft - bunkCount)} bunks remaining`
                      : `Will need ${classesNeeded(currentSubject.present, currentSubject.total + bunkCount)} consecutive classes`}
                  </p>
                </div>
                <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-default)]">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 font-mono">
                    After Attending {attendCount}
                  </p>
                  <div className="flex items-end gap-3">
                    <span className={`text-3xl font-bold ${whatIf.afterAttend >= 75 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                      {whatIf.afterAttend.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    {currentSubject.percent < 75 && whatIf.afterAttend >= 75
                      ? 'Would reach safety threshold!'
                      : whatIf.afterAttend >= 75
                      ? `Even safer. +${safeBunks(currentSubject.present + attendCount, currentSubject.total + attendCount)} bunks gained`
                      : 'Still below threshold'}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Advanced Settings */}
          <Card>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                <Calendar size={16} />
                Semester Settings
              </h3>
              {showAdvanced ? <span>Hide</span> : <span>Show</span>}
            </button>

            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--border-default)]"
              >
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-2">
                    Days Left in Semester
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={daysLeft}
                    onChange={(e) => setDaysLeft(parseInt(e.target.value) || 60)}
                    className="cyber-input"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-2">
                    Avg Classes per Subject/Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={subjectsPerDay}
                    onChange={(e) => setSubjectsPerDay(parseInt(e.target.value) || 1)}
                    className="cyber-input"
                  />
                </div>
              </motion.div>
            )}
          </Card>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🧮</div>
          <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-2 italic">
            No subjects yet
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Add subjects in the Dashboard to start planning your bunks.
          </p>
        </div>
      )}
    </div>
  );
}
