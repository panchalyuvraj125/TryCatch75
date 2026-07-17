import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubjects } from '../hooks/useSubjects';
import { useAttendance } from '../hooks/useAttendance';
import { useCalculator } from '../hooks/useCalculator';
import BunkCalculator from '../components/calculator/BunkCalculator';
import RecoveryPlanner from '../components/calculator/RecoveryPlanner';
import Card from '../components/ui/Card';
import { Calculator as CalcIcon, TrendingUp, TriangleAlert as AlertTriangle, Target, ChevronDown, ChevronUp } from 'lucide-react';
import {
  currentPercent,
  safeBunks,
  classesNeeded,
  whatIfBunk,
  whatIfAttend,
  semesterProjection,
  detentionRisk,
} from '../utils/attendanceCalc';

export default function Calculator() {
  const { subjects } = useSubjects();
  const { getSubjectStats } = useAttendance();
  const { subjectStats } = useCalculator(subjects, getSubjectStats);

  const [mode, setMode] = useState('quick'); // quick, advanced, projection
  const [entries, setEntries] = useState([]);
  const [subject, setSubject] = useState('');
  const [conducted, setConducted] = useState('');
  const [attended, setAttended] = useState('');
  const [bunkCount, setBunkCount] = useState(1);
  const [attendCount, setAttendCount] = useState(1);
  const [daysLeft, setDaysLeft] = useState(60);

  const handleAdd = () => {
    if (!subject || !conducted || !attended) return;
    setEntries([
      ...entries,
      {
        id: Date.now().toString(),
        subject,
        conducted: parseInt(conducted),
        attended: parseInt(attended),
      },
    ]);
    setSubject('');
    setConducted('');
    setAttended('');
  };

  // Calculate detention risk from all subjects
  const overallRisk = detentionRisk(
    subjectStats.map(s => ({ present: s.present, total: s.total })),
    75
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-widest text-[var(--text-secondary)] font-mono uppercase mb-2">
          05 · CALCULATOR
        </p>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          % <span className="text-[var(--accent-orange)] italic font-medium">calculator</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          Advanced attendance calculations and projections
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'quick', label: 'Quick Calc', icon: CalcIcon },
          { id: 'advanced', label: 'Bunk Planner', icon: Target },
          { id: 'projection', label: 'Semester', icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === tab.id
                ? 'bg-[var(--accent-orange)] text-white'
                : 'bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent-orange)]'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Risk Banner */}
      {subjectStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            overallRisk.riskLevel <= 30
              ? 'bg-[var(--accent-green)]/10 border-[var(--accent-green)]/30'
              : overallRisk.riskLevel <= 60
              ? 'bg-[var(--accent-yellow)]/10 border-[var(--accent-yellow)]/30'
              : 'bg-[var(--accent-red)]/10 border-[var(--accent-red)]/30'
          }`}
        >
          <AlertTriangle
            size={24}
            className={
              overallRisk.riskLevel <= 30
                ? 'text-[var(--accent-green)]'
                : overallRisk.riskLevel <= 60
                ? 'text-[var(--accent-yellow)]'
                : 'text-[var(--accent-red)]'
            }
          />
          <div>
            <p className="font-semibold text-[var(--text-primary)]">
              Detention Risk: {overallRisk.riskLabel}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Risk Level: {overallRisk.riskLevel}% •{' '}
              {subjectStats[overallRisk.worstSubjectIndex]?.name || 'N/A'} is your lowest
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick Calculator Mode */}
      {mode === 'quick' && (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-mono font-bold tracking-widest text-[var(--text-secondary)] mb-2 uppercase">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. PPS (TH)"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-mono font-bold tracking-widest text-[var(--text-secondary)] mb-2 uppercase">
                  Conducted
                </label>
                <input
                  type="number"
                  value={conducted}
                  onChange={(e) => setConducted(e.target.value)}
                  placeholder="Total"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-mono font-bold tracking-widest text-[var(--text-secondary)] mb-2 uppercase">
                  Attended
                </label>
                <input
                  type="number"
                  value={attended}
                  onChange={(e) => setAttended(e.target.value)}
                  placeholder="Attended"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                />
              </div>
              <button
                onClick={handleAdd}
                className="w-full md:w-auto px-6 py-3 bg-[var(--accent-orange)] text-white font-medium rounded-lg hover:bg-[#e05b29] transition-colors whitespace-nowrap"
              >
                + Add
              </button>
            </div>
          </Card>

          {entries.length > 0 ? (
            <div className="space-y-3">
              {entries.map((entry) => {
                const percent = currentPercent(entry.attended, entry.conducted);
                const safe = safeBunks(entry.attended, entry.conducted);
                const needed = classesNeeded(entry.attended, entry.conducted);
                const status = percent >= 75 ? 'safe' : percent >= 65 ? 'danger' : 'critical';

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                          {entry.subject}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {entry.attended} / {entry.conducted} classes
                        </p>
                      </div>
                      <div
                        className={`font-mono text-3xl font-bold ${
                          status === 'safe'
                            ? 'text-[var(--accent-green)]'
                            : status === 'danger'
                            ? 'text-[var(--accent-yellow)]'
                            : 'text-[var(--accent-red)]'
                        }`}
                      >
                        {percent.toFixed(1)}%
                      </div>
                    </div>

                    {/* What-If Section */}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[var(--border-default)]">
                      <div>
                        <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                          If I Bunk
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            defaultValue={1}
                            className="w-16 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded px-2 py-1 text-sm text-center"
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const after = whatIfBunk(entry.attended, entry.conducted, val);
                              e.target.nextElementSibling.textContent = after.toFixed(1) + '%';
                            }}
                          />
                          <span className="text-sm text-[var(--text-secondary)]">→ N/A</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                          If I Attend
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            defaultValue={1}
                            className="w-16 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded px-2 py-1 text-sm text-center"
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const after = whatIfAttend(entry.attended, entry.conducted, val);
                              e.target.nextElementSibling.textContent = after.toFixed(1) + '%';
                            }}
                          />
                          <span className="text-sm text-[var(--text-secondary)]">→ N/A</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Bar */}
                    <div className="mt-4 flex items-center gap-3 text-xs">
                      {percent >= 75 ? (
                        <span className="px-3 py-1.5 bg-[var(--accent-green)]/20 text-[var(--accent-green)] rounded-full font-medium">
                          ✓ Safe to bunk {safe} more classes
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-[var(--accent-red)]/20 text-[var(--accent-red)] rounded-full font-medium">
                          ⚠ Attend {needed} consecutive classes
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🧮</div>
              <h3 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-2 italic">
                Empty calculator.
              </h3>
              <p className="text-[var(--text-secondary)]">
                Add a subject above to see the math.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Advanced Bunk Planner Mode */}
      {mode === 'advanced' && (
        <div className="space-y-6">
          {subjectStats.length > 0 ? (
            <>
              <BunkCalculator subjectStats={subjectStats} threshold={75} />

              {/* What-If Calculator */}
              <Card>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                  What-If Calculator
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Select a subject and see the impact of bunking or attending classes
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-2">
                      Subject
                    </label>
                    <select
                      className="w-full cyber-input"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      <option value="">Select Subject</option>
                      {subjectStats.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.percent.toFixed(1)}%)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-2">
                      If I Bunk
                    </label>
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
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-2">
                      If I Attend
                    </label>
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

                {subject && (
                  <div className="grid grid-cols-2 gap-4">
                    {(() => {
                      const s = subjectStats.find((x) => x.id === subject);
                      if (!s) return null;
                      const afterBunk = whatIfBunk(s.present, s.total, bunkCount);
                      const afterAttend = whatIfAttend(s.present, s.total, attendCount);
                      return (
                        <>
                          <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-default)]">
                            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                              After Bunking {bunkCount}
                            </p>
                            <span
                              className={`text-3xl font-bold ${
                                afterBunk >= 75
                                  ? 'text-[var(--accent-green)]'
                                  : 'text-[var(--accent-red)]'
                              }`}
                            >
                              {afterBunk.toFixed(1)}%
                            </span>
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                              {afterBunk >= 75
                                ? 'Still safe!'
                                : `${classesNeeded(s.present, s.total + bunkCount, 75)} classes to recover`}
                            </p>
                          </div>
                          <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-default)]">
                            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                              After Attending {attendCount}
                            </p>
                            <span
                              className={`text-3xl font-bold ${
                                afterAttend >= 75
                                  ? 'text-[var(--accent-green)]'
                                  : 'text-[var(--accent-red)]'
                              }`}
                            >
                              {afterAttend.toFixed(1)}%
                            </span>
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                              {s.percent < 75 && afterAttend >= 75
                                ? 'Would reach safety!'
                                : 'Keep it up!'}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </Card>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-2">
                No subjects yet
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Add subjects to see bunk calculations
              </p>
            </div>
          )}
        </div>
      )}

      {/* Semester Projection Mode */}
      {mode === 'projection' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
              Semester Projection
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Project where your attendance will end up based on current trends
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-2">
                  Working Days Left in Semester
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={daysLeft}
                  onChange={(e) => setDaysLeft(parseInt(e.target.value) || 1)}
                  className="cyber-input"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-2">
                  Avg. Classes per Subject/Day
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  defaultValue={1}
                  className="cyber-input"
                />
              </div>
            </div>
          </Card>

          {subjectStats.length > 0 ? (
            <div className="space-y-3">
              <RecoveryPlanner subjectStats={subjectStats} threshold={75} />

              {/* Projection Cards */}
              <h4 className="text-sm font-semibold text-[var(--text-secondary)] mt-6">
                End-of-Semester Projections
              </h4>
              {subjectStats.map((s) => {
                const proj = semesterProjection(s.present, s.total, daysLeft);
                return (
                  <Card key={s.id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)]">{s.name}</h4>
                        <p className="text-xs text-[var(--text-muted)]">
                          Current: {s.percent.toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-2xl font-bold ${
                            proj.projectedPercent >= 75
                              ? 'text-[var(--accent-green)]'
                              : 'text-[var(--accent-red)]'
                          }`}
                        >
                          {proj.projectedPercent.toFixed(1)}%
                        </span>
                        <p className="text-xs text-[var(--text-muted)]">
                          {proj.projectedPresent}/{proj.projectedTotal} classes
                        </p>
                      </div>
                    </div>

                    {/* Visual progress bar */}
                    <div className="mt-3 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          proj.projectedPercent >= 75
                            ? 'bg-[var(--accent-green)]'
                            : proj.projectedPercent >= 65
                            ? 'bg-[var(--accent-yellow)]'
                            : 'bg-[var(--accent-red)]'
                        }`}
                        style={{ width: `${Math.min(100, proj.projectedPercent)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
                      <span>0%</span>
                      <span className="text-[var(--accent-orange)]">75% threshold</span>
                      <span>100%</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-2">
                No subjects yet
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Add subjects to see semester projections
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
